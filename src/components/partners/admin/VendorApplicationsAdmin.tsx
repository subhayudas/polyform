
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVendorApplications } from './hooks/useVendorApplications';
import VendorApplicationsTable from './components/VendorApplicationsTable';
import VendorApplicationDetails from './components/VendorApplicationDetails';
import { VendorApplication } from './types/vendorTypes';

const VendorApplicationsAdmin = () => {
  const { applications, documents, isLoading, updateApplicationStatus } = useVendorApplications();
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading vendor applications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Applications</CardTitle>
          <CardDescription>
            Review and manage vendor partnership applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorApplicationsTable
            applications={applications}
            onViewApplication={setSelectedApplication}
            onUpdateStatus={updateApplicationStatus}
          />
        </CardContent>
      </Card>

      {selectedApplication && (
        <VendorApplicationDetails
          application={selectedApplication}
          documents={documents}
          onUpdateStatus={updateApplicationStatus}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default VendorApplicationsAdmin;
