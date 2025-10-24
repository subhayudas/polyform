
-- Check what already exists and create missing components

-- First, let's see if notifications table exists, if not create it
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  related_type text,
  related_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on notifications if not already enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Update vendor_applications table with new columns if they don't exist
ALTER TABLE public.vendor_applications 
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS review_notes text,
ADD COLUMN IF NOT EXISTS capabilities text[],
ADD COLUMN IF NOT EXISTS certifications text[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON public.vendor_applications(status);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_user_id ON public.vendor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_application_id ON public.vendor_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Update RLS policies for vendor applications to allow admin access
DROP POLICY IF EXISTS "Users can view their own applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.vendor_applications;

CREATE POLICY "Users can view their own applications" ON public.vendor_applications
  FOR SELECT USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can insert their own applications" ON public.vendor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.vendor_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all applications" ON public.vendor_applications
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Update RLS policies for vendor documents to allow admin access
DROP POLICY IF EXISTS "Users can view documents for their applications" ON public.vendor_documents;
DROP POLICY IF EXISTS "Users can insert documents for their applications" ON public.vendor_documents;
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.vendor_documents;

CREATE POLICY "Users can view documents for their applications" ON public.vendor_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendor_applications 
      WHERE id = application_id AND user_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert documents for their applications" ON public.vendor_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendor_applications 
      WHERE id = application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all documents" ON public.vendor_documents
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
