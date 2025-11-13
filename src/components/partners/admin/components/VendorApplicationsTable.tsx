
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { VendorApplication } from '../types/vendorTypes';

interface VendorApplicationsTableProps {
  applications: VendorApplication[];
  onViewApplication: (application: VendorApplication) => void;
  onUpdateStatus: (applicationId: string, status: 'pending' | 'approved' | 'rejected') => void;
}

const VendorApplicationsTable = ({ applications, onViewApplication, onUpdateStatus }: VendorApplicationsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary/35 text-primary border-primary/80';
      case 'rejected':
        return 'bg-primary/5 text-primary/70 border-primary/20';
      case 'pending':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return 'bg-primary/8 text-primary/60 border-primary/25';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Business Type</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">
              <div>
                <div>{application.company_name}</div>
                {application.website && (
                  <div className="text-sm text-gray-500">{application.website}</div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div>{application.contact_person}</div>
                <div className="text-sm text-gray-500">{application.email}</div>
                <div className="text-sm text-gray-500">{application.phone}</div>
              </div>
            </TableCell>
            <TableCell>{application.business_type}</TableCell>
            <TableCell>{application.experience_years} years</TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(application.status)} flex items-center gap-1 w-fit`}>
                {getStatusIcon(application.status)}
                {application.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(application.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewApplication(application)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Select
                  value={application.status}
                  onValueChange={(value: 'pending' | 'approved' | 'rejected') =>
                    onUpdateStatus(application.id, value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VendorApplicationsTable;
