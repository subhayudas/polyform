
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VendorApplication, VendorDocument } from '../types/vendorTypes';

export const useVendorApplications = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to interface fields with proper type casting
      const mappedData = data?.map(app => ({
        ...app,
        contact_person: app.contact_person || '',
        status: app.status as 'pending' | 'approved' | 'rejected',
        capabilities: app.capabilities || [],
        certifications: app.certifications || [],
        created_at: app.created_at || new Date().toISOString(),
        updated_at: app.updated_at || new Date().toISOString(),
      })) || [];
      
      setApplications(mappedData);
    } catch (error) {
      console.error('Error fetching vendor applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_documents')
        .select('*');

      if (error) throw error;
      
      // Map database fields to interface fields
      const mappedData = data?.map(doc => ({
        id: doc.id,
        application_id: doc.application_id,
        document_type: doc.document_type,
        file_name: doc.file_name,
        file_path: doc.file_path,
        file_type: doc.file_type,
        file_size: doc.file_size,
        uploaded_at: doc.uploaded_at,
      })) || [];
      
      setDocuments(mappedData);
    } catch (error) {
      console.error('Error fetching vendor documents:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;
      
      // Refresh applications
      fetchApplications();
      
      // Send notification email
      await sendStatusNotification(applicationId, status);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const sendStatusNotification = async (applicationId: string, status: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    try {
      // This would typically integrate with an email service
      console.log(`Sending ${status} notification to ${application.email}`);
      
      // You would integrate with a service like SendGrid, Mailgun, etc.
      // For now, we'll just log it
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchDocuments();
  }, []);

  return {
    applications,
    documents,
    isLoading,
    updateApplicationStatus,
    refetch: () => {
      fetchApplications();
      fetchDocuments();
    }
  };
};
