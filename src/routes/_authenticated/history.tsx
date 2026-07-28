import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getDashboardStats, listCourses } from '@/lib/quiz.functions';
import { AppHeader } from '@/components/app-header';
import { History, Calendar, Timer, ArrowRight, BarChart3, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/_authenticated/history')({
  head: () => ({
    meta: [
      { title: 'Attempt History — QuizForge' },
      { name: 'description', content: 'View your completed quiz and exam attempts.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const getStatsFn = useServerFn(getDashboardStats);
  const listCoursesFn = useServerFn(listCourses);

  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getStatsFn(),
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => listCoursesFn(),
  });

  const courseMap = new Map((courses ?? []).map((c: any) => [c.id, c.name]));
  const attempts = stats?.recent ?? [];

  const filteredAttempts = selectedCourse === 'all'
    ? attempts
    : attempts.filter((a: any) => a.course_id === selectedCourse);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">Attempt History</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <History className="w-4 h-4" /> Performance Log
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Quiz & Exam Attempt History
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review scores, attempt dates, and detailed question-by-question breakdowns.
            </p>
          </div>

          <div className="w-[200px]">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Attempt List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-sm text-muted-foreground">Loading history log...</p>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="card-elevated p-12 text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-lg font-bold text-foreground">No attempts found</h2>
            <p className="text-sm text-muted-foreground">Complete a practice quiz or simulated exam to view results here.</p>
            <Button asChild size="sm">
              <Link to="/quiz/setup">Start a Quiz Now</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-up">
            <div className="card-elevated divide-y divide-border/60 overflow-hidden">
              {filteredAttempts.map((item: any) => {
                const courseName = courseMap.get(item.course_id) || 'Oracle PaaS Quiz';
                const pass = item.percent >= 70;
                const warn = item.percent >= 40 && item.percent < 70;

                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground">{courseName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.completed_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="text-right">
                        <div
                          className={`text-xl font-extrabold ${
                            pass ? 'text-emerald-500' : warn ? 'text-amber-500' : 'text-rose-500'
                          }`}
                        >
                          {item.percent}%
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.score.toFixed(1)} / {item.max_score} pts
                        </div>
                      </div>

                      <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
                        <Link to="/quiz/results/$attemptId" params={{ attemptId: item.id }}>
                          Review <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
