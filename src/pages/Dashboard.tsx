
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import DashboardStats from '@/components/DashboardStats';
import OrdersTable from '@/components/OrdersTable';
import EnhancedOrdersTable from '@/components/EnhancedOrdersTable';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userRole } = useAuth();
  const { orders, isLoading } = useOrders();

  const summary = {
    totalOrders: orders.length,
    activeOrders: orders.filter(order => order.status.toLowerCase() !== 'completed').length,
    completedOrders: orders.filter(order => order.status.toLowerCase() === 'completed').length,
    totalSpent: orders.reduce((sum, order) => sum + (order.price || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {userRole === 'admin' 
                  ? 'Manage orders and monitor business performance'
                  : 'Track your orders and manage your projects'
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/upload">
                <Button className="bg-polyform-green-600 hover:bg-polyform-green-700">
                  New Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {userRole === 'admin' ? (
            <>
              <AdminPanel />
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h2>
                <EnhancedOrdersTable orders={orders} isLoading={isLoading} />
              </div>
            </>
          ) : (
            <>
              <DashboardStats summary={summary} />
              <EnhancedOrdersTable orders={orders} isLoading={isLoading} />
            </>
          )}
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default Dashboard;
