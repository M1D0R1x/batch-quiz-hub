
-- Enums
CREATE TYPE public.question_type AS ENUM ('mcq','msq');
CREATE TYPE public.difficulty_level AS ENUM ('easy','medium','hard');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  course_track_id UUID,
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_select_all_authenticated" ON public.courses FOR SELECT TO authenticated USING (true);

-- Subtopics
CREATE TABLE public.subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_subtopics_course ON public.subtopics(course_id);
GRANT SELECT ON public.subtopics TO authenticated;
GRANT ALL ON public.subtopics TO service_role;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subtopics_select_all_authenticated" ON public.subtopics FOR SELECT TO authenticated USING (true);

-- Questions
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtopic_id UUID NOT NULL REFERENCES public.subtopics(id) ON DELETE CASCADE,
  type public.question_type NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answers JSONB NOT NULL,
  explanation TEXT,
  difficulty public.difficulty_level NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_subtopic ON public.questions(subtopic_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
GRANT SELECT ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_select_all_authenticated" ON public.questions FOR SELECT TO authenticated USING (true);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  subtopic_ids UUID[] NOT NULL DEFAULT '{}',
  question_ids UUID[] NOT NULL DEFAULT '{}',
  question_count INT NOT NULL,
  time_limit_seconds INT,
  is_simulate BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score NUMERIC(5,2),
  max_score NUMERIC(5,2),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX idx_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_attempts_course ON public.quiz_attempts(course_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts_own_all" ON public.quiz_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed courses + content
DO $$
DECLARE
  c1 UUID; c2 UUID;
  s1 UUID; s2 UUID; s3 UUID; s4 UUID;
BEGIN
  INSERT INTO public.courses (name, description, icon) VALUES
    ('Cloud Fundamentals', 'Core concepts across compute, storage, networking, and security in the cloud.', 'cloud')
    RETURNING id INTO c1;
  INSERT INTO public.courses (name, description, icon) VALUES
    ('Data Science Basics', 'Statistics, Python, and machine learning essentials for practitioners.', 'bar-chart')
    RETURNING id INTO c2;

  INSERT INTO public.subtopics (course_id, name, order_index) VALUES (c1, 'Compute & Virtualization', 1) RETURNING id INTO s1;
  INSERT INTO public.subtopics (course_id, name, order_index) VALUES (c1, 'Storage & Databases', 2) RETURNING id INTO s2;
  INSERT INTO public.subtopics (course_id, name, order_index) VALUES (c2, 'Statistics Foundations', 1) RETURNING id INTO s3;
  INSERT INTO public.subtopics (course_id, name, order_index) VALUES (c2, 'Python for Data Science', 2) RETURNING id INTO s4;

  -- Compute
  INSERT INTO public.questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty) VALUES
  (s1, 'mcq', 'Which service model gives you virtual machines you manage yourself?',
   '["SaaS","PaaS","IaaS","FaaS"]'::jsonb, '[2]'::jsonb,
   'IaaS (Infrastructure as a Service) provides VMs and networks you manage.', 'easy'),
  (s1, 'msq', 'Which of the following are typically considered serverless? (select all that apply)',
   '["Virtual machines","Managed functions (FaaS)","Managed queues","Bare metal servers"]'::jsonb,
   '[1,2]'::jsonb,
   'Managed functions and queues are serverless; VMs and bare metal are not.', 'medium'),
  (s1, 'mcq', 'What primarily distinguishes containers from virtual machines?',
   '["Containers share the host OS kernel","Containers cannot be networked","Containers require a hypervisor","Containers only run on Windows"]'::jsonb,
   '[0]'::jsonb, 'Containers share the host kernel; VMs run a full OS on a hypervisor.', 'medium');

  -- Storage
  INSERT INTO public.questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty) VALUES
  (s2, 'mcq', 'Which storage type is best suited for structured relational data?',
   '["Object storage","Block storage","Relational database","File storage"]'::jsonb,
   '[2]'::jsonb, 'Relational databases store structured tabular data with SQL.', 'easy'),
  (s2, 'msq', 'Which are examples of NoSQL databases? (select all that apply)',
   '["PostgreSQL","MongoDB","DynamoDB","MySQL"]'::jsonb, '[1,2]'::jsonb,
   'MongoDB and DynamoDB are NoSQL; PostgreSQL and MySQL are relational.', 'medium');

  -- Stats
  INSERT INTO public.questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty) VALUES
  (s3, 'mcq', 'The median is best described as:',
   '["The average value","The most frequent value","The middle value when sorted","The spread of values"]'::jsonb,
   '[2]'::jsonb, 'The median is the middle value of a sorted dataset.', 'easy'),
  (s3, 'msq', 'Which are measures of dispersion? (select all that apply)',
   '["Mean","Variance","Standard deviation","Mode"]'::jsonb, '[1,2]'::jsonb,
   'Variance and standard deviation measure spread; mean and mode are central tendency.', 'medium'),
  (s3, 'mcq', 'A p-value of 0.03 with alpha=0.05 means:',
   '["Fail to reject the null","Reject the null","The result is meaningless","Alpha must be increased"]'::jsonb,
   '[1]'::jsonb, 'p < alpha means you reject the null hypothesis.', 'hard');

  -- Python
  INSERT INTO public.questions (subtopic_id, type, question_text, options, correct_answers, explanation, difficulty) VALUES
  (s4, 'mcq', 'Which library is most commonly used for numerical arrays in Python?',
   '["pandas","numpy","matplotlib","requests"]'::jsonb, '[1]'::jsonb,
   'NumPy provides the ndarray, the standard n-dimensional array in Python.', 'easy'),
  (s4, 'msq', 'Which of these are pandas data structures? (select all that apply)',
   '["Series","DataFrame","Tensor","Panel"]'::jsonb, '[0,1]'::jsonb,
   'Series and DataFrame are core pandas structures (Panel is deprecated; Tensor is not pandas).', 'medium');
END $$;
