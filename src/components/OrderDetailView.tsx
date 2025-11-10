import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  FileText, 
  Download, 
  MapPin, 
  Truck, 
  CreditCard,
  User,
  Box,
  Settings,
  Calendar,
  Info
} from 'lucide-react';
import { useOrders, Order } from '@/hooks/useOrders';
import OrderTimeline from './OrderTimeline';
import { cn } from '@/lib/utils';

interface OrderDetailViewProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
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

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ 
  order, 
  isOpen, 
  onClose,
  onStatusUpdate 
}) => {
  const { getOrderById, getOrderStatusHistory } = useOrders();
  const [fullOrder, setFullOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      setIsLoading(true);
      getOrderById(order.id)
        .then((data) => {
          setFullOrder(data as Order);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
          setFullOrder(order);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [order?.id, isOpen]);

  const displayOrder = fullOrder || order;

  if (!displayOrder) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'TBD';
    return `$${amount.toFixed(2)}`;
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      // This would need to be implemented based on your storage setup
      console.log('Download file:', filePath, fileName);
      // You can use supabase.storage.from('bucket').download(filePath)
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Order #{displayOrder.order_number}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Created on {formatDate(displayOrder.created_at)}
              </p>
            </div>
            <Badge className={cn(
              "px-3 py-1 text-sm font-medium border",
              statusColors[displayOrder.status as keyof typeof statusColors] || statusColors.pending
            )}>
              {displayOrder.status?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">File Name:</span>
                        <span className="text-sm font-medium">{displayOrder.file_name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Material:</span>
                        <span className="text-sm font-medium">{displayOrder.material}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="text-sm font-medium">{displayOrder.quantity}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="text-sm font-bold text-lg">{formatCurrency(displayOrder.price)}</span>
                      </div>
                      {displayOrder.priority && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Priority:</span>
                            <Badge variant="outline">{displayOrder.priority}</Badge>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created:</span>
                        <span className="text-sm font-medium">{formatDate(displayOrder.created_at)}</span>
                      </div>
                      <Separator />
                      {displayOrder.estimated_delivery && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Estimated Delivery:</span>
                            <span className="text-sm font-medium">{formatDate(displayOrder.estimated_delivery)}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.shipped_at && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Shipped:</span>
                            <span className="text-sm font-medium">{formatDate(displayOrder.shipped_at)}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.delivered_at && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Delivered:</span>
                            <span className="text-sm font-medium">{formatDate(displayOrder.delivered_at)}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.tracking_number && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tracking:</span>
                            <Badge variant="outline" className="font-mono">
                              {displayOrder.tracking_number}
                            </Badge>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {displayOrder.notes && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{displayOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="details" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {displayOrder.material_data && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Material Type:</span>
                            <span className="text-sm font-medium">{displayOrder.material_data.type}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.color && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Color:</span>
                            <span className="text-sm font-medium">{displayOrder.color}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.estimated_weight && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Estimated Weight:</span>
                            <span className="text-sm font-medium">{displayOrder.estimated_weight}g</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.estimated_volume && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Estimated Volume:</span>
                            <span className="text-sm font-medium">{displayOrder.estimated_volume} cm³</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.estimated_print_time && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Print Time:</span>
                            <span className="text-sm font-medium">{Math.round(displayOrder.estimated_print_time / 60)}h</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.infill_percentage && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Infill:</span>
                            <span className="text-sm font-medium">{displayOrder.infill_percentage}%</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {displayOrder.layer_height && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Layer Height:</span>
                            <span className="text-sm font-medium">{displayOrder.layer_height}mm</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {(displayOrder.shipping_address || displayOrder.billing_address) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Addresses
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {displayOrder.shipping_address && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Truck className="w-3 h-3" />
                              Shipping Address
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {typeof displayOrder.shipping_address === 'object' ? (
                                Object.entries(displayOrder.shipping_address).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))
                              ) : (
                                <p>{String(displayOrder.shipping_address)}</p>
                              )}
                            </div>
                          </div>
                        )}
                        {displayOrder.billing_address && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <CreditCard className="w-3 h-3" />
                                Billing Address
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                {typeof displayOrder.billing_address === 'object' ? (
                                  Object.entries(displayOrder.billing_address).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="capitalize">{key.replace('_', ' ')}:</span>
                                      <span>{String(value)}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p>{String(displayOrder.billing_address)}</p>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {displayOrder.customer && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium">{displayOrder.customer.full_name || 'N/A'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium">{displayOrder.customer.email}</span>
                      </div>
                      {displayOrder.customer.company && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Company:</span>
                            <span className="text-sm font-medium">{displayOrder.customer.company}</span>
                          </div>
                        </>
                      )}
                      {displayOrder.customer.phone && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Phone:</span>
                            <span className="text-sm font-medium">{displayOrder.customer.phone}</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="files" className="mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Order Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {displayOrder.order_files && displayOrder.order_files.length > 0 ? (
                      <div className="space-y-2">
                        {displayOrder.order_files.map((file: any) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">{file.file_name}</p>
                                <p className="text-xs text-gray-500">
                                  {file.file_category} • {(file.file_size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(file.file_path, file.file_name)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No files available for this order
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <OrderTimeline orderId={displayOrder.id} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailView;




