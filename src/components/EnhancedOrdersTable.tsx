import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import OrderDetailView from './OrderDetailView';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  FileText,
  Download,
  Search,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/hooks/useOrders';

interface EnhancedOrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_production: 'bg-purple-100 text-purple-800 border-purple-200',
  quality_check: 'bg-orange-100 text-orange-800 border-orange-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  on_hold: 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  in_production: Package,
  quality_check: AlertCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  on_hold: AlertCircle
};

const EnhancedOrdersTable: React.FC<EnhancedOrdersTableProps> = ({ 
  orders, 
  isLoading, 
  onStatusUpdate 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusUpdateReason, setStatusUpdateReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const { toast } = useToast();
  const { updateOrderStatus } = useOrders();
  const { userRole } = useAuth();

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, statusUpdateReason);
      if (onStatusUpdate) {
        onStatusUpdate(orderId, newStatus);
      }
      setStatusUpdateReason('');
      toast({
        title: "Status Updated",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'TBD';
    return `$${amount.toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock;
    return (
      <Badge className={cn(
        "px-2 py-1 text-xs font-medium border flex items-center gap-1",
        statusColors[status as keyof typeof statusColors] || statusColors.pending
      )}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Filter orders based on search, status, and tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && !['delivered', 'cancelled'].includes(order.status || '')) ||
      (activeTab === 'completed' && order.status === 'delivered') ||
      (activeTab === 'pending' && ['pending', 'confirmed'].includes(order.status || ''));

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Group orders by status for tab counts
  const orderCounts = {
    all: orders.length,
    active: orders.filter(o => !['delivered', 'cancelled'].includes(o.status || '')).length,
    completed: orders.filter(o => o.status === 'delivered').length,
    pending: orders.filter(o => ['pending', 'confirmed'].includes(o.status || '')).length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-polyform-green-600 mb-4"></div>
            <span className="text-gray-600">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <p className="text-sm text-gray-400 mb-4">Check the browser console for debug information.</p>
          <Button 
            onClick={() => window.location.href = '/upload'}
            className="bg-polyform-green-600 hover:bg-polyform-green-700"
          >
            <Package className="w-4 h-4 mr-2" />
            Create Your First Order
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders by number, file, material, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_production">In Production</SelectItem>
                    <SelectItem value="quality_check">Quality Check</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({orderCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({orderCounts.active})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({orderCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({orderCounts.pending})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders match your filters</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-polyform-green-500">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-polyform-green-600" />
                            <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                            {getStatusBadge(order.status || 'pending')}
                          </div>
                          <p className="text-sm text-gray-500">
                            {order.customer?.full_name || order.customer?.email} • {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {userRole === 'admin' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Update Status
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Order Status</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="status">New Status</Label>
                                    <Select onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="in_production">In Production</SelectItem>
                                        <SelectItem value="quality_check">Quality Check</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="reason">Reason (Optional)</Label>
                                    <Textarea
                                      id="reason"
                                      placeholder="Enter reason for status change..."
                                      value={statusUpdateReason}
                                      onChange={(e) => setStatusUpdateReason(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">File</h4>
                          <p className="text-sm font-medium">{order.file_name}</p>
                          <p className="text-xs text-gray-500">Material: {order.material}</p>
                          <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pricing</h4>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(order.price)}</p>
                          {order.estimated_weight && (
                            <p className="text-xs text-gray-500">Weight: {order.estimated_weight}g</p>
                          )}
                          {order.estimated_print_time && (
                            <p className="text-xs text-gray-500">Print Time: {Math.round(order.estimated_print_time / 60)}h</p>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline</h4>
                          {order.estimated_delivery && (
                            <p className="text-sm font-medium">
                              Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}
                            </p>
                          )}
                          {order.shipped_at && (
                            <p className="text-xs text-gray-500">Shipped: {formatDate(order.shipped_at)}</p>
                          )}
                          {order.delivered_at && (
                            <p className="text-xs text-gray-500">Delivered: {formatDate(order.delivered_at)}</p>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</h4>
                          {order.tracking_number && (
                            <p className="text-sm font-medium font-mono">Tracking: {order.tracking_number}</p>
                          )}
                          {order.support_required && (
                            <Badge variant="outline" className="text-xs">Support Required</Badge>
                          )}
                          {order.color && (
                            <p className="text-xs text-gray-500">Color: {order.color}</p>
                          )}
                        </div>
                      </div>
                      
                      {order.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</h4>
                          <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}
                      
                      {order.order_files && order.order_files.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Files</h4>
                          <div className="flex flex-wrap gap-2">
                            {order.order_files.map((file: any) => (
                              <Button key={file.id} variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-1" />
                                {file.file_name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailView
          order={selectedOrder}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </>
  );
};

export default EnhancedOrdersTable;
