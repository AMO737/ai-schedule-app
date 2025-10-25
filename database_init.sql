-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE day_of_week AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fixed Events table
CREATE TABLE public.fixed_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Learning Goals table
CREATE TABLE public.learning_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weekly_hours DECIMAL(4,2) NOT NULL CHECK (weekly_hours > 0 AND weekly_hours <= 168),
  block_duration INTEGER NOT NULL DEFAULT 30 CHECK (block_duration > 0),
  wake_up_time TIME NOT NULL,
  sleep_time TIME NOT NULL,
  break_duration INTEGER DEFAULT 5 CHECK (break_duration >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_sleep_wake_time CHECK (sleep_time > wake_up_time)
);

-- Subject Distribution table (for learning goals)
CREATE TABLE public.subject_distributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_goal_id UUID REFERENCES public.learning_goals(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(learning_goal_id, subject)
);

-- Study Blocks table
CREATE TABLE public.study_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  is_completed BOOLEAN DEFAULT FALSE,
  is_skipped BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_study_time_range CHECK (end_time > start_time),
  UNIQUE(user_id, date, start_time)
);

-- Weekly Progress table
CREATE TABLE public.weekly_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  total_planned_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_completed_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);

-- Subject Progress table
CREATE TABLE public.subject_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekly_progress_id UUID REFERENCES public.weekly_progress(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  planned_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(weekly_progress_id, subject)
);

-- Notification Settings table
CREATE TABLE public.notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  reminder_minutes_before INTEGER DEFAULT 5 CHECK (reminder_minutes_before >= 0),
  snooze_minutes INTEGER DEFAULT 10 CHECK (snooze_minutes >= 0),
  enable_push_notifications BOOLEAN DEFAULT TRUE,
  enable_email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fixed Events policies
CREATE POLICY "Users can manage own fixed events" ON public.fixed_events
  FOR ALL USING (auth.uid() = user_id);

-- Learning Goals policies
CREATE POLICY "Users can manage own learning goals" ON public.learning_goals
  FOR ALL USING (auth.uid() = user_id);

-- Subject Distributions policies
CREATE POLICY "Users can manage own subject distributions" ON public.subject_distributions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.learning_goals lg
      WHERE lg.id = subject_distributions.learning_goal_id
      AND lg.user_id = auth.uid()
    )
  );

-- Study Blocks policies
CREATE POLICY "Users can manage own study blocks" ON public.study_blocks
  FOR ALL USING (auth.uid() = user_id);

-- Weekly Progress policies
CREATE POLICY "Users can manage own weekly progress" ON public.weekly_progress
  FOR ALL USING (auth.uid() = user_id);

-- Subject Progress policies
CREATE POLICY "Users can manage own subject progress" ON public.subject_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weekly_progress wp
      WHERE wp.id = subject_progress.weekly_progress_id
      AND wp.user_id = auth.uid()
    )
  );

-- Notification Settings policies
CREATE POLICY "Users can manage own notification settings" ON public.notification_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_fixed_events_user_day ON public.fixed_events(user_id, day_of_week);
CREATE INDEX idx_study_blocks_user_date ON public.study_blocks(user_id, date);
CREATE INDEX idx_weekly_progress_user_week ON public.weekly_progress(user_id, week_start_date);
CREATE INDEX idx_subject_progress_weekly_progress ON public.subject_progress(weekly_progress_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixed_events_updated_at BEFORE UPDATE ON public.fixed_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON public.learning_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_blocks_updated_at BEFORE UPDATE ON public.study_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_progress_updated_at BEFORE UPDATE ON public.weekly_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
