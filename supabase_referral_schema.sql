-- Referral System Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
  reward_amount INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_referral_per_email UNIQUE (referrer_id, referred_email)
);

-- Create user referral stats table
CREATE TABLE IF NOT EXISTS public.user_referral_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_referrals INTEGER DEFAULT 0,
  completed_referrals INTEGER DEFAULT 0,
  pending_referrals INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_email ON public.referrals(referred_email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at);

-- Function to update user stats when referral is completed
CREATE OR REPLACE FUNCTION public.handle_referral_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status = 'pending' THEN
    -- Update referrer stats
    UPDATE public.user_referral_stats
    SET 
      completed_referrals = completed_referrals + 1,
      pending_referrals = pending_referrals - 1,
      total_earned = total_earned + NEW.reward_amount,
      updated_at = NOW()
    WHERE user_id = NEW.referrer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for referral completion
CREATE TRIGGER trigger_referral_completion
  AFTER UPDATE OF status ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_completion();

-- Function to create user referral stats on signup
CREATE OR REPLACE FUNCTION public.create_user_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_referral_stats (user_id, referral_code)
  VALUES (
    NEW.id, 
    'REF' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new user creation
CREATE TRIGGER trigger_create_user_referral_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_referral_stats();

-- Row Level Security (RLS) policies
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referral_stats ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Users can view their own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- User referral stats policies
CREATE POLICY "Users can view their own stats" ON public.user_referral_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_referral_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to check daily referral limit
CREATE OR REPLACE FUNCTION public.check_daily_referral_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO daily_count
  FROM public.referrals
  WHERE referrer_id = user_uuid
    AND created_at >= date_trunc('day', NOW())
    AND created_at < date_trunc('day', NOW()) + INTERVAL '1 day';
  
  RETURN daily_count < 10;
END;
$$ LANGUAGE plpgsql;

-- Function to get referral stats
CREATE OR REPLACE FUNCTION public.get_referral_stats(user_uuid UUID)
RETURNS TABLE (
  total_referrals INTEGER,
  completed_referrals INTEGER,
  pending_referrals INTEGER,
  total_earned INTEGER,
  referral_code TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(total_referrals, 0),
    COALESCE(completed_referrals, 0),
    COALESCE(pending_referrals, 0),
    COALESCE(total_earned, 0),
    referral_code
  FROM public.user_referral_stats
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
