
import React from 'react';
import { useOrders } from '@/hooks/useOrders';
import AdminStats from './AdminStats';
import AdminOrdersTable from './AdminOrdersTable';

const AdminOrdersTab = () => {
  const { orders, updateOrder, isLoading } = useOrders();

  const summary = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'completed').length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.price || 0), 0)
  };

  return (
    <div className="space-y-6">
      <AdminStats summary={summary} />
      <AdminOrdersTable orders={orders} updateOrder={updateOrder} isLoading={isLoading} />
    </div>
  );
};

export default AdminOrdersTab;
