import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const TestOrderSubmission: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const testOrderSubmission = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to test order submission.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Testing order submission...');
      console.log('User ID:', user.id);

      // Test 1: Check if we can access materials table
      console.log('Testing materials table access...');
      const { data: materials, error: materialsError } = await supabase
        .from('materials')
        .select('id, name')
        .limit(1);

      if (materialsError) {
        console.error('Materials access failed:', materialsError);
        toast({
          title: "Database Error",
          description: `Cannot access materials: ${materialsError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Materials access successful:', materials);

      // Test 2: Try to create a simple order
      console.log('Testing order creation...');
      const testOrder = {
        user_id: user.id,
        file_name: 'test-file.stl',
        material: 'PLA',
        quantity: 1,
        price: 25.00,
        notes: 'Test order',
        status: 'pending'
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(testOrder)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation failed:', orderError);
        toast({
          title: "Order Creation Failed",
          description: `Failed to create order: ${orderError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Order created successfully:', orderData);

      toast({
        title: "Test Successful!",
        description: `Order #${orderData.order_number || orderData.id} created successfully. Database is working!`,
      });

    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "Test Failed",
        description: `Test failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test Order Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Click the button below to test if order submission is working properly.
        </p>
        <Button
          onClick={testOrderSubmission}
          disabled={isSubmitting}
          className="bg-polyform-green-600 hover:bg-polyform-green-700"
        >
          {isSubmitting ? 'Testing...' : 'Test Order Submission'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestOrderSubmission;




