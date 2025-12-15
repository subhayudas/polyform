-- Create waitlist table for pre-launch site
-- This migration creates a table to track users who sign up during the pre-launch phase

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  position INTEGER, -- Position in waitlist (can be calculated based on signed_up_at)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'invited', 'converted')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON public.waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_signed_up_at ON public.waitlist(signed_up_at);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own waitlist entry
CREATE POLICY "Users can view their own waitlist entry" ON public.waitlist
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own waitlist entry
CREATE POLICY "Users can insert their own waitlist entry" ON public.waitlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all waitlist entries
CREATE POLICY "Admins can view all waitlist entries" ON public.waitlist
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Admins can update all waitlist entries
CREATE POLICY "Admins can update all waitlist entries" ON public.waitlist
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on waitlist updates
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_waitlist_updated_at();

-- Function to calculate waitlist position
CREATE OR REPLACE FUNCTION get_waitlist_position(waitlist_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  position INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO position
  FROM public.waitlist
  WHERE signed_up_at < (
    SELECT signed_up_at 
    FROM public.waitlist 
    WHERE user_id = waitlist_user_id
  );
  RETURN position;
END;
$$ LANGUAGE plpgsql;

