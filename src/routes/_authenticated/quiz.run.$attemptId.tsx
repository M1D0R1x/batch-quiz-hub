import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Flag, Menu, Pause, CheckSquare, Circle } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getActiveAttempt, submitAttempt, saveQuizProgress } from "@/lib/quiz.functions";

export const Route = createFileRoute("/_authenticated/quiz/run/$attemptId")({
  head: () => ({
    meta: [
      { title: "Quiz in progress — QuizForge" },
      { name: "description", content: "Answer your quiz questions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuizRun,
});

function QuizRun() {
  const { attemptId } = useParams({ from: "/_authenticated/quiz/run/$attemptId" });
  const nav = useNavigate();
  const loadFn = useServerFn(getActiveAttempt);
  const submitFn = useServerFn(submitAttempt);
  const saveFn = useServerFn(saveQuizProgress);

  const q = useQuery({
    queryKey: ["attempt-run", attemptId],
    queryFn: () => loadFn({ data: { attemptId } }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!q.data) return;
    const { started_at, time_limit_seconds, completed_at } = q.data.attempt;
    if (completed_at) {
      nav({ to: "/quiz/results/$attemptId", params: { attemptId } });
      return;
    }
    if (time_limit_seconds) {
      const end = new Date(started_at).getTime() + time_limit_seconds * 1000;
      const tick = () => {
        const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
        setSecondsLeft(s);
        if (s === 0 && !submittedRef.current) {
          submittedRef.current = true;
          submit.mutate();
        }
      };
      tick();
      const iv = setInterval(tick, 1000);
      return () => clearInterval(iv);
    }
    // Restore draft state from server (saved by pause or auto-save)
    const savedAnswers = (q.data.attempt as any).answers;
    if (savedAnswers?.draft_answers) {
      setAnswers(savedAnswers.draft_answers);
      if (savedAnswers.draft_flagged) {
        setFlagged(new Set(savedAnswers.draft_flagged));
      }
      if (typeof savedAnswers.draft_index === 'number') {
        setIdx(savedAnswers.draft_index);
      }
    } else if (savedAnswers?.picked) {
      // Legacy fallback
      setAnswers(savedAnswers.picked);
    }
  }, [q.data]);

  // Track visited questions whenever idx changes
  useEffect(() => {
    const questions = q.data?.questions ?? [];
    const current = questions[idx];
    if (current) {
      setVisited((prev) => new Set(prev).add(current.id));
    }
  }, [idx, q.data?.questions]);

  // Auto-save progress every 30 seconds
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!q.data || q.data.attempt.completed_at) return;
    // Clear any existing interval
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    
    autoSaveRef.current = setInterval(() => {
      saveFn({
        data: {
          attemptId,
          answers,
          flagged: Array.from(flagged),
          currentIndex: idx,
        },
      }).catch(() => {}); // Silent auto-save, don't toast on failure
    }, 30_000);
    
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [q.data, answers, flagged, idx]);

  const submit = useMutation({
    mutationFn: () =>
      submitFn({ data: { attemptId, answers, flagged: Array.from(flagged) } }),
    onSuccess: () => nav({ to: "/quiz/results/$attemptId", params: { attemptId } }),
    onError: (e: any) => {
      submittedRef.current = false;
      toast.error(e.message ?? "Submit failed");
    },
  });

  const questions = q.data?.questions ?? [];
  const current = questions[idx];
  const isSimulate = q.data?.attempt.is_simulate;
  const answered = useMemo(() => new Set(Object.keys(answers).filter((k) => (answers[k] ?? []).length > 0)), [answers]);
  const unanswered = questions.filter((q: any) => !answered.has(q.id)).length;

  function setAnswer(qid: string, val: number[]) {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }

  function navigateTo(i: number) {
    setIdx(i);
  }

  // Keyboard Shortcuts (1-4 select options, F to flag, Arrow keys to navigate)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!current) return;

      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const optIdx = Number(e.key) - 1;
        if (optIdx < current.options.length) {
          const isMsq = current.type === 'msq';
          const picked = answers[current.id] ?? [];
          if (!isMsq) {
            setAnswer(current.id, [optIdx]);
          } else {
            const next = picked.includes(optIdx)
              ? picked.filter((x: number) => x !== optIdx)
              : [...picked, optIdx].sort((a: number, b: number) => a - b);
            setAnswer(current.id, next);
          }
        }
      } else if (e.key === 'f' || e.key === 'F') {
        setFlagged((prev) => {
          const next = new Set(prev);
          next.has(current.id) ? next.delete(current.id) : next.add(current.id);
          return next;
        });
      } else if (e.key === 'ArrowRight' && idx < questions.length - 1) {
        setIdx((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        setIdx((i) => i - 1);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idx, questions.length, current, answers]);

  if (q.isLoading || !current) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-10 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  const timerText = secondsLeft != null ? formatSeconds(secondsLeft) : null;
  const timerCritical = secondsLeft != null && secondsLeft < 60;

  // Grid cell color logic
  function getGridCellClass(qq: any, i: number) {
    const isActive = i === idx;
    const isFlagged = flagged.has(qq.id);
    const isAnswered = answered.has(qq.id);
    const isVisited = visited.has(qq.id);

    let base = "";
    if (isFlagged) {
      base = "border-violet-500 bg-violet-500/25 text-violet-300 font-bold";
    } else if (isAnswered) {
      base = "border-emerald-500 bg-emerald-500/25 text-emerald-300 font-bold";
    } else if (isVisited) {
      base = "border-amber-500 bg-amber-500/20 text-amber-300 font-bold";
    } else {
      base = "border-border bg-secondary/40 text-muted-foreground";
    }

    if (isActive) {
      return `${base} ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 z-10`;
    }
    return base;
  }

  const isMsq = current.type === "msq";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {idx + 1} of {questions.length}</span>
              <span>{answered.size} answered · {flagged.size} flagged</span>
            </div>
            <Progress value={((idx + 1) / questions.length) * 100} className="h-1.5" />
          </div>
          {timerText && (
            <div className={`rounded-lg border px-3 py-2 font-mono text-sm tabular-nums ${
              timerCritical ? "border-destructive/50 text-destructive animate-pulse bg-destructive/5" : "border-border text-foreground"
            }`}>
              {timerText}
            </div>
          )}
          {!isSimulate && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await saveFn({
                    data: {
                      attemptId,
                      answers,
                      flagged: Array.from(flagged),
                      currentIndex: idx,
                    },
                  });
                  toast.success('Quiz paused! Resume anytime from your dashboard.');
                } catch {
                  toast.error('Failed to save progress');
                }
                nav({ to: '/dashboard' });
              }}
              className="gap-1.5 text-xs h-9"
            >
              <Pause className="h-3.5 w-3.5" /> Pause Quiz
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Question grid">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Question Navigator</SheetTitle>
              </SheetHeader>
              {/* Legend */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/60" />
                  Answered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-violet-500/20 border border-violet-500/60" />
                  Flagged
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-yellow-500/10 border border-yellow-500/50" />
                  Visited
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded bg-secondary/40 border border-border" />
                  Not visited
                </span>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {questions.map((qq: any, i: number) => {
                  const isFlagged = flagged.has(qq.id);
                  return (
                    <button
                      key={qq.id}
                      onClick={() => navigateTo(i)}
                      className={`relative h-10 rounded-md border text-sm font-medium transition-all hover:scale-105 ${getGridCellClass(qq, i)}`}
                    >
                      {i + 1}
                      {isFlagged && (
                        <Flag className="absolute -right-1 -top-1 h-3 w-3 fill-violet-400 text-violet-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="card-elevated p-6 animate-fade-up">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {isMsq ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-bold text-amber-500">
                  <CheckSquare className="w-3 h-3" />
                  Multiple answers
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-bold text-sky-400">
                  <Circle className="w-3 h-3" />
                  Single answer
                </span>
              )}
              {isMsq && (
                <span className="text-xs text-amber-500/80">Select all that apply</span>
              )}
            </div>
            <Button
              variant={flagged.has(current.id) ? "default" : "outline"}
              size="sm"
              className={`gap-1 shrink-0 ${
                flagged.has(current.id)
                  ? "bg-violet-600 hover:bg-violet-700 border-violet-600 text-white"
                  : ""
              }`}
              onClick={() => {
                setFlagged((prev) => {
                  const next = new Set(prev);
                  next.has(current.id) ? next.delete(current.id) : next.add(current.id);
                  return next;
                });
              }}
            >
              <Flag className="h-3.5 w-3.5" /> {flagged.has(current.id) ? "Flagged" : "Flag"}
            </Button>
          </div>

          <h2 className="text-lg font-semibold leading-relaxed">{current.question_text}</h2>

          <div className="mt-6 space-y-2">
            {!isMsq ? (
              <RadioGroup
                value={(answers[current.id]?.[0] ?? -1).toString()}
                onValueChange={(v) => setAnswer(current.id, [Number(v)])}
                className="space-y-2"
              >
                {current.options.map((opt: string, i: number) => (
                  <Label
                    key={i}
                    htmlFor={`${current.id}-${i}`}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem id={`${current.id}-${i}`} value={i.toString()} className="mt-0.5" />
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </Label>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {current.options.map((opt: string, i: number) => {
                  const picked = answers[current.id] ?? [];
                  const checked = picked.includes(i);
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                        checked
                          ? "border-amber-500/60 bg-amber-500/8"
                          : "border-border hover:border-amber-500/40"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          setAnswer(
                            current.id,
                            checked ? picked.filter((x) => x !== i) : [...picked, i].sort((a, b) => a - b),
                          )
                        }
                        className="mt-0.5 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                      <span className="text-sm leading-relaxed">{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button variant="outline" disabled={idx === 0} onClick={() => navigateTo(idx - 1)}>
            Previous
          </Button>
          {idx < questions.length - 1 ? (
            <Button onClick={() => navigateTo(idx + 1)}>Next</Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gap-2">Submit quiz</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit your answers?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {unanswered > 0 ? (
                      <span className="flex items-start gap-2 text-warning-foreground">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                        You have {unanswered} unanswered {unanswered === 1 ? "question" : "questions"}.
                        {isSimulate ? " Simulate mode won't let you resume." : ""}
                      </span>
                    ) : (
                      "Once submitted, you can review the correct answers and explanations."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep answering</AlertDialogCancel>
                  <AlertDialogAction onClick={() => submit.mutate()}>Submit</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/70 font-medium">
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-mono">1-4</kbd> select answer</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-mono">F</kbd> toggle flag</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-mono">← →</kbd> navigate</span>
        </div>
      </main>
    </div>
  );
}

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}