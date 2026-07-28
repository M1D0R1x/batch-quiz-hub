import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Flag, Menu, Pause } from "lucide-react";
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
import { getActiveAttempt, submitAttempt } from "@/lib/quiz.functions";

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

  const q = useQuery({
    queryKey: ["attempt-run", attemptId],
    queryFn: () => loadFn({ data: { attemptId } }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
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
    // restore prior partial (should be empty when starting a fresh attempt)
    const prior = (q.data.attempt as any).answers?.picked;
    if (prior) setAnswers(prior);
  }, [q.data]);

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

  return (
    <div className="min-h-screen">
      {!isSimulate && <AppHeader />}
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
            <div className={`rounded-lg border px-3 py-2 font-mono text-sm ${timerCritical ? "border-destructive/50 text-destructive animate-pulse" : "border-border"}`}>
              {timerText}
            </div>
          )}
          {!isSimulate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.setItem(`quiz_draft_${attemptId}`, JSON.stringify({ answers, idx }));
                toast.success("Quiz paused! Resume it anytime from your dashboard.");
                nav({ to: "/dashboard" });
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
                <SheetTitle>Questions</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {questions.map((qq: any, i: number) => {
                  const isFlagged = flagged.has(qq.id);
                  const isAnswered = answered.has(qq.id);
                  const isActive = i === idx;
                  return (
                    <button
                      key={qq.id}
                      onClick={() => setIdx(i)}
                      className={`relative h-10 rounded-md border text-sm font-medium transition ${
                        isActive ? "border-primary bg-primary/10" :
                        isAnswered ? "border-success/60 bg-success/10" :
                        "border-border bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                      {isFlagged && (
                        <Flag className="absolute -right-1 -top-1 h-3 w-3 fill-warning text-warning" />
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
            <div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-secondary-foreground">
                {current.type === "mcq" ? "Single answer" : "Multiple answers"}
              </span>
              {current.type === "msq" && (
                <span className="ml-2 text-xs text-muted-foreground">Select all that apply</span>
              )}
            </div>
            <Button
              variant={flagged.has(current.id) ? "default" : "outline"}
              size="sm"
              className="gap-1"
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
            {current.type === "mcq" ? (
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
              current.options.map((opt: string, i: number) => {
                const picked = answers[current.id] ?? [];
                const checked = picked.includes(i);
                return (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        setAnswer(
                          current.id,
                          checked ? picked.filter((x) => x !== i) : [...picked, i].sort((a, b) => a - b),
                        )
                      }
                      className="mt-0.5"
                    />
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
            Previous
          </Button>
          {idx < questions.length - 1 ? (
            <Button onClick={() => setIdx(idx + 1)}>Next</Button>
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
      </main>
    </div>
  );
}

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}