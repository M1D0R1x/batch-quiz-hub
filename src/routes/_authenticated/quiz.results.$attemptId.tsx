import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Flag, Home, RotateCcw, X, AlertTriangle, TrendingDown, BookOpen, Trophy, Target, CheckSquare, Circle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAttemptResult, startWeakAreaAttempt } from "@/lib/quiz.functions";
import { getCleanExplanation } from "@/lib/explanation.utils";
import { EldenRingBanner, type EldenRingBannerType } from "@/components/elden-ring-banner";
import { useEldenRing } from "@/hooks/use-elden-ring";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/quiz/results/$attemptId")({
  head: () => ({
    meta: [
      { title: "Results — QuizForge" },
      { name: "description", content: "Your quiz results and per-topic breakdown." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Results,
});

function Results() {
  const { attemptId } = Route.useParams();
  const navigate = useNavigate();
  const { isEldenRing } = useEldenRing();
  const fn = useServerFn(getAttemptResult);
  const startWeakFn = useServerFn(startWeakAreaAttempt);

  const q = useQuery({ queryKey: ["result", attemptId], queryFn: () => fn({ data: { attemptId } }) });
  const confettiFired = useRef(false);
  const [bannerType, setBannerType] = useState<EldenRingBannerType>(null);

  const startWeakMutation = useMutation({
    mutationFn: () => startWeakFn(),
    onSuccess: (res) => {
      toast.success(`Launched Weak-Area Practice with ${res.count} targeted questions!`);
      navigate({ to: "/quiz/run/$attemptId", params: { attemptId: res.attemptId } });
    },
    onError: (e: any) => {
      toast.error(e.message ?? "Failed to start weak-area drill");
    },
  });

  useEffect(() => {
    if (q.data && !confettiFired.current) {
      const percent = q.data.attempt.max_score
        ? Math.round((Number(q.data.attempt.score) / Number(q.data.attempt.max_score)) * 100)
        : 0;

      confettiFired.current = true;

      // Elden Ring victory/defeat banner trigger (60% Accenture passing threshold)
      if (percent >= 90 || (percent >= 80 && q.data.attempt.is_simulate)) {
        setBannerType("GOD_SLAIN");
      } else if (percent >= 60) {
        setBannerType("DEMIGOD_FELLED");
      } else {
        setBannerType("YOU_DIED");
      }

      if (percent >= 80) {
        // Multi-burst confetti
        const fire = (particleRatio: number, opts: any) => {
          confetti({
            origin: { y: 0.7 },
            ...opts,
            particleCount: Math.floor(200 * particleRatio),
          });
        };
        setTimeout(() => {
          fire(0.25, { spread: 26, startVelocity: 55 });
          fire(0.2, { spread: 60 });
          fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
          fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
          fire(0.1, { spread: 120, startVelocity: 45 });
        }, 400);
      }
    }
  }, [q.data]);

  if (q.isLoading || !q.data) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-8 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  const { attempt, details, breakdown, course, negPenalty = 0, totalDeductions = 0 } = q.data as any;
  const percent = attempt.max_score ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100) : 0;
  const timeMs =
    attempt.completed_at && attempt.started_at
      ? new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()
      : 0;
  const mins = Math.floor(timeMs / 60000);
  const secs = Math.floor((timeMs % 60000) / 1000);
  const tone = percent >= 70 ? "text-success" : percent >= 40 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Score Hero */}
        <section className="card-elevated p-6 animate-fade-up relative overflow-hidden">
          {percent >= 80 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/5 rounded-full blur-3xl" />
            </div>
          )}
          <div className="flex flex-wrap items-end justify-between gap-4 relative">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1.5">
                {percent >= 80 && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                {course?.name} · {attempt.is_simulate ? "Simulated exam" : "Practice quiz"}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Your Score</h1>
              <div className={`mt-2 text-6xl font-black ${tone}`}>{percent}%</div>
              <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                <span>{Number(attempt.score).toFixed(1)} / {attempt.max_score} points</span>
                <span className="text-border">·</span>
                <span>{mins}m {secs}s</span>
              </div>
              {negPenalty > 0 && totalDeductions > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  −{totalDeductions.toFixed(2)} pts from negative marking ({negPenalty} per wrong answer)
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isEldenRing && (
                <Button
                  onClick={() => {
                    const calculated = percent >= 90 || (percent >= 80 && attempt.is_simulate) ? "GOD_SLAIN" : percent >= 60 ? "DEMIGOD_FELLED" : "YOU_DIED";
                    setBannerType(calculated);
                  }}
                  variant="outline"
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-display text-xs"
                >
                  👑 Replay Elden Fate
                </Button>
              )}
              <Button onClick={() => startWeakMutation.mutate()} disabled={startWeakMutation.isPending} variant="secondary" className="gap-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/40">
                <Target className="h-4 w-4" /> {startWeakMutation.isPending ? "Generating..." : "Retest Weak Areas"}
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard"><Home className="mr-2 h-4 w-4" />Dashboard</Link>
              </Button>
              <Button asChild>
                <Link to="/quiz/setup"><RotateCcw className="mr-2 h-4 w-4" />Retry Quiz</Link>
              </Button>
            </div>
          </div>
          <p className="mt-4 rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
            <strong>Scoring:</strong> MCQ awards 1 point for the correct choice. MSQ uses partial credit:
            (correct selected − wrong selected) ÷ total correct, floored at 0.
            {negPenalty > 0 && ` Negative marking: −${negPenalty} for each wrong answer.`}
          </p>
        </section>

        {/* Per-chapter breakdown */}
        <section className="card-elevated p-6 animate-fade-up">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Per-chapter breakdown
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} interval={0} angle={-15} height={50} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }}
                  formatter={(v: number) => [`${v}%`, "Score"]}
                />
                <Bar dataKey="percent" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Question by question */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Question by question</h2>
          {details.map((d: any, i: number) => {
            const correctSet = new Set(d.correct_answers);
            const userSet = new Set(d.user_answers);
            const fullyCorrect = d.gained >= 1;
            const zero = d.gained === 0;
            const isMsq = d.type === "msq" || (d.correct_answers && d.correct_answers.length > 1);
            return (
              <div key={d.id} className="card-elevated p-5 animate-fade-up">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span>Q{i + 1} · {d.subtopic_name} · {d.difficulty}</span>
                    {isMsq ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] uppercase font-bold text-amber-500">
                        <CheckSquare className="w-2.5 h-2.5" /> MSQ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] uppercase font-bold text-sky-400">
                        <Circle className="w-2.5 h-2.5" /> MCQ
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-2">
                    {d.flagged && <Flag className="h-3.5 w-3.5 fill-warning text-warning" />}
                    {d.deduction > 0 && (
                      <span className="text-destructive flex items-center gap-0.5">
                        <AlertTriangle className="h-3 w-3" /> −{d.deduction.toFixed(2)}
                      </span>
                    )}
                    <span className={fullyCorrect ? "text-success" : zero ? "text-destructive" : "text-warning"}>
                      {(d.gained * 1).toFixed(2)} pt
                    </span>
                  </span>
                </div>
                <h3 className="font-medium">{d.question_text}</h3>
                <ul className="mt-3 space-y-1.5">
                  {d.options.map((opt: string, oi: number) => {
                    const isCorrect = correctSet.has(oi);
                    const isPicked = userSet.has(oi);
                    const cls = isCorrect
                      ? "border-success/60 bg-success/10 text-foreground"
                      : isPicked
                      ? "border-destructive/60 bg-destructive/10 text-foreground"
                      : "border-border";
                    return (
                      <li key={oi} className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${cls}`}>
                        {isCorrect ? <Check className="mt-0.5 h-4 w-4 text-success" /> :
                         isPicked ? <X className="mt-0.5 h-4 w-4 text-destructive" /> :
                         <span className="mt-0.5 h-4 w-4" />}
                        <span>{opt}</span>
                      </li>
                    );
                  })}
                </ul>
                {d.explanation && (
                  <div className="mt-3 rounded-md bg-secondary/60 p-3 text-sm">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Explanation & Key Takeaway</div>
                    <p className="leading-relaxed text-muted-foreground">
                      {getCleanExplanation(d.explanation, d.options, d.correct_answers)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* Elden Ring Victory / Defeat Banner Overlay */}
      <EldenRingBanner type={bannerType} onClose={() => setBannerType(null)} />
    </div>
  );
}