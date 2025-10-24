
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { vendorFormSchema, VendorFormData } from './vendor-form/vendorFormSchema';
import { useVendorSubmission } from './vendor-form/useVendorSubmission';
import VendorFormFields from './vendor-form/VendorFormFields';
import VendorFileUpload from './vendor-form/VendorFileUpload';

const VendorApplicationForm = () => {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { submitApplication, isSubmitting } = useVendorSubmission(user?.id);

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: user?.email || '',
      phone: '',
      businessType: '',
      experienceYears: 0,
      location: '',
      website: '',
      description: '',
      productionCapacity: '',
    },
  });

  const onSubmit = async (data: VendorFormData) => {
    const success = await submitApplication(data, selectedFiles);
    if (success) {
      form.reset();
      setSelectedFiles([]);
    }
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Vendor Application</CardTitle>
          <CardDescription>
            Please log in to submit a vendor application.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Become a Vendor Partner</CardTitle>
        <CardDescription>
          Submit your application to join our network of trusted manufacturing partners.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <VendorFormFields form={form} userEmail={user?.email} />
            
            <VendorFileUpload 
              selectedFiles={selectedFiles}
              onFilesChange={setSelectedFiles}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-polyform-green-600 hover:bg-polyform-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VendorApplicationForm;
