
-- Create vendor_applications table
CREATE TABLE public.vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT NOT NULL,
  experience_years INTEGER,
  capabilities TEXT[],
  certifications TEXT[],
  production_capacity TEXT,
  location TEXT,
  website TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_documents table
CREATE TABLE public.vendor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.vendor_applications(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'insurance', 'certifications', 'portfolio', 'other')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_applications
CREATE POLICY "Users can insert their own applications" ON public.vendor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" ON public.vendor_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.vendor_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for vendor_documents
CREATE POLICY "Users can insert documents for their applications" ON public.vendor_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendor_applications 
      WHERE id = application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view documents for their applications" ON public.vendor_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendor_applications 
      WHERE id = application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents for their applications" ON public.vendor_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.vendor_applications 
      WHERE id = application_id AND user_id = auth.uid()
    )
  );

-- Create storage bucket for vendor documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-documents', 'vendor-documents', false);

-- Storage policies for vendor documents
CREATE POLICY "Users can upload vendor documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vendor-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their vendor documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'vendor-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their vendor documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vendor-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better performance
CREATE INDEX idx_vendor_applications_user_id ON public.vendor_applications(user_id);
CREATE INDEX idx_vendor_applications_status ON public.vendor_applications(status);
CREATE INDEX idx_vendor_documents_application_id ON public.vendor_documents(application_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_vendor_applications_updated_at 
  BEFORE UPDATE ON public.vendor_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
