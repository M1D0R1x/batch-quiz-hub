-- Fully remove dependence on Supabase Auth. `profiles` becomes our own
-- self-contained user table: username + password_hash, no auth.users link,
-- no supabase.auth.* calls anywhere in the app. This means the email-based
-- rate limits we kept hitting can never trigger again, for any number of users.

-- Early-stage/test data only — clear rows created via the old Supabase-Auth
-- flows so the new username/password_hash columns start clean.
TRUNCATE TABLE public.quiz_attempts, public.user_learn_progress, public.user_roles, public.profiles CASCADE;

-- Detach profiles.id from auth.users; it generates its own IDs from now on.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- username is now required and unique (case-insensitive)
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
DROP INDEX IF EXISTS profiles_username_lower_idx;
CREATE UNIQUE INDEX profiles_username_lower_idx ON public.profiles (lower(username));

-- Point dependent tables at profiles(id) instead of auth.users(id)
ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_learn_progress DROP CONSTRAINT IF EXISTS user_learn_progress_user_id_fkey;
ALTER TABLE public.user_learn_progress ADD CONSTRAINT user_learn_progress_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Nothing will ever insert into auth.users again — drop the old triggers.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;

-- New bootstrap: whichever profile signs up with this contact email becomes
-- super_admin automatically (same behavior as before, just keyed off our own
-- profiles table instead of auth.users).
CREATE OR REPLACE FUNCTION public.handle_new_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.contact_email = 'veerababusaviti21@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_assign_role ON public.profiles;
CREATE TRIGGER on_profile_created_assign_role
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_role();
