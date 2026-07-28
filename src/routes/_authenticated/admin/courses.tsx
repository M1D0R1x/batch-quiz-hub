import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { adminListCourses, adminCreateCourse, adminCreateSubtopic } from '@/lib/admin.functions';
import { Plus, BookOpen, Layers, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/admin/courses')({
  component: AdminCoursesPage,
});

function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const listCoursesFn = useServerFn(adminListCourses);
  const createCourseFn = useServerFn(adminCreateCourse);
  const createSubtopicFn = useServerFn(adminCreateSubtopic);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [subtopicName, setSubtopicName] = useState('');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => listCoursesFn(),
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) => createCourseFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      toast.success('Course created successfully');
      setCourseName('');
      setCourseDesc('');
      setShowCourseModal(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const createSubtopicMutation = useMutation({
    mutationFn: (data: { courseId: string; name: string }) => createSubtopicFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      toast.success('Subtopic added successfully');
      setSubtopicName('');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    createCourseMutation.mutate({ name: courseName, description: courseDesc });
  };

  const handleCreateSubtopic = (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    if (!subtopicName.trim()) return;
    createSubtopicMutation.mutate({ courseId, name: subtopicName });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Courses & Modules</h2>
          <p className="text-sm text-muted-foreground">Manage learning tracks and topic breakdowns</p>
        </div>
        <Button onClick={() => setShowCourseModal(!showCourseModal)} className="gap-2">
          <Plus className="w-4 h-4" /> Add New Course
        </Button>
      </div>

      {showCourseModal && (
        <Card className="border-primary/40 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Create New Course Track</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Title</label>
                <Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Oracle Fusion PaaS Advanced Integrations"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Overview of syllabus topics..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowCourseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCourseMutation.isPending}>
                  {createCourseMutation.isPending ? 'Creating...' : 'Save Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription className="text-xs">{course.description || 'No description'}</CardDescription>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                    {course.questionCount} Questions
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtopics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {course.subtopics?.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card text-xs font-medium"
                      >
                        <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => handleCreateSubtopic(e, course.id)}
                  className="flex items-center gap-2 pt-2 border-t border-border"
                >
                  <Input
                    value={selectedCourseId === course.id ? subtopicName : ''}
                    onChange={(e) => {
                      setSelectedCourseId(course.id);
                      setSubtopicName(e.target.value);
                    }}
                    placeholder="Add subtopic name..."
                    className="text-xs h-9"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createSubtopicMutation.isPending || !subtopicName || selectedCourseId !== course.id}
                    className="gap-1 h-9 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Subtopic
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
