-- Migration for QuizForge: Avatars, Leaderboard, Roles, Learn Progress & Negative Marking

-- 1. Profiles updates: Add avatar_preset and show_on_leaderboard
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_preset TEXT DEFAULT 'avatar_cloud_1',
  ADD COLUMN IF NOT EXISTS show_on_leaderboard BOOLEAN DEFAULT true;

-- Public RLS view for leaderboard rankings (authenticated users can read public profiles)
DROP POLICY IF EXISTS "profiles_read_public_leaderboard" ON public.profiles;
CREATE POLICY "profiles_read_public_leaderboard" ON public.profiles
  FOR SELECT TO authenticated USING (show_on_leaderboard = true);

-- 2. Quiz Attempts updates: Add negative_marking penalty rate
ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS negative_marking NUMERIC(4,2) DEFAULT 0.0;

-- 3. User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_select_own_or_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select_all" ON public.user_roles;
CREATE POLICY "user_roles_select_all" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

-- Auto-assign super_admin for veerababusaviti21@gmail.com on signup/login trigger
CREATE OR REPLACE FUNCTION public.handle_user_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'veerababusaviti21@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_role_assignment();

-- 4. User Learn Progress table (for Flashcards / Learn Mode)
CREATE TABLE IF NOT EXISTS public.user_learn_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  is_learned BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_learn_progress_user_question_key UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_learn_progress_user ON public.user_learn_progress(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_learn_progress TO authenticated;
GRANT ALL ON public.user_learn_progress TO service_role;
ALTER TABLE public.user_learn_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "learn_progress_own_all" ON public.user_learn_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin' FROM auth.users WHERE email = 'veerababusaviti21@gmail.com'
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
