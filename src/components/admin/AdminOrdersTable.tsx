
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import { Order } from '@/hooks/useOrders';

interface AdminOrdersTableProps {
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<any>;
  isLoading: boolean;
}

const AdminOrdersTable = ({ orders, updateOrder, isLoading }: AdminOrdersTableProps) => {
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    price: '',
    estimated_delivery: '',
    notes: ''
  });

  const handleEditStart = (order: Order) => {
    setEditingOrder(order.id);
    setEditForm({
      status: order.status,
      price: order.price?.toString() || '',
      estimated_delivery: order.estimated_delivery || '',
      notes: order.notes || ''
    });
  };

  const handleEditSave = async (orderId: string) => {
    try {
      await updateOrder(orderId, {
        status: editForm.status,
        price: editForm.price ? parseFloat(editForm.price) : null,
        estimated_delivery: editForm.estimated_delivery || null,
        notes: editForm.notes || null
      });
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingOrder(null);
    setEditForm({
      status: '',
      price: '',
      estimated_delivery: '',
      notes: ''
    });
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>
          Manage all customer orders and update their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.file_name}</TableCell>
                  <TableCell>{order.material}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {editingOrder === order.id ? (
                      <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in production">In Production</SelectItem>
                          <SelectItem value="quality check">Quality Check</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingOrder === order.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        className="w-20"
                      />
                    ) : (
                      order.price ? `$${order.price.toFixed(2)}` : 'Not set'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingOrder === order.id ? (
                      <Input
                        type="date"
                        value={editForm.estimated_delivery}
                        onChange={(e) => setEditForm({...editForm, estimated_delivery: e.target.value})}
                        className="w-32"
                      />
                    ) : (
                      order.estimated_delivery || 'Not set'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingOrder === order.id ? (
                        <>
                          <Button size="sm" onClick={() => handleEditSave(order.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleEditCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEditStart(order)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrdersTable;
