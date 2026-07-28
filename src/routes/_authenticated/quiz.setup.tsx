import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Play, Timer, AlertTriangle } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listCourses, startAttempt } from "@/lib/quiz.functions";

const searchSchema = z.object({
  courseId: z.string().uuid().optional(),
  subtopicId: z.string().uuid().optional(),
  simulate: z.boolean().optional(),
});

export const Route = createFileRoute("/_authenticated/quiz/setup")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Start a Quiz — QuizForge" },
      { name: "description", content: "Configure your practice quiz." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <QuizSetupPage simulate={false} />,
});

export function QuizSetupPage({ simulate }: { simulate: boolean }) {
  const search = useSearch({ strict: false }) as z.infer<typeof searchSchema>;
  const nav = useNavigate();
  const listFn = useServerFn(listCourses);
  const startFn = useServerFn(startAttempt);

  const courses = useQuery({ queryKey: ["courses"], queryFn: () => listFn() });

  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState<string | null>(search.courseId ?? null);
  const [subtopicIds, setSubtopicIds] = useState<string[]>(search.subtopicId ? [search.subtopicId] : []);
  const [count, setCount] = useState(20);
  const [timeMin, setTimeMin] = useState<number | null>(simulate ? 30 : 20);
  const [mix, setMix] = useState<"mcq" | "msq" | "both">("both");
  const [difficulty, setDifficulty] = useState<"any" | "easy" | "medium" | "hard">("any");
  const [negativePenalty, setNegativePenalty] = useState<0 | 0.25 | 0.33>(0);

  const course = useMemo(() => courses.data?.find((c: any) => c.id === courseId), [courses.data, courseId]);

  useEffect(() => {
    if (!courseId && courses.data && courses.data.length > 0) setCourseId(courses.data[0].id);
  }, [courses.data, courseId]);

  const start = useMutation({
    mutationFn: () =>
      startFn({
        data: {
          courseId: courseId!,
          subtopicIds,
          questionCount: count,
          timeLimitSeconds: timeMin ? timeMin * 60 : null,
          mix,
          difficulty,
          isSimulate: simulate,
          negativePenalty,
        },
      }),
    onSuccess: (res) => nav({ to: "/quiz/run/$attemptId", params: { attemptId: res.attempt.id } }),
    onError: (e: any) => toast.error(e.message ?? "Failed to start"),
  });

  const steps = ["Course", "Chapters", "Count", "Time", "Mix", "Difficulty", "Neg. Marking", "Review"];
  const canNext = () => {
    if (step === 0) return !!courseId;
    if (step === 1) return subtopicIds.length > 0;
    if (step === 2) return count > 0;
    return true;
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              {i < steps.length - 1 && <span className="h-px w-6 bg-border" />}
            </div>
          ))}
        </div>

        <div className="card-elevated p-6 animate-fade-up">
          <h1 className="text-2xl font-semibold">
            {simulate ? "Simulate a test" : "Start a quiz"}: {steps[step]}
          </h1>

          <div className="mt-6 space-y-4">
            {step === 0 && (
              <div className="grid gap-2">
                {courses.isLoading && <Skeleton className="h-16 w-full" />}
                {(courses.data ?? []).map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCourseId(c.id);
                      setSubtopicIds([]);
                    }}
                    className={`rounded-lg border p-4 text-left transition ${courseId === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  >
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.subtopics.length} chapters</div>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && course && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Select chapters</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setSubtopicIds(
                        subtopicIds.length === course.subtopics.length
                          ? []
                          : course.subtopics.map((s: any) => s.id),
                      )
                    }
                  >
                    {subtopicIds.length === course.subtopics.length ? "Clear all" : "Select all"}
                  </Button>
                </div>
                <div className="grid gap-2">
                  {course.subtopics.map((s: any) => {
                    const checked = subtopicIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            setSubtopicIds((prev) =>
                              prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                            )
                          }
                        />
                        <span className="font-medium">{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 50].map((n) => (
                    <Button key={n} variant={count === n ? "default" : "outline"} onClick={() => setCount(n)}>
                      {n}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Custom:</span>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
                    className="max-w-[120px]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 45].map((m) => (
                    <Button key={m} variant={timeMin === m ? "default" : "outline"} onClick={() => setTimeMin(m)}>
                      {m} min
                    </Button>
                  ))}
                  {!simulate && (
                    <Button variant={timeMin === null ? "default" : "outline"} onClick={() => setTimeMin(null)}>
                      No timer
                    </Button>
                  )}
                </div>
                {simulate && (
                  <p className="flex items-center gap-2 rounded-md bg-warning/10 p-3 text-xs text-warning-foreground">
                    <Timer className="h-4 w-4" /> Simulate mode requires a timer — you can't remove it.
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Custom (min):</span>
                  <Input
                    type="number"
                    min={1}
                    max={240}
                    value={timeMin ?? ""}
                    onChange={(e) => setTimeMin(e.target.value ? Number(e.target.value) : null)}
                    className="max-w-[120px]"
                    disabled={simulate && timeMin === null}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-2 sm:grid-cols-3">
                {(["mcq", "msq", "both"] as const).map((v) => (
                  <Button key={v} variant={mix === v ? "default" : "outline"} onClick={() => setMix(v)}>
                    {v === "mcq" ? "MCQ only" : v === "msq" ? "MSQ only" : "Both mixed"}
                  </Button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-2 sm:grid-cols-4">
                {(["any", "easy", "medium", "hard"] as const).map((v) => (
                  <Button key={v} variant={difficulty === v ? "default" : "outline"} onClick={() => setDifficulty(v)}>
                    {v[0].toUpperCase() + v.slice(1)}
                  </Button>
                ))}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Apply a point deduction for each incorrect answer. Unanswered questions carry no penalty.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      { value: 0, label: "Disabled", desc: "No penalty for wrong answers" },
                      { value: 0.25, label: "−0.25 (Standard)", desc: "Standard negative marking" },
                      { value: 0.33, label: "−0.33 (Strict)", desc: "Strict competitive exam mode" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNegativePenalty(opt.value as any)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        negativePenalty === opt.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className={`font-bold text-sm ${opt.value > 0 ? "text-destructive" : "text-foreground"}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {negativePenalty > 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Each wrong answer will deduct <strong>{negativePenalty}</strong> point(s) from your score.
                      Only attempt questions you are confident about.
                    </span>
                  </div>
                )}
              </div>
            )}

            {step === 7 && (
              <div className="space-y-3 text-sm">
                <SummaryRow label="Course" value={course?.name ?? "—"} />
                <SummaryRow
                  label="Chapters"
                  value={
                    course
                      ? course.subtopics.filter((s: any) => subtopicIds.includes(s.id)).map((s: any) => s.name).join(", ")
                      : "—"
                  }
                />
                <SummaryRow label="Questions" value={String(count)} />
                <SummaryRow label="Time limit" value={timeMin ? `${timeMin} min` : "No timer"} />
                <SummaryRow label="Question type" value={mix === "both" ? "MCQ + MSQ" : mix.toUpperCase()} />
                <SummaryRow label="Difficulty" value={difficulty[0].toUpperCase() + difficulty.slice(1)} />
                <SummaryRow
                  label="Negative Marking"
                  value={negativePenalty === 0 ? "Disabled" : `−${negativePenalty} per wrong answer`}
                />
                {simulate && (
                  <p className="rounded-md bg-warning/10 p-3 text-xs">
                    Simulate mode: strict timer, no pausing, one submit.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 0) {
                  nav({ to: "/dashboard" });
                } else {
                  setStep(step - 1);
                }
              }}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => start.mutate()} disabled={start.isPending} className="gap-2">
                <Play className="h-4 w-4" /> {start.isPending ? "Starting…" : simulate ? "Begin exam" : "Start quiz"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}