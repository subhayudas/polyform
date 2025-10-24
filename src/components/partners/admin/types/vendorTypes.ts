
export interface VendorApplication {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  business_type: string;
  capabilities: string[];
  experience_years: number;
  certifications: string[];
  website: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id: string;
  production_capacity?: string;
  location?: string;
  description?: string;
  review_notes?: string;
  reviewed_by?: string;
}

export interface VendorDocument {
  id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_type?: string;
  file_size?: number;
  uploaded_at: string;
}
