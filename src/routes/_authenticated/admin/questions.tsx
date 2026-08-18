import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { adminListCourses, adminListQuestions, adminCreateQuestion, adminDeleteQuestion } from '@/lib/admin.functions';
import { Plus, Search, Trash2, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/admin/questions')({
  component: AdminQuestionsPage,
});

function AdminQuestionsPage() {
  const queryClient = useQueryClient();
  const listCoursesFn = useServerFn(adminListCourses);
  const listQuestionsFn = useServerFn(adminListQuestions);
  const createQuestionFn = useServerFn(adminCreateQuestion);
  const deleteQuestionFn = useServerFn(adminDeleteQuestion);

  const [search, setSearch] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [subtopicId, setSubtopicId] = useState('');
  const [questionType, setQuestionType] = useState<'mcq' | 'msq'>('mcq');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([0]);
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const { data: courses = [] } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => listCoursesFn(),
  });

  const allSubtopics = courses.flatMap((c) => c.subtopics || []);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['adminQuestions', selectedSubtopic, search],
    queryFn: () =>
      listQuestionsFn({
        data: {
          subtopicId: selectedSubtopic !== 'all' ? selectedSubtopic : undefined,
          search: search.trim() || undefined,
        },
      }),
  });

  const createQuestionMutation = useMutation({
    mutationFn: (data: any) => createQuestionFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminQuestions'] });
      toast.success('Question added successfully');
      setShowAddForm(false);
      setQuestionText('');
      setExplanation('');
      setOptions(['', '', '', '']);
      setCorrectAnswers([0]);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (data: { questionId: string }) => deleteQuestionFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminQuestions'] });
      toast.success('Question deleted');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const toggleCorrectAnswer = (index: number) => {
    if (questionType === 'mcq') {
      setCorrectAnswers([index]);
    } else {
      if (correctAnswers.includes(index)) {
        if (correctAnswers.length > 1) {
          setCorrectAnswers(correctAnswers.filter((i) => i !== index));
        }
      } else {
        setCorrectAnswers([...correctAnswers, index]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtopicId) return toast.error('Please select a subtopic');
    if (!questionText.trim()) return toast.error('Please provide question text');
    if (options.some((o) => !o.trim())) return toast.error('All options must be filled out');

    createQuestionMutation.mutate({
      subtopicId,
      type: questionType,
      questionText,
      options,
      correctAnswers,
      explanation,
      difficulty,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Question Bank</h2>
          <p className="text-sm text-muted-foreground">Manage exam items, answer keys, and explanations</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add New Question
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-primary/40 bg-card/90">
          <CardHeader>
            <CardTitle className="text-base">Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Subtopic</label>
                  <Select value={subtopicId} onValueChange={setSubtopicId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubtopics.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Type</label>
                  <Select value={questionType} onValueChange={(v: any) => setQuestionType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Single Choice (MCQ)</SelectItem>
                      <SelectItem value="msq">Multiple Select (MSQ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Difficulty</label>
                  <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold">Question Text</label>
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter clear, concise question prompt..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold flex items-center justify-between">
                  <span>Answer Options (Click checkmark for correct answers)</span>
                  <Button type="button" variant="ghost" size="sm" onClick={handleAddOption} className="h-6 text-[11px]">
                    + Add Option
                  </Button>
                </label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCorrectAnswer(idx)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border text-xs font-bold shrink-0 transition-colors ${
                        correctAnswers.includes(idx)
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'border-border bg-muted/40 text-muted-foreground hover:border-emerald-400'
                      }`}
                    >
                      {correctAnswers.includes(idx) ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                    </button>
                    <Input
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}...`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold">Explanation</label>
                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Detailed rationale for the correct answer..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createQuestionMutation.isPending}>
                  {createQuestionMutation.isPending ? 'Saving...' : 'Save Question'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedSubtopic} onValueChange={setSelectedSubtopic}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="All Subtopics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subtopics</SelectItem>
            {allSubtopics.map((sub) => (
              <SelectItem key={sub.id} value={sub.id}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading question bank...</div>
      ) : questions.length === 0 ? (
        <div className="py-12 text-center border border-dashed rounded-xl space-y-2">
          <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-medium text-foreground">No questions found</p>
          <p className="text-xs text-muted-foreground">Try adjusting search filters or add a new question.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q: any, idx) => {
            const parsedOptions: string[] = Array.isArray(q.options) ? (q.options as string[]) : (typeof q.options === 'string' ? JSON.parse(q.options) : []);
            const parsedCorrect: number[] = Array.isArray(q.correct_answers) ? (q.correct_answers as number[]) : (typeof q.correct_answers === 'string' ? JSON.parse(q.correct_answers) : []);

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-border bg-card/60 hover:bg-card transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono uppercase">
                        {q.type}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {idx + 1}. {q.question_text}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteQuestionMutation.mutate({ questionId: q.id })}
                    disabled={deleteQuestionMutation.isPending}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-xs">
                  {parsedOptions.map((opt, oIdx) => {
                    const isCorrect = parsedCorrect.includes(oIdx);
                    return (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20'
                            : 'bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        <span className="w-4 text-center font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                        {isCorrect && <Check className="w-3.5 h-3.5 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg italic">
                    💡 <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
