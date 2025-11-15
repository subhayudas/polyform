import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import EnhancedOrdersTable from '@/components/EnhancedOrdersTable';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Link } from 'react-router-dom';
import { Plus, Package, AlertCircle, Clock, CheckCircle, DollarSign } from 'lucide-react';
import CreateTestOrder from '@/components/CreateTestOrder';

const Dashboard = () => {
  const { userRole, user } = useAuth();
  const { orders, isLoading, error } = useOrders();

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                  currentTime.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  // Calculate stats
  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(order => !['delivered', 'cancelled'].includes(order.status || '')).length,
    completedOrders: orders.filter(order => order.status === 'delivered').length,
    totalSpent: orders.reduce((sum, order) => sum + (order.price || 0), 0)
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Clean Header */}
      <section className="pt-20 px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {greeting}, {user?.email?.split('@')[0]}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/upload">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 font-medium">
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
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {userRole === 'admin' ? 'Total Revenue' : 'Total Spent'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {userRole === 'admin' ? (
            <>
              <AdminPanel />

              {/* Orders Table */}
              <div className="mt-8 border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">All Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor all customer orders</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{orders.length}</span>
                    <span>orders</span>
                  </div>
                </div>
                <EnhancedOrdersTable orders={orders} isLoading={isLoading} />
              </div>
            </>
          ) : (
            <>
              {/* Orders Section */}
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      View and manage all your orders
                    </p>
                  </div>
                  {orders.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{orders.length}</span> orders
                    </div>
                  )}
                </div>
                {orders.length > 0 ? (
                  <EnhancedOrdersTable orders={orders} isLoading={isLoading} />
                ) : !isLoading && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Upload your 3D model and get an instant quote
                    </p>
                    <Link to="/upload">
                      <Button className="bg-gray-900 text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Order
                      </Button>
                    </Link>
                    <div className="mt-6">
                      <CreateTestOrder />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Display error if any */}
              {error && (
                <div className="border-l-2 border-l-red-500 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">Error Loading Orders</h4>
                      <p className="text-sm text-red-700">{error}</p>
                      <p className="text-xs text-red-600 mt-2">Check the browser console for more details.</p>
                    </div>
                  </div>
                </div>
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
