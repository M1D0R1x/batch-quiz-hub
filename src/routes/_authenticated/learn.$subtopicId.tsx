import { useState, useMemo, useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getLearnSubtopicQuestions } from '@/lib/learn.functions';
import { getCleanExplanation } from '@/lib/explanation.utils';
import { AppHeader } from '@/components/app-header';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ChevronRight as BreadcrumbChevron,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Menu,
  CheckSquare,
  Circle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const Route = createFileRoute('/_authenticated/learn/$subtopicId')({
  head: () => ({
    meta: [
      { title: 'Interactive Flashcards — QuizForge' },
      { name: 'description', content: 'Practice randomized flashcards with instant feedback and explanations.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LearnFlashcardPage,
});

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function LearnFlashcardPage() {
  const { subtopicId } = Route.useParams();
  const navigate = useNavigate();
  const getSubtopicQuestionsFn = useServerFn(getLearnSubtopicQuestions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [cardStats, setCardStats] = useState<Record<string, 'correct' | 'incorrect' | 'attempted'>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['learnSubtopicQuestions', subtopicId],
    queryFn: () => getSubtopicQuestionsFn({ data: { subtopicId } }),
  });

  const questions = useMemo(() => {
    if (!data?.questions) return [];
    return shuffleArray(data.questions);
  }, [data?.questions, shuffleSeed]);

  const currentQ = questions[currentIndex];

  const parsedOptions: string[] = useMemo(() => {
    if (!currentQ) return [];
    return Array.isArray(currentQ.options) ? currentQ.options : JSON.parse(currentQ.options || '[]');
  }, [currentQ]);

  const parsedCorrect: number[] = useMemo(() => {
    if (!currentQ) return [];
    return Array.isArray(currentQ.correct_answers) ? currentQ.correct_answers : JSON.parse(currentQ.correct_answers || '[]');
  }, [currentQ]);

  const isMSQ =
    currentQ?.type === 'msq' ||
    currentQ?.question_type === 'msq' ||
    (currentQ?.correct_option_count ?? 1) > 1 ||
    parsedCorrect.length > 1;

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrev();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, isSubmitted, selectedIndices]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Preparing interactive flashcards...</p>
        </div>
      </div>
    );
  }

  const { subtopic } = data;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-xl py-12 px-4 text-center space-y-4">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold text-foreground">No Flashcards Available</h2>
          <p className="text-sm text-muted-foreground">There are no questions in this chapter yet.</p>
          <Button onClick={() => navigate({ to: '/learn' })} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Study Overview
          </Button>
        </main>
      </div>
    );
  }

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
    const isCorrect =
      selectedIndices.length === parsedCorrect.length &&
      selectedIndices.every((idx) => parsedCorrect.includes(idx));
    setCardStats((prev) => ({
      ...prev,
      [currentQ.id]: isCorrect ? 'correct' : 'incorrect',
    }));
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
    setCardStats({});
    setShuffleSeed((s) => s + 1);
  };

  const isUserCorrect =
    isSubmitted &&
    selectedIndices.length === parsedCorrect.length &&
    selectedIndices.every((idx) => parsedCorrect.includes(idx));

  const correctOptionLabels = parsedCorrect
    .map((idx) => `Option ${String.fromCharCode(65 + idx)}`)
    .join(', ');

  const getGridCellClass = (qItem: any, i: number) => {
    const isActive = i === currentIndex;
    const stat = cardStats[qItem.id];
    let base = 'border-border bg-secondary/40 text-muted-foreground';
    if (stat === 'correct') {
      base = 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold';
    } else if (stat === 'incorrect') {
      base = 'border-rose-500 bg-rose-500/20 text-rose-400 font-bold';
    }
    if (isActive) {
      return `${base} ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 z-10`;
    }
    return base;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
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
          <span className="text-foreground font-semibold truncate">{subtopic.name}</span>
        </nav>

        {/* Header Control Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3 sm:border-0 sm:pb-0">
          <div className="flex-1 min-w-0 space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight break-words">{subtopic.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>Card {currentIndex + 1} of {questions.length}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Use Arrow keys to navigate</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-end">
            <Button onClick={handleRestart} variant="outline" size="sm" className="gap-1.5 text-xs h-9 px-3">
              <RotateCcw className="w-3.5 h-3.5" /> Restart Deck
            </Button>

            {/* Flashcard Navigator Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Flashcard navigator">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Flashcard Navigator</SheetTitle>
                </SheetHeader>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500" />
                    Correct
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded bg-rose-500/20 border border-rose-500" />
                    Incorrect
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded bg-secondary/40 border border-border" />
                    Unattempted
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-6 gap-2">
                  {questions.map((qItem: any, i: number) => (
                    <button
                      key={qItem.id}
                      onClick={() => {
                        setIsSubmitted(false);
                        setSelectedIndices([]);
                        setCurrentIndex(i);
                      }}
                      className={`h-10 rounded-md border text-sm font-medium transition-all hover:scale-105 ${getGridCellClass(qItem, i)}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5" />

        {/* Flashcard Card */}
        <Card className="card-elevated p-6 animate-fade-up min-h-[420px] flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {isMSQ ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-bold text-amber-500">
                    <CheckSquare className="w-3 h-3" /> Multiple choice
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[11px] uppercase tracking-wide font-bold text-sky-400">
                    <Circle className="w-3 h-3" /> Single choice
                  </span>
                )}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize font-medium">
                  {currentQ.difficulty}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {isMSQ ? 'Select all that apply' : 'Select one option'}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Flashcard {currentIndex + 1}
              </span>
              <h2 className="text-lg md:text-xl font-semibold leading-relaxed text-foreground">
                {currentQ.question_text}
              </h2>
            </div>

            {/* Interactive Options */}
            <div className="space-y-2.5">
              {parsedOptions.map((option, idx) => {
                const isSelected = selectedIndices.includes(idx);
                const isCorrectOption = parsedCorrect.includes(idx);

                let optionStyle = 'border-border bg-card hover:bg-muted/40 text-foreground';

                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'border-emerald-500 bg-emerald-500/15 text-foreground font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'border-rose-500 bg-rose-500/15 text-foreground ring-1 ring-rose-500';
                  } else {
                    optionStyle = 'border-border opacity-50 bg-card text-muted-foreground';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-primary bg-primary/10 text-foreground ring-1 ring-primary';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSubmitted && isCorrectOption
                          ? 'bg-emerald-500 text-white'
                          : isSubmitted && isSelected && !isCorrectOption
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
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
                      <CheckCircle2 className="w-5 h-5" /> Correct! Excellent work!
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed mt-1">
                      Option {correctOptionLabels} is correct.
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
                    <Sparkles className="w-4 h-4" /> Explanation & Key Takeaway
                  </span>
                  <p className="leading-relaxed text-muted-foreground mt-1">
                    {getCleanExplanation(currentQ.explanation, parsedOptions, parsedCorrect)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Check / Next */}
          <div className="pt-4 flex justify-center border-t border-border/40">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedIndices.length === 0}
                className="gap-2 px-8 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="gap-2 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
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
            Card {currentIndex + 1} of {questions.length}
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
