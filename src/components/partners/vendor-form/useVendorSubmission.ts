
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VendorFormData } from './vendorFormSchema';

export const useVendorSubmission = (userId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadFiles = async (applicationId: string, files: File[]) => {
    if (files.length === 0) return;

    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${applicationId}/${Date.now()}_${index}.${fileExt}`;
      
      try {
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('vendor-documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('File upload error:', uploadError);
          throw uploadError;
        }

        // Save file metadata to database
        const { error: dbError } = await supabase
          .from('vendor_documents')
          .insert({
            application_id: applicationId,
            file_name: file.name,
            file_path: fileName,
            file_size: file.size,
            file_type: file.type,
            document_type: 'other'
          });
        
        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        throw error;
      }
    });

    await Promise.all(uploadPromises);
  };

  const submitApplication = async (data: VendorFormData, files: File[]) => {
    if (!userId) {
      toast.error('You must be logged in to submit an application');
      return false;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting application data:', data);
      
      // Insert vendor application
      const { data: application, error: applicationError } = await supabase
        .from('vendor_applications')
        .insert({
          user_id: userId,
          company_name: data.companyName,
          contact_person: data.contactPerson,
          email: data.email,
          phone: data.phone || null,
          business_type: data.businessType,
          experience_years: data.experienceYears,
          location: data.location,
          website: data.website || null,
          description: data.description,
          production_capacity: data.productionCapacity,
          status: 'pending'
        })
        .select()
        .single();

      if (applicationError) {
        console.error('Application submission error:', applicationError);
        throw applicationError;
      }

      console.log('Application submitted successfully:', application);

      // Upload files if any
      if (files.length > 0) {
        try {
          await uploadFiles(application.id, files);
          console.log('Files uploaded successfully');
        } catch (fileError) {
          console.error('File upload error:', fileError);
          // Don't fail the entire submission if file upload fails
          toast.error('Application submitted but some files failed to upload. Please try uploading them again.');
        }
      }

      toast.success('Application submitted successfully! We will review it and get back to you soon.');
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplication,
    isSubmitting
  };
};
