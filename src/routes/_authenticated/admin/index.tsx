import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { adminListCourses, adminListQuestions, adminListUsers } from '@/lib/admin.functions';
import { BookOpen, HelpCircle, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const listCoursesFn = useServerFn(adminListCourses);
  const listQuestionsFn = useServerFn(adminListQuestions);
  const listUsersFn = useServerFn(adminListUsers);

  const { data: courses = [] } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => listCoursesFn(),
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['adminQuestions'],
    queryFn: () => listQuestionsFn({ data: {} }),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => listUsersFn(),
  });

  const totalSubtopics = courses.reduce((acc, c) => acc + (c.subtopics?.length || 0), 0);
  const totalQuestions = courses.reduce((acc, c) => acc + (c.questionCount || 0), 0) || questions.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
            <BookOpen className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalSubtopics} total subtopics configured</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
            <HelpCircle className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalQuestions}</div>
            <p className="text-xs text-muted-foreground mt-1">MCQ & MSQ Oracle Fusion items</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Trainees</CardTitle>
            <Users className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Batch participants enrolled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Shortcut links to admin operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to="/admin/courses"
              className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Manage Courses & Topics</p>
                  <p className="text-xs text-muted-foreground">Create or edit syllabus modules</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/questions"
              className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Question Bank Editor</p>
                  <p className="text-xs text-muted-foreground">Add new MCQs, edit answers & explanations</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Assign & Manage User Roles</p>
                  <p className="text-xs text-muted-foreground">Promote trainees to Admin or Super Admin</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Trainee & Admin Roles</p>
                  <p className="text-xs text-muted-foreground">Promote batch members to Admin</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health & Security</CardTitle>
            <CardDescription>Security policies & database state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Row Level Security (RLS) Active</p>
                <p className="text-xs opacity-90 mt-0.5">
                  Answer keys are stripped server-side during live quizzes. Users cannot read correct answers via browser dev tools.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Super Admin Configured</p>
                <p className="text-xs opacity-90 mt-0.5">
                  Root privileges anchored to <code className="bg-background/80 px-1 py-0.5 rounded text-[11px]">veerababusaviti21@gmail.com</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
