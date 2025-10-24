import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
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
  Download
} from 'lucide-react';

interface EnhancedOrdersTableProps {
  orders: any[];
  isLoading: boolean;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  quality_check: 'bg-orange-100 text-orange-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  on_hold: 'bg-gray-100 text-gray-800'
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusUpdateReason, setStatusUpdateReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { updateOrderStatus } = useOrders();
  const { userRole } = useAuth();

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!onStatusUpdate) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, statusUpdateReason);
      onStatusUpdate(orderId, newStatus);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock;
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-polyform-green-600"></div>
            <span className="ml-2">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">No orders have been placed yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-polyform-green-600" />
                <div>
                  <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {order.customer?.full_name || order.customer?.email} • {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(order.status)}
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
              <div>
                <h4 className="font-medium text-gray-900 mb-1">File Details</h4>
                <p className="text-sm text-gray-600">{order.file_name}</p>
                <p className="text-sm text-gray-500">Material: {order.material}</p>
                <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Pricing</h4>
                <p className="text-sm text-gray-600">${order.price?.toFixed(2) || 'TBD'}</p>
                {order.estimated_weight && (
                  <p className="text-sm text-gray-500">Weight: {order.estimated_weight}g</p>
                )}
                {order.estimated_print_time && (
                  <p className="text-sm text-gray-500">Print Time: {Math.round(order.estimated_print_time / 60)}h</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Timeline</h4>
                {order.estimated_delivery && (
                  <p className="text-sm text-gray-600">
                    Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}
                  </p>
                )}
                {order.shipped_at && (
                  <p className="text-sm text-gray-500">
                    Shipped: {formatDate(order.shipped_at)}
                  </p>
                )}
                {order.delivered_at && (
                  <p className="text-sm text-gray-500">
                    Delivered: {formatDate(order.delivered_at)}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Details</h4>
                {order.tracking_number && (
                  <p className="text-sm text-gray-600">Tracking: {order.tracking_number}</p>
                )}
                {order.support_required && (
                  <p className="text-sm text-gray-500">Support Required</p>
                )}
                {order.color && (
                  <p className="text-sm text-gray-500">Color: {order.color}</p>
                )}
              </div>
            </div>
            
            {order.notes && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
            
            {order.order_files && order.order_files.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Files</h4>
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
  );
};

export default EnhancedOrdersTable;
