import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Loader2 } from 'lucide-react';

const CreateTestOrder: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createTestOrder = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an order",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating test order for user:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          file_name: 'test-part.stl',
          material: 'PLA',
          quantity: 1,
          price: 25.00,
          notes: 'Test order created from UI',
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating test order:', error);
        throw error;
      }

      console.log('Test order created successfully:', data);
      
      toast({
        title: "Success!",
        description: "Test order created successfully. Refreshing page...",
      });

      // Reload the page to fetch the new order
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to create test order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test order",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="text-lg">Debug: Create Test Order</CardTitle>
        <CardDescription>
          If you're having trouble seeing orders, create a test order to verify the system is working.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={createTestOrder}
          disabled={isCreating}
          variant="outline"
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Test Order
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateTestOrder;

