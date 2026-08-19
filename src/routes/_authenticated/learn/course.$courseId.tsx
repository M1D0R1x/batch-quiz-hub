import { useState, useMemo } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getLearnCourseQuestions } from '@/lib/learn.functions';
import { AppHeader } from '@/components/app-header';
import { ArrowLeft, ChevronLeft, ChevronRight, GraduationCap, ChevronRight as BreadcrumbChevron, RotateCcw, CheckCircle2, XCircle, Sparkles, BookOpen, CheckSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const Route = createFileRoute('/_authenticated/learn/course/$courseId')({
  head: () => ({
    meta: [
      { title: 'Full Course Flashcards — QuizForge' },
      { name: 'description', content: 'Practice all questions for a complete course.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LearnCoursePage,
});

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function LearnCoursePage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();

  const getCourseQuestionsFn = useServerFn(getLearnCourseQuestions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['learnCourseQuestions', courseId],
    queryFn: () => getCourseQuestionsFn({ data: { courseId } }),
  });

  const questions = useMemo(() => {
    if (!data?.questions) return [];
    return shuffleArray(data.questions);
  }, [data?.questions, shuffleSeed]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading full course flashcard deck...</p>
        </div>
      </div>
    );
  }

  const { course } = data;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-xl py-12 px-4 text-center space-y-4">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold text-foreground">No Questions Available</h2>
          <p className="text-sm text-muted-foreground">There are no questions in this course yet.</p>
          <Button onClick={() => navigate({ to: '/learn' })} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Study Overview
          </Button>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const parsedOptions: string[] = Array.isArray(currentQ.options)
    ? (currentQ.options as string[])
    : (typeof currentQ.options === 'string' ? JSON.parse(currentQ.options) : []);
  const parsedCorrect: number[] = Array.isArray(currentQ.correct_answers)
    ? (currentQ.correct_answers as number[])
    : (typeof currentQ.correct_answers === 'string' ? JSON.parse(currentQ.correct_answers) : []);

  const isMSQ =
    currentQ.type === 'msq' ||
    (currentQ as any).question_type === 'msq' ||
    ((currentQ as any).correct_option_count ?? 1) > 1 ||
    parsedCorrect.length > 1;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    if (isMSQ) {
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setSelectedIndices([index]);
    }
  };

  const handleSubmit = () => {
    if (selectedIndices.length === 0) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedIndices([]);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsSubmitted(false);
    setSelectedIndices([]);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setIsSubmitted(false);
    setSelectedIndices([]);
    setCurrentIndex(0);
    setShuffleSeed((s) => s + 1);
  };

  const isUserCorrect =
    isSubmitted &&
    selectedIndices.length === parsedCorrect.length &&
    selectedIndices.every((idx) => parsedCorrect.includes(idx));

  const correctOptionLabels = parsedCorrect
    ? parsedCorrect.map((idx) => `Option ${String.fromCharCode(65 + idx)}`).join(', ')
    : '';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <BreadcrumbChevron className="w-3.5 h-3.5" />
          <Link to="/learn" className="hover:text-foreground transition-colors">
            Study Mode
          </Link>
          <BreadcrumbChevron className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold truncate">{course.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <Button onClick={() => navigate({ to: '/learn' })} variant="ghost" size="sm" className="gap-1.5 text-xs px-2 sm:px-3">
              <ArrowLeft className="w-4 h-4" /> Exit Course
            </Button>
            <div className="sm:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              <BookOpen className="w-3 h-3" /> Full Course Mode
            </div>
          </div>

          <div className="text-left sm:text-center flex-1 min-w-0 px-1">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-1">
              <BookOpen className="w-3 h-3" /> Full Course Mode
            </div>
            <h1 className="text-base sm:text-lg font-bold text-foreground leading-snug break-words">{course.name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Card {currentIndex + 1} of {questions.length} • All Chapters Shuffled
            </p>
          </div>

          <Button onClick={handleRestart} variant="outline" size="sm" className="gap-1.5 text-xs shrink-0 self-end sm:self-center h-9 px-3">
            <RotateCcw className="w-3.5 h-3.5" /> Shuffle & Restart
          </Button>
        </div>

        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5" />

        {/* Flashcard Card */}
        <Card className="relative overflow-hidden border-border/80 shadow-lg min-h-[420px] flex flex-col justify-between p-6 bg-gradient-to-b from-card via-card to-muted/20 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase">
                  {currentQ.type}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                  {currentQ.difficulty}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {isMSQ ? 'Select all that apply' : 'Select one answer'}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question</span>
              <h2 className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
                {currentQ.question_text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {/* MSQ multi-select hint */}
              {isMSQ && !isSubmitted && (
                <p className="text-xs text-amber-500 font-medium flex items-center gap-1.5 pb-1">
                  <CheckSquare className="w-3.5 h-3.5" />
                  Select all correct answers ({parsedCorrect.length} correct)
                </p>
              )}
              {parsedOptions.map((option, idx) => {
                const isSelected = selectedIndices.includes(idx);
                const isCorrectOption = parsedCorrect.includes(idx);

                let optionStyle = 'border-border bg-card hover:bg-muted/40 text-foreground';

                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'border-rose-500 bg-rose-500/10 text-foreground ring-1 ring-rose-500';
                  } else {
                    optionStyle = 'border-border opacity-50 bg-card text-muted-foreground';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-primary bg-primary/10 text-foreground ring-1 ring-primary';
                }

                // Indicator: square (rounded-md) for MSQ, rounded-full for MCQ
                const indicatorBase = isMSQ ? 'rounded-md' : 'rounded-full';
                const indicatorStyle = isSubmitted && isCorrectOption
                  ? `${indicatorBase} bg-emerald-500 text-white`
                  : isSubmitted && isSelected && !isCorrectOption
                  ? `${indicatorBase} bg-rose-500 text-white`
                  : isSelected
                  ? `${indicatorBase} bg-primary text-primary-foreground`
                  : `${indicatorBase} bg-muted text-muted-foreground border border-border`;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${indicatorStyle}`}>
                      {isSubmitted && isCorrectOption ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isSubmitted && isSelected && !isCorrectOption ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : isMSQ ? (
                        isSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <HelpCircle className="w-3 h-3 opacity-50" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Rationale Banner */}
            {isSubmitted && (
              <div className="space-y-4 pt-4 border-t border-border/60 animate-fade-up">
                {isUserCorrect ? (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" /> Correct Answer! Great job!
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed mt-1">
                      You selected the right option ({correctOptionLabels}).
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <XCircle className="w-5 h-5" /> Incorrect
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed mt-1">
                      The correct answer is <strong>{correctOptionLabels}</strong>.
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
                  <span className="font-bold text-primary flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4" /> Explanation & Rationale
                  </span>
                  <p className="leading-relaxed text-muted-foreground mt-1">
                    {currentQ.explanation || 'No detailed explanation provided for this question.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Check / Next */}
          <div className="pt-6 flex justify-center border-t border-border/40">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedIndices.length === 0}
                className="gap-2 px-8"
              >
                <CheckCircle2 className="w-4 h-4" /> Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="gap-2 px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next Flashcard <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <span className="text-xs font-medium text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>

          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            variant="outline"
            className="gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
