
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, MessageCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  order_number: string;
  file_name: string;
  status: string;
  material: string;
  quantity: number;
  price: number | null;
  created_at: string;
  estimated_delivery: string | null;
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in production':
        return 'bg-blue-100 text-blue-800';
      case 'quality check':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-polyform-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            Track the status and progress of your 3D printing orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/upload">
              <Button className="bg-polyform-green-600 hover:bg-polyform-green-700">
                Place Your First Order
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>
          Track the status and progress of your 3D printing orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{order.file_name}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.material}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell className="font-medium">
                  {order.price ? `$${order.price.toFixed(2)}` : 'Pending Quote'}
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.estimated_delivery 
                    ? new Date(order.estimated_delivery).toLocaleDateString()
                    : 'TBD'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
