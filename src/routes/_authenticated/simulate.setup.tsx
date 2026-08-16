import { createFileRoute } from "@tanstack/react-router";
import { QuizSetupPage, searchSchema } from "./quiz.setup";

export const Route = createFileRoute("/_authenticated/simulate/setup")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Simulate Test — QuizForge" },
      { name: "description", content: "Run a strict full-exam simulation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <QuizSetupPage simulate />,
});