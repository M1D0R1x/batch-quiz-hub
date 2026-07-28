import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Play } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourseDetail } from "@/lib/quiz.functions";

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Course — QuizForge" },
      { name: "description", content: "Browse chapters and start a quiz." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { courseId } = useParams({ from: "/_authenticated/courses/$courseId" });
  const fn = useServerFn(getCourseDetail);
  const q = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fn({ data: { courseId } }),
  });

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {q.isLoading && <Skeleton className="h-24 w-full" />}
        {q.data && (
          <>
            <div className="animate-fade-up">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Course</div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">{q.data.course.name}</h1>
              <p className="mt-2 text-muted-foreground">{q.data.course.description}</p>
              <div className="mt-4">
                <Button asChild className="gap-2">
                  <Link to="/quiz/setup" search={{ courseId }}>
                    <Play className="h-4 w-4" /> Quiz this course
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-3">
              {q.data.subtopics.map((s: any) => (
                <div key={s.id} className="card-elevated flex items-center justify-between p-5">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.question_count} questions available</div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/quiz/setup" search={{ courseId, subtopicId: s.id }}>
                      Practice
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}