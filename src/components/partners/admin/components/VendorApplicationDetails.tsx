
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { VendorApplication, VendorDocument } from '../types/vendorTypes';

interface VendorApplicationDetailsProps {
  application: VendorApplication;
  documents: VendorDocument[];
  onUpdateStatus: (applicationId: string, status: 'pending' | 'approved' | 'rejected') => void;
  onClose: () => void;
}

const VendorApplicationDetails = ({ 
  application, 
  documents, 
  onUpdateStatus, 
  onClose 
}: VendorApplicationDetailsProps) => {
  const getApplicationDocuments = (applicationId: string) => {
    return documents.filter(doc => doc.application_id === applicationId);
  };

  const applicationDocuments = getApplicationDocuments(application.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Details - {application.company_name}</CardTitle>
        <CardDescription>
          Detailed information about the vendor application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Company Information</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Company:</strong> {application.company_name}</div>
              <div><strong>Website:</strong> {application.website || 'Not provided'}</div>
              <div><strong>Business Type:</strong> {application.business_type}</div>
              <div><strong>Experience:</strong> {application.experience_years} years</div>
              {application.location && (
                <div><strong>Location:</strong> {application.location}</div>
              )}
              {application.production_capacity && (
                <div><strong>Production Capacity:</strong> {application.production_capacity}</div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Contact Name:</strong> {application.contact_person}</div>
              <div><strong>Email:</strong> {application.email}</div>
              <div><strong>Phone:</strong> {application.phone}</div>
            </div>
          </div>
        </div>

        {application.description && (
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-sm text-gray-700">{application.description}</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {application.capabilities.map((capability, index) => (
              <Badge key={index} variant="secondary">
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            {application.certifications.map((cert, index) => (
              <Badge key={index} variant="outline">
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Documents</h4>
          <div className="space-y-2">
            {applicationDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{document.document_type}</div>
                  <div className="text-sm text-gray-500">{document.file_name}</div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={document.file_path} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              </div>
            ))}
            {applicationDocuments.length === 0 && (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            )}
          </div>
        </div>

        {application.review_notes && (
          <div>
            <h4 className="font-semibold mb-2">Review Notes</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{application.review_notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            onClick={() => onUpdateStatus(application.id, 'approved')}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => onUpdateStatus(application.id, 'rejected')}
            variant="destructive"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorApplicationDetails;
