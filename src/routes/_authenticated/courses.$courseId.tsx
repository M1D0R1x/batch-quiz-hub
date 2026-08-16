import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Play, Pause, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourseDetail, getInProgressAttempts, discardAttempt } from "@/lib/quiz.functions";

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Course — QuizForge" },
      { name: "description", content: "Browse chapters and start a quiz." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { courseId } = Route.useParams();
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const fn = useServerFn(getCourseDetail);
  const inProgressFn = useServerFn(getInProgressAttempts);
  const discardFn = useServerFn(discardAttempt);

  const q = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fn({ data: { courseId } }),
  });

  const inProgress = useQuery({
    queryKey: ['in-progress-attempts'],
    queryFn: () => inProgressFn(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const existingAttempt = inProgress.data?.find((a: any) => a.courseId === courseId) || null;

  const discardMutation = useMutation({
    mutationFn: (attemptId: string) => discardFn({ data: { attemptId } }),
    onSuccess: () => {
      toast.success("Paused quiz discarded.");
      queryClient.invalidateQueries({ queryKey: ['in-progress-attempts'] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to discard quiz"),
  });

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {existingAttempt && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0">
                  <Pause className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    You have a paused {existingAttempt.isSimulate ? "exam simulation" : "quiz"} for this course
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {existingAttempt.answeredCount}/{existingAttempt.questionCount} questions answered
                    {existingAttempt.draftSavedAt && (
                      <> · saved {new Date(existingAttempt.draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-amber-500/30 hover:bg-amber-500/15"
                  disabled={discardMutation.isPending}
                  onClick={() => discardMutation.mutate(existingAttempt.id)}
                >
                  Discard & Start Fresh
                </Button>
                <Button
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => nav({ to: "/quiz/run/$attemptId", params: { attemptId: existingAttempt.id } })}
                >
                  Resume Quiz <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {q.isLoading && <Skeleton className="h-24 w-full" />}
        {q.data && (
          <>
            <div className="animate-fade-up">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Course</div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">{q.data.course.name}</h1>
              <p className="mt-2 text-muted-foreground">{q.data.course.description}</p>
              <div className="mt-4">
                <Button asChild className="gap-2">
                  <Link to="/quiz/setup" search={{ courseId }}>
                    <Play className="h-4 w-4" /> Quiz this course
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-3">
              {q.data.subtopics.map((s: any) => (
                <div key={s.id} className="card-elevated flex items-center justify-between p-5">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.question_count} questions available</div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/quiz/setup" search={{ courseId, subtopicId: s.id }}>
                      Practice
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}