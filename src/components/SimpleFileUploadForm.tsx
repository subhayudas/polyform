import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SimpleFileUploadFormProps {
  file: File;
  material: string;
  quantity: number;
  pricing: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const SimpleFileUploadForm: React.FC<SimpleFileUploadFormProps> = ({ 
  file, 
  material, 
  quantity, 
  pricing, 
  onSuccess, 
  onCancel 
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to submit an order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting order submission...');
      console.log('User:', user.id);
      console.log('File:', file.name);
      console.log('Material:', material);
      console.log('Quantity:', quantity);
      console.log('Pricing:', pricing);

      // First, try to get the material ID (with fallback)
      let materialId = null;
      try {
        const { data: materialData, error: materialError } = await supabase
          .from('materials')
          .select('id')
          .eq('name', material)
          .single();

        if (materialError) {
          console.warn('Material lookup failed, proceeding without material_id:', materialError);
        } else {
          materialId = materialData.id;
          console.log('Material ID found:', materialId);
        }
      } catch (error) {
        console.warn('Material lookup error, proceeding without material_id:', error);
      }

      // Upload the file to storage
      let filePath = null;
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        console.log('Uploading file to storage...');
        const { error: uploadError } = await supabase.storage
          .from('order-files')
          .upload(fileName, file);

        if (uploadError) {
          console.warn('File upload failed, proceeding without file storage:', uploadError);
        } else {
          filePath = fileName;
          console.log('File uploaded successfully:', fileName);
        }
      } catch (error) {
        console.warn('File upload error, proceeding without file storage:', error);
      }

      // Create the order with minimal required fields
      console.log('Creating order...');
      const orderData = {
        user_id: user.id,
        file_name: file.name,
        material,
        quantity,
        notes,
        price: pricing.total,
        estimated_delivery: pricing.estimatedDelivery.toISOString().split('T')[0],
        status: 'pending'
      };

      // Add material_id if we found it
      if (materialId) {
        orderData.material_id = materialId;
      }

      console.log('Order data:', orderData);

      const { data: orderData_result, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      console.log('Order created successfully:', orderData_result);

      // Try to create file record if we have a file path
      if (filePath) {
        try {
          const { error: fileRecordError } = await supabase
            .from('order_files')
            .insert({
              order_id: orderData_result.id,
              file_name: file.name,
              file_path: filePath,
              file_size: file.size,
              file_type: file.type,
              file_category: 'model',
              uploaded_by: user.id
            });

          if (fileRecordError) {
            console.warn('File record creation failed:', fileRecordError);
          } else {
            console.log('File record created successfully');
          }
        } catch (error) {
          console.warn('File record creation error:', error);
        }
      }

      // Try to create order item record
      if (materialId) {
        try {
          const { error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: orderData_result.id,
              item_name: file.name,
              material_id: materialId,
              quantity,
              unit_price: pricing.total / quantity,
              total_price: pricing.total,
              specifications: {
                estimated_weight: pricing.weight,
                estimated_volume: pricing.volume,
                estimated_print_time: pricing.estimatedTime,
                support_required: pricing.supportRequired || false,
                infill_percentage: 20,
                layer_height: 0.2
              }
            });

          if (itemError) {
            console.warn('Order item creation failed:', itemError);
          } else {
            console.log('Order item created successfully');
          }
        } catch (error) {
          console.warn('Order item creation error:', error);
        }
      }

      toast({
        title: "Order submitted successfully!",
        description: `Your order #${orderData_result.order_number || orderData_result.id} for ${quantity}x ${file.name} has been submitted with instant pricing of $${pricing.total.toFixed(2)}.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: `Failed to submit order: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Confirm Your Order</CardTitle>
        <CardDescription>
          Review your order details and add any special instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">Order Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>File:</span>
                <span className="font-medium">{file.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="font-medium">{material}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Weight:</span>
                <span className="font-medium">{pricing.weight.toFixed(0)}g</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Print Time:</span>
                <span className="font-medium">{pricing.estimatedTime.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="font-medium">
                  {pricing.estimatedDelivery.toLocaleDateString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Price:</span>
                <span className="text-polyform-green-600">${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements, color preferences, finishing instructions, or other notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Back to Pricing
            </Button>
            <Button
              type="submit"
              className="bg-polyform-green-600 hover:bg-polyform-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Order...' : `Submit Order - $${pricing.total.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleFileUploadForm;
