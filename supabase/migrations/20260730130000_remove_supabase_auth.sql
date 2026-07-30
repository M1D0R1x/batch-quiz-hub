-- Fully remove dependence on Supabase Auth. `profiles` becomes our own
-- self-contained user table: username + password_hash, no auth.users link,
-- no supabase.auth.* calls anywhere in the app. This means the email-based
-- rate limits we kept hitting can never trigger again, for any number of users.

-- 1. Detach profiles.id from auth.users; it generates its own IDs from now on.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Add password_hash and contact_email columns if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- 3. Handle any existing null usernames before making username NOT NULL
UPDATE public.profiles 
  SET username = split_part(contact_email, '@', 1) 
  WHERE (username IS NULL OR username = '') AND contact_email IS NOT NULL;

UPDATE public.profiles 
  SET username = 'user_' || substring(id::text, 1, 8) 
  WHERE username IS NULL OR username = '';

-- 4. Make username required and unique (case-insensitive)
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
DROP INDEX IF EXISTS profiles_username_lower_idx;
CREATE UNIQUE INDEX profiles_username_lower_idx ON public.profiles (lower(username));

-- 5. Point dependent tables at profiles(id) instead of auth.users(id)
ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_learn_progress DROP CONSTRAINT IF EXISTS user_learn_progress_user_id_fkey;
ALTER TABLE public.user_learn_progress ADD CONSTRAINT user_learn_progress_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 6. Nothing will ever insert into auth.users again — drop the old triggers.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;

-- 7. New bootstrap: whichever profile signs up with this contact email becomes
-- super_admin automatically.
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
