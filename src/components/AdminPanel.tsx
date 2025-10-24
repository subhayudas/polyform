
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import VendorApplicationsAdmin from '@/components/partners/admin/VendorApplicationsAdmin';
import AdminOrdersTab from '@/components/admin/AdminOrdersTab';

const AdminPanel = () => {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Orders Management
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Vendor Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <AdminOrdersTab />
        </TabsContent>

        <TabsContent value="vendors">
          <VendorApplicationsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
