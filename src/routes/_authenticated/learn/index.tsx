import { useState, useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listCourses, updateMcq1Toggle, getMyProfile } from '@/lib/quiz.functions';
import { AppHeader } from '@/components/app-header';
import { BookOpen, GraduationCap, ArrowRight, ChevronRight, Layers, ChevronDown, PlayCircle, Sparkles, Search, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/learn/')({
  head: () => ({
    meta: [
      { title: 'Study Mode — QuizForge' },
      { name: 'description', content: 'Master Oracle PaaS topics course-by-course or chapter-by-chapter with interactive flashcards.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LearnOverviewPage,
});

function LearnOverviewPage() {
  const listCoursesFn = useServerFn(listCourses);
  const meFn = useServerFn(getMyProfile);
  const mcq1Fn = useServerFn(updateMcq1Toggle);
  const queryClient = useQueryClient();
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => listCoursesFn(),
  });

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => meFn(),
  });

  const mcq1ToggleMutation = useMutation({
    mutationFn: (showMcq1: boolean) => mcq1Fn({ data: { showMcq1 } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success(res.showMcq1 ? 'MCQ1 courses unlocked!' : 'MCQ1 courses hidden.');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to update MCQ1 access'),
  });

  const toggleExpand = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase().trim();
    return courses
      .map((c) => {
        const matchCourse = c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q);
        const matchedSubs = (c.subtopics || []).filter((s: any) => s.name.toLowerCase().includes(q));
        if (matchCourse || matchedSubs.length > 0) {
          return {
            ...c,
            subtopics: matchCourse ? c.subtopics : matchedSubs,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [courses, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">Study Mode</span>
        </nav>

        {/* Header Title */}
        <div className="space-y-3 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <GraduationCap className="w-4 h-4" /> Flashcard Study Hub
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Select a Course to Begin Practice
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Study entire courses with randomized flashcards or drill down into specific chapters.
          </p>

          {/* Search bar + MCQ1 Toggle row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search courses & chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm w-full bg-card"
              />
            </div>
            {/* MCQ1 Access Toggle */}
            <Button
              variant="outline"
              size="sm"
              disabled={mcq1ToggleMutation.isPending}
              onClick={() => mcq1ToggleMutation.mutate(!(meData?.show_mcq1 ?? false))}
              className={`gap-2 h-10 px-4 shrink-0 transition-colors ${
                meData?.show_mcq1
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={meData?.show_mcq1 ? 'MCQ1 courses visible — click to hide' : 'MCQ1 courses hidden — click to show'}
            >
              {meData?.show_mcq1 ? (
                <><Unlock className="h-3.5 w-3.5" /> MCQ1: On</>
              ) : (
                <><Lock className="h-3.5 w-3.5" /> MCQ1: Off</>
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-sm text-muted-foreground">Loading course catalog...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-up">
            {filteredCourses.map((course: any) => {
              const isExpanded = expandedCourseId === course.id || !!searchQuery.trim();
              const subtopics = course.subtopics || [];

              return (
                <div key={course.id} className="card-elevated p-6 space-y-6">
                  {/* Top-Level Course Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-foreground">{course.name}</h2>
                          <span className="whitespace-nowrap shrink-0 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                            {subtopics.length} chapters
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
                      </div>
                    </div>

                    {/* Course Level Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                      <Button asChild size="sm" className="gap-2 bg-primary text-primary-foreground">
                        <Link to="/learn/course/$courseId" params={{ courseId: course.id }}>
                          <PlayCircle className="w-4 h-4" /> Learn Full Course
                        </Link>
                      </Button>
                      <Button
                        onClick={() => toggleExpand(course.id)}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        {isExpanded ? 'Hide Chapters' : `Chapters (${subtopics.length})`}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Subtopics Grid */}
                  {isExpanded && (
                    <div className="space-y-3 pt-2 animate-fade-up">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-primary" /> Individual Topic Chapters ({subtopics.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {subtopics.map((subtopic: any) => (
                          <Link
                            key={subtopic.id}
                            to="/learn/$subtopicId"
                            params={{ subtopicId: subtopic.id }}
                            className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card/80 hover:bg-muted/50 hover:border-primary/40 transition-all duration-200 shadow-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                  {subtopic.name}
                                </span>
                                {subtopic.question_count != null && (
                                  <span className="text-[11px] text-muted-foreground">{subtopic.question_count} flashcards</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-primary font-semibold shrink-0">
                              <span>Learn</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
