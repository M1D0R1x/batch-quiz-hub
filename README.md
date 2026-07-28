# QuizForge - Batch Quiz & Practice Platform

A quiz and exam practice platform built for study groups and training batches to prepare for certification exams.

## Features

- **Modern Dashboard**: Track average score, streaks, and identify strongest/weakest topics.
- **Dynamic Quiz Wizard**: Setup custom quizzes selecting specific subtopics, question counts, mix of MCQ/MSQ, and difficulty levels.
- **Simulate Test Mode**: Strict, distraction-free environment replicating real certification exams.
- **Admin Portal**: Review requested study materials and manually manage courses/questions.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend/Auth**: Supabase (PostgreSQL, Auth, RLS)
- **Framework**: TanStack Start (SSR/SPA hybrid)

## Local Development

To run the application locally, install dependencies and start the development server:

```sh
bun install
bun run dev
```

Ensure your `.env` file is populated with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
