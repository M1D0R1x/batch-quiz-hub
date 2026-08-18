import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Play, Timer, AlertTriangle, Pause, Trash2, Loader2, Sparkles, Zap, Info, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listCourses, startAttempt, getInProgressAttempts, discardAttempt, startSmartExamEngineAttempt } from "@/lib/quiz.functions";
import { getMyRole } from "@/lib/admin.functions";

export const searchSchema = z.object({
  courseId: z.string().optional().catch(undefined),
  subtopicId: z.string().optional().catch(undefined),
  simulate: z.preprocess((val) => {
    if (typeof val === "string") return val === "true";
    return Boolean(val);
  }, z.boolean().optional()).catch(false),
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
  const search = (useSearch({ strict: false }) || {}) as Partial<z.infer<typeof searchSchema>>;
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const listFn = useServerFn(listCourses);
  const startFn = useServerFn(startAttempt);
  const inProgressFn = useServerFn(getInProgressAttempts);
  const discardFn = useServerFn(discardAttempt);
  const smartEngineFn = useServerFn(startSmartExamEngineAttempt);
  const roleFn = useServerFn(getMyRole);

  const { data: roleInfo } = useQuery({
    queryKey: ["myRole"],
    queryFn: () => roleFn(),
  });

  const smartEngineMutation = useMutation({
    mutationFn: () => smartEngineFn(),
    onSuccess: (res) => {
      toast.success("Smart Exam Engine initialized! Starting 50-question mock exam.");
      nav({ to: "/quiz/run/$attemptId", params: { attemptId: res.attemptId } });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to launch Smart Exam Engine"),
  });

  const courses = useQuery({ queryKey: ["courses"], queryFn: () => listFn() });
  const inProgress = useQuery({
    queryKey: ['in-progress-attempts'],
    queryFn: () => inProgressFn(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState<string | null>(search?.courseId ?? null);
  const [subtopicIds, setSubtopicIds] = useState<string[]>(search?.subtopicId ? [search.subtopicId] : []);
  const [count, setCount] = useState(20);
  const [timeMin, setTimeMin] = useState<number | null>(simulate ? 30 : 20);
  const [mix, setMix] = useState<"mcq" | "msq" | "both">("both");
  const [difficulty, setDifficulty] = useState<"any" | "easy" | "medium" | "hard">("any");
  const [negativePenalty, setNegativePenalty] = useState<0 | 0.25 | 0.33>(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBlueprintDialog, setShowBlueprintDialog] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const course = useMemo(() => courses.data?.find((c: any) => c.id === courseId), [courses.data, courseId]);

  const existingAttempt = useMemo(() => {
    if (!inProgress.data || !courseId) return null;
    return (
      inProgress.data.find((a: any) => a.courseId === courseId && a.isSimulate === simulate) ||
      inProgress.data.find((a: any) => a.courseId === courseId) ||
      null
    );
  }, [inProgress.data, courseId, simulate]);

  const discardMutation = useMutation({
    mutationFn: (attemptId: string) => discardFn({ data: { attemptId } }),
    onSuccess: () => {
      toast.success("Paused quiz discarded. You can now start fresh.");
      queryClient.invalidateQueries({ queryKey: ['in-progress-attempts'] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to discard quiz"),
  });

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
    onSuccess: (res) => {
      toast.success("Quiz created!");
      nav({ to: "/quiz/run/$attemptId", params: { attemptId: res.attempt.id } });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to start quiz"),
  });

  const handleStartClick = () => {
    if (existingAttempt) {
      setShowConfirmDialog(true);
    } else {
      start.mutate();
    }
  };

  const handleConfirmDiscardAndStart = async () => {
    if (!existingAttempt) return;
    setIsDiscarding(true);
    try {
      await discardFn({ data: { attemptId: existingAttempt.id } });
      setShowConfirmDialog(false);
      start.mutate();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to discard existing attempt");
    } finally {
      setIsDiscarding(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!courseId;
    if (step === 1) return subtopicIds.length > 0;
    if (step === 3 && simulate) return !!timeMin; // simulate requires a timer
    return true;
  };

  const steps = ["Course", "Chapters", "Count", "Time", "Mix", "Difficulty", "Neg. Marking", "Review"];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* 🔥 Smart Exam Engine Banner (Admin Only) */}
        {roleInfo?.isAdmin && (
          <>
            <div className="mb-8 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-5 sm:p-6 shadow-xl relative animate-fade-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      High-Likelihood Certification Simulator
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowBlueprintDialog(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/90 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border text-[11px] font-medium transition-all shadow-sm cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-primary" />
                      Estimated Questions Info
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    🔥 Smart Exam Engine (50 High-Likelihood Qs)
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Algorithmically samples 50 high-priority questions strictly focused across your 5 core chapters, weighted by scenario complexity, MSQ difficulty, and exam blueprint frequencies.
                  </p>

                  {/* Blueprint Domain Pills */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-foreground font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-400" /> APEX: 15 Qs
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-foreground font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> XML: 12 Qs
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-foreground font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Vector Search: 10 Qs
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-foreground font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-400" /> Data Science: 7 Qs
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-foreground font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" /> AI Agent Studio: 6 Qs
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pt-2 md:pt-0">
                  <Button
                    size="lg"
                    disabled={smartEngineMutation.isPending}
                    onClick={() => smartEngineMutation.mutate()}
                    className="w-full sm:w-auto h-12 px-6 gap-2 text-sm font-bold shadow-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:opacity-95 text-primary-foreground cursor-pointer"
                  >
                    {smartEngineMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Assembling 50 Qs...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-primary-foreground" />
                        Launch Smart Exam (50 Qs)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Blueprint Info Modal */}
            <AlertDialog open={showBlueprintDialog} onOpenChange={setShowBlueprintDialog}>
              <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-lg font-bold">
                    <Sparkles className="w-5 h-5 text-primary" />
                    MCQ2 Smart Exam Blueprint Breakdown
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground">
                    Exact estimated questions, domain weights, and algorithmic prioritization criteria for the 50-question mock exam.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-4 space-y-4 text-xs">
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                          <th className="p-2.5">Course / Domain</th>
                          <th className="p-2.5 text-center">Bank Pool</th>
                          <th className="p-2.5 text-center">Exam Allocation</th>
                          <th className="p-2.5 text-center">Exam Weight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-muted/30">
                          <td className="p-2.5 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            Oracle APEX Developer Professional
                          </td>
                          <td className="p-2.5 text-center text-muted-foreground">81 Qs (30.1%)</td>
                          <td className="p-2.5 text-center font-bold text-foreground">15 Qs</td>
                          <td className="p-2.5 text-center font-semibold text-primary">30%</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-2.5 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            XML (Schemas, XPath, XSLT)
                          </td>
                          <td className="p-2.5 text-center text-muted-foreground">75 Qs (27.9%)</td>
                          <td className="p-2.5 text-center font-bold text-foreground">12 Qs</td>
                          <td className="p-2.5 text-center font-semibold text-primary">24%</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-2.5 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Oracle AI Vector Search
                          </td>
                          <td className="p-2.5 text-center text-muted-foreground">50 Qs (18.6%)</td>
                          <td className="p-2.5 text-center font-bold text-foreground">10 Qs</td>
                          <td className="p-2.5 text-center font-semibold text-primary">20%</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-2.5 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            OCI Data Science Professional
                          </td>
                          <td className="p-2.5 text-center text-muted-foreground">33 Qs (12.3%)</td>
                          <td className="p-2.5 text-center font-bold text-foreground">7 Qs</td>
                          <td className="p-2.5 text-center font-semibold text-primary">14%</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-2.5 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            Oracle AI Agent Studio for Fusion
                          </td>
                          <td className="p-2.5 text-center text-muted-foreground">30 Qs (11.1%)</td>
                          <td className="p-2.5 text-center font-bold text-foreground">6 Qs</td>
                          <td className="p-2.5 text-center font-semibold text-primary">12%</td>
                        </tr>
                        <tr className="bg-primary/10 font-bold">
                          <td className="p-2.5">Total Exam Simulation</td>
                          <td className="p-2.5 text-center">269 Qs (100%)</td>
                          <td className="p-2.5 text-center text-primary font-bold">50 Questions</td>
                          <td className="p-2.5 text-center text-primary">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-lg bg-secondary/40 p-3 border border-border/60 space-y-1.5">
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Likelihood Prioritization Formula:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li><strong>Real-world scenarios</strong> (&quot;As an AI architect...&quot;, &quot;You are configuring...&quot;) receive <strong>+3.0 Priority</strong>.</li>
                      <li><strong>Multi-Answer MSQs</strong> (testing comprehensive technical recall) receive <strong>+2.0 Priority</strong>.</li>
                      <li><strong>High-yield exam topics</strong> (HNSW, XSLT, REST Data Sources, MLOps, Multi-agent tools) receive <strong>+2.0 Priority</strong>.</li>
                      <li><strong>Unseen questions</strong> receive <strong>+4.0 Freshness Boost</strong> so 100% of all 269 questions rotate over 3–5 attempts!</li>
                    </ul>
                  </div>
                </div>

                <AlertDialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
                  <AlertDialogCancel onClick={() => setShowBlueprintDialog(false)} className="cursor-pointer">
                    Close
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setShowBlueprintDialog(false);
                      smartEngineMutation.mutate();
                    }}
                    className="bg-primary text-primary-foreground font-semibold cursor-pointer"
                  >
                    <Zap className="w-4 h-4 mr-1.5 fill-primary-foreground" />
                    Launch Smart Exam Now (50 Qs)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {existingAttempt && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-card p-4 sm:p-5 shadow-sm animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Pause className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      Paused {existingAttempt.isSimulate ? "Simulation" : "Quiz"} In Progress
                    </span>
                    <span className="truncate max-w-[200px] rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-500 border border-amber-500/30">
                      {existingAttempt.courseName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {existingAttempt.answeredCount} of {existingAttempt.questionCount} questions answered
                    {existingAttempt.draftSavedAt && (
                      <span> · Saved {new Date(existingAttempt.draftSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  disabled={discardMutation.isPending || isDiscarding}
                  onClick={() => discardMutation.mutate(existingAttempt.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Discard
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1 font-semibold"
                  onClick={() => nav({ to: "/quiz/run/$attemptId", params: { attemptId: existingAttempt.id } })}
                >
                  Resume <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-y-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold shrink-0 ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                {i < steps.length - 1 && <span className="h-px w-4 bg-border shrink-0" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}: <span className="font-semibold text-foreground">{steps[step]}</span>
          </p>
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

            {step === 2 && (() => {
              const availableCount = course
                ? course.subtopics
                    .filter((s: any) => subtopicIds.includes(s.id))
                    .reduce((sum: number, s: any) => sum + (s.question_count ?? 0), 0)
                : 0;
              const presets = [10, 20, 30, 50].filter((n) => availableCount === 0 || n <= availableCount);
              return (
                <div className="space-y-4">
                  {availableCount > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">Available questions in selected chapters:</span>
                      <span className="font-bold text-primary">{availableCount}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((n) => (
                      <Button
                        key={n}
                        type="button"
                        variant={count === n ? "default" : "outline"}
                        onClick={() => setCount(n)}
                      >
                        {n} Qs
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Custom question count</span>
                    <Input
                      type="number"
                      min={1}
                      max={availableCount || 100}
                      value={count}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val > 0) {
                          setCount(availableCount > 0 ? Math.min(val, availableCount) : val);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })()}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30, 45, 60].map((m) => (
                    <Button
                      key={m}
                      type="button"
                      variant={timeMin === m ? "default" : "outline"}
                      onClick={() => setTimeMin(m)}
                      className="h-11 text-sm font-medium"
                    >
                      {m} min
                    </Button>
                  ))}
                  {!simulate ? (
                    <Button
                      type="button"
                      variant={timeMin === null ? "default" : "outline"}
                      onClick={() => setTimeMin(null)}
                      className="h-11 text-sm font-medium"
                    >
                      Untimed
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant={timeMin === 90 ? "default" : "outline"}
                      onClick={() => setTimeMin(90)}
                      className="h-11 text-sm font-medium"
                    >
                      90 min
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Custom time (minutes):</span>
                  <Input
                    type="number"
                    min={1}
                    max={240}
                    placeholder="e.g. 15"
                    value={timeMin ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setTimeMin(null);
                      } else {
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed) && parsed >= 0) {
                          setTimeMin(parsed);
                        }
                      }
                    }}
                    className="max-w-[140px] h-9 text-sm"
                  />
                </div>

                {simulate && (
                  <p className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-300 font-medium">
                    <Timer className="h-4 w-4 shrink-0" /> Simulate mode requires a timer — you can't remove it.
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-2 sm:grid-cols-3">
                {(["both", "mcq", "msq"] as const).map((v) => (
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
              <Button size="lg" onClick={handleStartClick} disabled={start.isPending} className="gap-2 font-bold">
                <Play className="h-4 w-4" /> {start.isPending ? "Starting…" : simulate ? "Begin exam" : "Start quiz"}
              </Button>
            )}
          </div>
        </div>

        {/* Confirmation Modal when a paused attempt exists */}
        {existingAttempt && (
          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent className="max-w-2xl sm:max-w-2xl border-amber-500/30 shadow-2xl">
              <AlertDialogHeader>
                <div className="mx-auto sm:mx-0 w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-2">
                  <Pause className="w-6 h-6" />
                </div>
                <AlertDialogTitle className="text-xl font-bold text-foreground">
                  Paused {existingAttempt.isSimulate ? "Test Simulation" : "Quiz"} Found!
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                    <p>
                      You have an active paused {existingAttempt.isSimulate ? "exam simulation" : "quiz"} for{" "}
                      <strong className="text-foreground">{existingAttempt.courseName}</strong>.
                    </p>

                    <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span className="font-bold text-foreground">
                          {existingAttempt.answeredCount} of {existingAttempt.questionCount} questions answered
                        </span>
                      </div>
                      {existingAttempt.draftSavedAt && (
                        <div className="flex justify-between">
                          <span>Last Saved:</span>
                          <span className="font-medium text-foreground">
                            {new Date(existingAttempt.draftSavedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-amber-500 font-semibold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Starting a new test will discard your current paused progress.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
                <AlertDialogCancel
                  className="sm:order-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </AlertDialogCancel>

                <Button
                  variant="outline"
                  className="sm:order-2 border-amber-500/30 text-amber-500 hover:bg-amber-500/15 gap-1.5"
                  onClick={handleConfirmDiscardAndStart}
                  disabled={start.isPending || isDiscarding}
                >
                  {isDiscarding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-amber-500" />
                  )}
                  Discard & Start New
                </Button>

                <AlertDialogAction
                  className="sm:order-3 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                  onClick={() => nav({ to: "/quiz/run/$attemptId", params: { attemptId: existingAttempt.id } })}
                >
                  Resume Paused Quiz <ArrowRight className="w-4 h-4" />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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