
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Clock, AlertCircle, XCircle, FileText, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface VendorApplication {
  id: string;
  company_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  review_notes: string | null;
}

interface VendorDocument {
  id: string;
  file_name: string;
  file_size: number | null;
  document_type: string;
  uploaded_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const VendorApplicationStatus = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);

      // Fetch documents for the first application if exists
      if (data && data.length > 0) {
        fetchDocuments(data[0].id);
        setSelectedApplication(data[0]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch your applications');
    }
  };

  const fetchDocuments = async (applicationId: string) => {
    try {
      const { data, error } = await supabase
        .from('vendor_documents')
        .select('*')
        .eq('application_id', applicationId);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('related_type', 'vendor_application')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchApplications(),
        fetchNotifications()
      ]).finally(() => setIsLoading(false));
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'under_review':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary/35 text-primary border-primary/80';
      case 'rejected':
        return 'bg-primary/5 text-primary/70 border-primary/20';
      case 'under_review':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return 'bg-primary/8 text-primary/60 border-primary/25';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your application has been approved. Welcome to our vendor network!';
      case 'rejected':
        return 'Unfortunately, your application was not approved at this time. Please see review notes for details.';
      case 'under_review':
        return 'Your application is currently being reviewed by our team. We\'ll notify you of any updates.';
      default:
        return 'Your application has been received and is pending initial review.';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Please Log In</CardTitle>
          <CardDescription>
            You need to be logged in to view your vendor application status.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading your applications...</div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Applications Found</CardTitle>
          <CardDescription>
            You haven't submitted any vendor applications yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(selectedApplication?.status || 'pending')}
            Application Status: {selectedApplication?.status.replace('_', ' ').toUpperCase()}
          </CardTitle>
          <CardDescription>
            {getStatusMessage(selectedApplication?.status || 'pending')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Company</p>
              <p className="text-lg font-semibold">{selectedApplication?.company_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-lg font-semibold">
                {selectedApplication ? new Date(selectedApplication.created_at).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-lg font-semibold">
                {selectedApplication ? new Date(selectedApplication.updated_at).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>

          {selectedApplication?.review_notes && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Review Notes</h4>
              <p className="text-primary/80">{selectedApplication.review_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest notifications about your vendor applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-primary/5' : 'bg-primary/10 border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application History */}
      {applications.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>
              All your vendor applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.company_name}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(application.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(application);
                          fetchDocuments(application.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Submitted Documents</CardTitle>
          <CardDescription>
            Documents uploaded with your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{document.file_name}</span>
                    <span className="text-sm text-gray-500">
                      ({document.file_size ? (document.file_size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'})
                    </span>
                    <Badge variant="outline">{document.document_type}</Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(document.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorApplicationStatus;
