import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, BarChart3, Sparkles, Timer, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { TeamCredits } from "@/components/team-credits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuizForge — Practice smarter for your certification exam" },
      {
        name: "description",
        content:
          "Build custom timed quizzes from your course chapters, simulate the real exam, and track your weak topics.",
      },
      { property: "og:title", content: "QuizForge — Practice smarter for your certification exam" },
      {
        property: "og:description",
        content: "Build custom timed quizzes, simulate the real exam, and track your weak topics.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { userId: user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-primary/15 via-transparent to-transparent" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          QuizForge
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <section className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Built for training batches of 200+
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Practice smarter.
            <br />
            <span className="text-primary">Ship the exam.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Custom timed quizzes from your course chapters, a distraction-free exam simulator,
            and per-topic analytics so you know exactly what to review next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                Start practicing <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { icon: Layers, title: "Mix any chapters", body: "Pick one or many subtopics. Choose MCQ, MSQ, or both. Difficulty on demand." },
            { icon: Timer, title: "Real exam pressure", body: "Optional timer, question grid, flag & review — or simulate mode with strict rules." },
            { icon: BarChart3, title: "See your weak spots", body: "Per-topic breakdown after every attempt. Streaks and averages on your dashboard." },
          ].map((f) => (
            <div key={f.title} className="card-elevated p-6 animate-fade-up">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        <div className="mx-auto mt-20 max-w-5xl">
          <TeamCredits />
        </div>
      </main>
    </div>
  );
}
