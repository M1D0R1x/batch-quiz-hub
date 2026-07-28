# QuizForge → Oracle Fusion Cloud PaaS Training Platform

Transform the existing QuizForge app into a production-grade PWA for ~200 Oracle Fusion Cloud Applications PaaS trainees. Add Learn mode, Practice mode, Mock Quizzes with negative marking, an Admin Panel, a Batch Leaderboard with Preset Avatars, client-side question caching, and a premium animated UI.

## Current State & Asset Assessment

| Layer | Status |
|---|---|
| **Auth** | ✅ Google OAuth + email/password via Supabase, auto-profile creation trigger, RLS |
| **Question Bank** | ✅ **317 Questions parsed** into `20260728_seed_oracle_fusion.sql` (77 APEX + 240 PaaS/OCI) |
| **Syllabus** | ✅ Extracted from `AEH_Fusion_Oracle_Cloud_Applications_PAAS_TOC new (1).xlsx` (12 modules) |
| **Onboarding** | ✅ Course track selection + display name |
| **Quiz Engine** | ✅ MCQ/MSQ, timer, flag, question grid, auto-submit on timeout |
| **Security** | ✅ Server functions with JWT auth, RLS, answer stripping during quizzes |
| **Design System** | ✅ Tailwind v4, oklch dark/light, Inter + Space Grotesk, 46 shadcn/ui components |

---

## Final Feature Scope

### 1. Preset Avatar Picker & User Profiles
- **Preset Avatar Grid**: 12 curated, high-tech/cloud-themed SVG avatar presets (e.g. *Oracle Oracle*, *Cloud Navigator*, *DevOps Specialist*, *APEX Ninja*, *Database Sentinel*).
- **Profile Customization**: Select preset avatar during onboarding or update anytime from the header/settings modal.
- **Zero Storage Overhead**: Stored as simple string keys (e.g., `avatar_id: "avatar_apex_ninja"`) in the `profiles` table.

### 2. Batch Leaderboard System
- **Leaderboard Views**:
  - 🏆 **Top Score Avg**: High achievers across completed attempts.
  - 🔥 **Streak Leaders**: Most consistent daily learners.
  - 🎯 **Total Quizzes Completed**: Volume drill leaders.
- **Filters**: All-Time vs. Weekly Leaderboard.
- **Privacy Control**: Trainees can toggle "Show on Leaderboard" in profile settings.
- **UI Card**: Displays user rank badge (Gold #1, Silver #2, Bronze #3), preset avatar, display name, score/streak stats.

### 3. Admin System & Role Management
- **Super Admin**: `veerababusaviti21@gmail.com` hardcoded as root admin via DB trigger.
- **Admin Capabilities**: Add/edit/delete courses, subtopics, and questions via dedicated `/_authenticated/admin` UI. Promote other trainees to Admin role.
- **RLS & Security Middleware**: `user_roles` table validates admin rights on server functions.

### 4. Client-Side Caching (Free-Tier Protection)
- Bulk fetch question metadata & text into IndexedDB via `idb-keyval` upon first sign-in.
- Light version-check hash request on app load.
- Reduces serverless function calls from ~600,000/mo down to ~6,200/mo for 200 users.

### 5. Learn Mode (Flashcard Study Browser)
- Browse questions chapter-by-chapter.
- Reveal correct answers and explanations on demand.
- Mark questions as "Learned" (stored in IndexedDB + synced DB progress table).
- 100% offline capable.

### 6. Negative Marking System
- Toggle in quiz setup: **Disabled** / **−0.25 (Standard)** / **−0.33 (Strict)**.
- Unanswered questions carry 0 penalty.
- Stored per attempt and displayed in results breakdown with deduction alerts.

### 7. PWA & Mobile Experience
- Installable manifest (`manifest.json`) + Service Worker caching for app shell and assets.
- Responsive mobile drawer navigation & touch-friendly option cards.

### 8. UI Polish & Visual Excellence
- Animated counters and score reveal with `canvas-confetti` on ≥80% scores.
- Donut charts & per-chapter bar charts using Recharts.
- Smooth page transitions and glassmorphic card effects.

---

## Proposed Changes

### Component 1: Avatars & Leaderboard System

#### [NEW] [avatars.ts](file:///Users/veera/batch-quiz-hub/src/lib/avatars.ts)
Preset SVG avatar registry with unique keys, titles, colors, and SVG paths.

#### [NEW] [leaderboard.tsx](file:///Users/veera/batch-quiz-hub/src/routes/_authenticated/leaderboard.tsx)
Leaderboard page featuring rank podium (1st, 2nd, 3rd), paginated table, time filter (Weekly/All-Time), and category tabs (Avg Score, Streak, Quizzes Completed).

#### [NEW] [leaderboard.functions.ts](file:///Users/veera/batch-quiz-hub/src/lib/leaderboard.functions.ts)
Server functions to compute public batch rankings respecting user privacy settings.

#### [NEW] Migration: `20260728_leaderboard_avatars.sql`
```sql
ALTER TABLE public.profiles
  ADD COLUMN avatar_preset TEXT DEFAULT 'avatar_cloud_1',
  ADD COLUMN show_on_leaderboard BOOLEAN DEFAULT true;

-- Public RLS view for leaderboard rankings
CREATE POLICY "profiles_read_public_leaderboard" ON public.profiles
  FOR SELECT TO authenticated USING (show_on_leaderboard = true);
```

---

### Component 2: Admin System & Security

#### [NEW] Migration: `20260728_user_roles.sql`
Creates `user_roles` table, super_admin trigger for `veerababusaviti21@gmail.com`, and RLS policies.

#### [NEW] [admin.functions.ts](file:///Users/veera/batch-quiz-hub/src/lib/admin.functions.ts)
Admin middleware and server functions for CRUD operations on Courses, Subtopics, Questions, and User Role Promotions.

#### [NEW] Admin Routes (`src/routes/_authenticated/admin/`)
- `index.tsx`: Admin dashboard stats.
- `courses.tsx`: Course & Subtopic management.
- `questions.tsx`: Add/edit MCQ/MSQ questions.
- `users.tsx`: Promote/demote batch members (Super Admin only).

---

### Component 3: Data Migration & Caching

#### [NEW] [20260728_seed_oracle_fusion.sql](file:///Users/veera/batch-quiz-hub/supabase/migrations/20260728_seed_oracle_fusion.sql)
317 questions parsed from `OCI APEX MCQ.pdf` and `Oracle PAAS - MCQ1 All Skill Checks.pdf`.

#### [NEW] [question-cache.ts](file:///Users/veera/batch-quiz-hub/src/lib/question-cache.ts) & [bulk-data.functions.ts](file:///Users/veera/batch-quiz-hub/src/lib/bulk-data.functions.ts)
Client-side IndexedDB caching layer with version hashing.

---

### Component 4: Learn Mode & Negative Marking

#### [NEW] `src/routes/_authenticated/learn.tsx` & `src/routes/_authenticated/learn.$subtopicId.tsx`
Flashcard study engine with answer reveal and "Learned" progress tracking.

#### [MODIFY] [quiz.setup.tsx](file:///Users/veera/batch-quiz-hub/src/routes/_authenticated/quiz.setup.tsx), [quiz.run.$attemptId.tsx](file:///Users/veera/batch-quiz-hub/src/routes/_authenticated/quiz.run.$attemptId.tsx), [quiz.results.$attemptId.tsx](file:///Users/veera/batch-quiz-hub/src/routes/_authenticated/quiz.results.$attemptId.tsx)
Negative marking configuration step, penalty logic, and detailed deduction breakdowns.

---

### Component 5: PWA & UI Polish

#### [NEW] `public/manifest.json` & `src/sw.ts`
PWA configuration and offline Service Worker.

#### [MODIFY] [styles.css](file:///Users/veera/batch-quiz-hub/src/styles.css), [app-header.tsx](file:///Users/veera/batch-quiz-hub/src/components/app-header.tsx), [dashboard.tsx](file:///Users/veera/batch-quiz-hub/src/routes/_authenticated/dashboard.tsx)
Glassmorphism utility classes, animations (confetti, flip-card, shimmer), preset avatar badge in header, mobile drawer menu.

---

## Execution Order

1. **Database Migrations**: Apply `user_roles`, `user_learn_progress`, `negative_marking`, `leaderboard_avatars`, and `seed_oracle_fusion`.
2. **Preset Avatars Registry**: Build `src/lib/avatars.ts` & avatar picker component.
3. **Admin System**: Implement server functions, middleware, and admin management pages.
4. **IndexedDB Caching**: Setup question caching engine & bulk data server functions.
5. **Learn Mode**: Build interactive flashcard study routes.
6. **Negative Marking**: Update quiz setup, runner, scoring engine, and result views.
7. **Leaderboard**: Implement ranking queries, leaderboard UI, and privacy settings.
8. **PWA Setup**: Add manifest, service worker, and Vite PWA configuration.
9. **UI Polish**: Add confetti, page transitions, animations, and rebrand landing page.
10. **Build Verification**: Run `npm run build` and perform full end-to-end verification.

---

## Verification Plan

### Automated Tests
```bash
npm run build    # TypeScript compilation & Vite bundle check
npm run lint     # ESLint code quality audit
```

### Manual Verification
1. **Super Admin Authorization**: Log in with `veerababusaviti21@gmail.com` → verify access to Admin Panel (`/admin`) → test creating questions and promoting another user. Log in with a standard email → verify access to `/admin` is denied.
2. **Preset Avatar Selection**: Open onboarding / profile settings → pick an avatar preset → verify it renders on the header, profile, and leaderboard podium.
3. **Leaderboard Verification**: Complete 2 quizzes → check `/leaderboard` → verify correct average score, total attempts, and streak badges.
4. **Learn Mode**: Navigate to `/learn` → flip flashcard → mark as learned → turn off network connection → verify flashcards still work offline.
5. **Negative Marking**: Configure a quiz with −0.25 penalty → intentionally answer 2 questions wrong → submit → verify score shows expected deduction.
6. **Offline PWA**: Audit with Chrome DevTools Lighthouse / PWA audit → install app standalone → verify offline launch.
