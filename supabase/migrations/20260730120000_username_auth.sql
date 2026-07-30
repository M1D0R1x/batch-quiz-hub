-- Username-based auth: avoids Supabase's built-in email rate limit entirely.
-- Users sign up/log in with a username; under the hood we use a deterministic
-- synthetic email (username@quizforge.internal) with Supabase Auth, so no
-- confirmation email is ever sent and the rate limiter never triggers.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Case-insensitive uniqueness for usernames (belt-and-suspenders; the synthetic
-- email's own unique constraint on auth.users already prevents duplicates too)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON public.profiles (lower(username))
  WHERE username IS NOT NULL;

-- Update handle_new_user to also store username + contact_email from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, username, contact_email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'contact_email'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Admin auto-assign now also checks contact_email metadata, since the auth
-- email itself will be a synthetic address for username-based signups
CREATE OR REPLACE FUNCTION public.handle_user_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'veerababusaviti21@gmail.com'
     OR NEW.raw_user_meta_data->>'contact_email' = 'veerababusaviti21@gmail.com' THEN
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
