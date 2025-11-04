import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import DashboardStats from '@/components/DashboardStats';
import EnhancedOrdersTable from '@/components/EnhancedOrdersTable';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Link } from 'react-router-dom';
import { Plus, BarChart3, TrendingUp, Package } from 'lucide-react';

const Dashboard = () => {
  const { userRole, user } = useAuth();
  const { orders, isLoading } = useOrders();

  const summary = {
    totalOrders: orders.length,
    activeOrders: orders.filter(order => !['delivered', 'cancelled'].includes(order.status || '')).length,
    completedOrders: orders.filter(order => order.status === 'delivered').length,
    totalSpent: orders.reduce((sum, order) => sum + (order.price || 0), 0)
  };

  // Calculate recent activity
  const recentOrders = orders.slice(0, 5);
  const avgOrderValue = orders.length > 0 
    ? summary.totalSpent / orders.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation />
      
      {/* Enhanced Header */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-polyform-green-600 to-polyform-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {userRole === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
              </h1>
              <p className="text-polyform-green-100 text-lg">
                {userRole === 'admin' 
                  ? 'Manage orders and monitor business performance'
                  : 'Track your orders and manage your projects'
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/upload">
                <Button className="bg-white text-polyform-green-600 hover:bg-gray-100 font-semibold shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>Total: {orders.length} orders</span>
                  </div>
                </div>
                <EnhancedOrdersTable orders={orders} isLoading={isLoading} />
              </div>
            </>
          ) : (
            <>
              {/* Stats Section */}
              <DashboardStats summary={summary} />

              {/* Quick Insights */}
              {orders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Average Order Value</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${avgOrderValue.toFixed(2)}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {summary.totalOrders > 0 
                              ? ((summary.completedOrders / summary.totalOrders) * 100).toFixed(0)
                              : 0}%
                          </p>
                        </div>
                        <Package className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Active Projects</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {summary.activeOrders}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">In progress</p>
                        </div>
                        <Package className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Orders Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                    <p className="text-gray-600 mt-1">
                      View and manage all your orders in one place
                    </p>
                  </div>
                </div>
                <EnhancedOrdersTable orders={orders} isLoading={isLoading} />
              </div>

              {/* Empty State for New Users */}
              {orders.length === 0 && !isLoading && (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Started with Your First Order</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Upload your 3D model and get an instant quote. Our team will review and process your order quickly.
                    </p>
                    <Link to="/upload">
                      <Button className="bg-polyform-green-600 hover:bg-polyform-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Order
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
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
