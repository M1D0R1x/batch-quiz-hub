import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BarChart3, Flame, Play, Timer, TrendingDown, TrendingUp, GraduationCap, Trophy, ShieldAlert, Target, Zap, ArrowRight, Sparkles, Pause, Trash2, Lock, Unlock } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, listCourses, getMyProfile, getWeakAreaStats, startWeakAreaAttempt, getInProgressAttempts, discardAttempt, updateMcq1Toggle } from "@/lib/quiz.functions";
import { getMyRole } from "@/lib/admin.functions";
import { TeamCredits } from "@/components/team-credits";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QuizForge" },
      { name: "description", content: "Your progress, courses, and quick actions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const statsFn = useServerFn(getDashboardStats);
  const listFn = useServerFn(listCourses);
  const meFn = useServerFn(getMyProfile);
  const roleFn = useServerFn(getMyRole);

  const weakFn = useServerFn(getWeakAreaStats);
  const startWeakFn = useServerFn(startWeakAreaAttempt);
  const inProgressFn = useServerFn(getInProgressAttempts);
  const discardFn = useServerFn(discardAttempt);
  const mcq1Fn = useServerFn(updateMcq1Toggle);

  const me = useQuery({ queryKey: ["me"], queryFn: () => meFn() });
  const stats = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => statsFn() });
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => listFn() });
  const weakStats = useQuery({ queryKey: ["weak-area-stats"], queryFn: () => weakFn() });
  const { data: roleInfo } = useQuery({ queryKey: ["myRole"], queryFn: () => roleFn() });
  const inProgress = useQuery({
    queryKey: ['in-progress-attempts'],
    queryFn: () => inProgressFn(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const discardMutation = useMutation({
    mutationFn: (attemptId: string) => discardFn({ data: { attemptId } }),
    onSuccess: () => {
      toast.success("Paused attempt discarded.");
      queryClient.invalidateQueries({ queryKey: ['in-progress-attempts'] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to discard attempt"),
  });

  const mcq1ToggleMutation = useMutation({
    mutationFn: (showMcq1: boolean) => mcq1Fn({ data: { showMcq1 } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(res.showMcq1 ? "MCQ1 courses unlocked!" : "MCQ1 courses hidden.");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update MCQ1 access"),
  });

  const startWeakMutation = useMutation({
    mutationFn: () => startWeakFn(),
    onSuccess: (res) => {
      toast.success(`Launched Weak-Area Practice with ${res.count} targeted questions!`);
      nav({ to: "/quiz/run/$attemptId", params: { attemptId: res.attemptId } });
    },
    onError: (e: any) => {
      toast.error(e.message ?? "Failed to start weak-area drill");
    },
  });

  // Onboarding enforcement is handled by the /_authenticated route guard.
  // No need to duplicate it here.

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Hey {me.data?.display_name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">Pick up where you left off, or launch a fresh drill.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg" className="gap-2">
              <Link to="/quiz/setup"><Play className="h-4 w-4" /> Start a Quiz</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/simulate/setup"><Timer className="h-4 w-4" /> Simulate Test</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/learn"><GraduationCap className="h-4 w-4" /> Study Mode</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/leaderboard"><Trophy className="h-4 w-4" /> Leaderboard</Link>
            </Button>
            {roleInfo?.isAdmin && (
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/admin"><ShieldAlert className="h-4 w-4" /> Admin</Link>
              </Button>
            )}
            {/* MCQ1 Access Toggle */}
            <Button
              size="lg"
              variant="outline"
              disabled={mcq1ToggleMutation.isPending}
              onClick={() => mcq1ToggleMutation.mutate(!(me.data?.show_mcq1 ?? false))}
              className={`gap-2 transition-colors ${
                me.data?.show_mcq1
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  : "border-muted-foreground/30 text-muted-foreground hover:text-foreground"
              }`}
              title={me.data?.show_mcq1 ? "MCQ1 courses are visible — click to hide" : "MCQ1 courses are hidden — click to show"}
            >
              {me.data?.show_mcq1 ? (
                <><Unlock className="h-4 w-4" /> MCQ1: On</>
              ) : (
                <><Lock className="h-4 w-4" /> MCQ1: Off</>
              )}
            </Button>
          </div>
        </section>


        {/* Retest Weak-Areas Flashy Compact Banner */}
        {weakStats.data && weakStats.data.wrongCount > 0 && (
          <div className="relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-5 shadow-md shadow-amber-500/5 animate-fade-up">
            {/* Glowing background aura */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-xl bg-amber-500/30 animate-ping" />
                  <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-md shadow-amber-500/20 font-bold">
                    <Target className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-foreground text-base">
                      Retest Mis-answered Questions 🔥
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 shrink-0">
                      {Math.min(weakStats.data.wrongCount, 15)} of {weakStats.data.wrongCount} questions
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Launch a targeted drill containing questions you answered wrong in past quizzes.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => startWeakMutation.mutate()}
                disabled={startWeakMutation.isPending}
                className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-950 font-bold shadow-md shadow-amber-500/20 transition-transform active:scale-95 shrink-0 h-10 px-4 text-xs w-full sm:w-auto"
              >
                <Zap className="w-4 h-4 fill-current" />
                {startWeakMutation.isPending ? "Generating Drill..." : "Practice Weak Areas 🚀"}
              </Button>
            </div>
          </div>
        )}

        {/* In-Progress / Paused Quizzes */}
        {inProgress.data && inProgress.data.length > 0 && (
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Pause className="h-4 w-4 text-primary" />
                Resume where you left off
              </h2>
              <span className="text-xs text-muted-foreground">{inProgress.data.length} paused quiz{inProgress.data.length > 1 ? 'zes' : ''}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {inProgress.data.map((attempt: any) => (
                <div
                  key={attempt.id}
                  className="card-elevated p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-card border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 w-full sm:w-auto">
                    <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shrink-0 mt-0.5 sm:mt-0">
                      {attempt.isSimulate ? <Timer className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm truncate">{attempt.courseName}</h3>
                        {attempt.isSimulate && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase shrink-0">
                            Simulate
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-1.5">
                        <span>{attempt.answeredCount}/{attempt.questionCount} answered</span>
                        {attempt.draftSavedAt && (
                          <span>· saved {new Date(attempt.draftSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Discard this paused quiz"
                      className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1 px-2"
                      disabled={discardMutation.isPending}
                      onClick={() => discardMutation.mutate(attempt.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="sm:hidden">Discard</span>
                    </Button>
                    <Button asChild size="sm" className="gap-1.5 flex-1 sm:flex-initial h-8 text-xs font-semibold">
                      <Link to="/quiz/run/$attemptId" params={{ attemptId: attempt.id }}>
                        Resume <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Quizzes taken"
            value={stats.data?.totalAttempts ?? 0}
            icon={<BarChart3 className="h-4 w-4" />}
            loading={stats.isLoading}
          />
          <StatCard
            label="Average score"
            value={`${stats.data?.avgPercent ?? 0}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            loading={stats.isLoading}
          />
          <StatCard
            label="Day streak"
            value={stats.data?.streak ?? 0}
            icon={<Flame className="h-4 w-4 text-warning" />}
            loading={stats.isLoading}
          />
          <StatCard
            label="Weakest topic"
            value={stats.data?.weakest?.name ?? "—"}
            sub={stats.data?.weakest ? `${stats.data.weakest.percent}%` : undefined}
            icon={<TrendingDown className="h-4 w-4 text-destructive" />}
            loading={stats.isLoading}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your courses</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {courses.isLoading &&
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            {(courses.data ?? []).map((c: any) => (
              <Link
                key={c.id}
                to="/courses/$courseId"
                params={{ courseId: c.id }}
                className="card-elevated flex flex-col gap-2 p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-lg font-semibold">{c.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  <span className="whitespace-nowrap shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {c.subtopics.length} chapters
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.subtopics.slice(0, 4).map((s: any) => (
                    <span key={s.id} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {s.name}
                    </span>
                  ))}
                  {c.subtopics.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{c.subtopics.length - 4} more</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {stats.data && stats.data.recent.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Recent attempts</h2>
            <div className="card-elevated divide-y divide-border">
              {stats.data.recent.map((r: any) => (
                <Link
                  key={r.id}
                  to="/quiz/results/$attemptId"
                  params={{ attemptId: r.id }}
                  className="flex items-center justify-between px-5 py-4 transition hover:bg-secondary/50"
                >
                  <div>
                    <div className="font-medium">
                      {courses.data?.find((c: any) => c.id === r.course_id)?.name ?? "Quiz"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.completed_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${r.percent >= 70 ? "text-success" : r.percent >= 40 ? "text-warning" : "text-destructive"}`}>
                      {r.percent}%
                    </div>
                    <div className="text-xs text-muted-foreground">{r.score.toFixed(1)} / {r.max_score}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <TeamCredits />
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, icon, loading }: any) {
  return (
    <div className="card-elevated p-5 animate-fade-up">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-semibold">
        {loading ? <Skeleton className="h-7 w-16" /> : value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}