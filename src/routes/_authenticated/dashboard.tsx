import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { BarChart3, Flame, Play, Timer, TrendingDown, TrendingUp, GraduationCap, Trophy, ShieldAlert } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, listCourses, getMyProfile } from "@/lib/quiz.functions";
import { getMyRole } from "@/lib/admin.functions";

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
  const statsFn = useServerFn(getDashboardStats);
  const listFn = useServerFn(listCourses);
  const meFn = useServerFn(getMyProfile);
  const roleFn = useServerFn(getMyRole);

  const me = useQuery({ queryKey: ["me"], queryFn: () => meFn() });
  const stats = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => statsFn() });
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => listFn() });
  const { data: roleInfo } = useQuery({ queryKey: ["myRole"], queryFn: () => roleFn() });

  useEffect(() => {
    if (me.data && !me.data.onboarded_at) nav({ to: "/onboarding" });
  }, [me.data, nav]);

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
          </div>
        </section>

        {/* Active / Paused Attempt Banner */}
        {stats.data?.recent?.[0] && !stats.data.recent[0].completed_at && (
          <div className="card-elevated p-5 bg-gradient-to-r from-primary/15 via-primary/5 to-card border-primary/40 flex items-center justify-between gap-4 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">You have a quiz in progress!</h3>
                <p className="text-xs text-muted-foreground">Resume your paused session where you left off.</p>
              </div>
            </div>
            <Button asChild className="gap-2">
              <Link to="/quiz/run/$attemptId" params={{ attemptId: stats.data.recent[0].id }}>
                Resume Quiz <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
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