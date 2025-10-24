
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  order_number: string;
  file_name: string;
  material: string;
  quantity: number;
  price: number | null;
  status: string;
  notes: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('orders').select('*');
      
      // If user is not admin, only show their orders
      if (userRole !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, userRole]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    
    // Refresh orders list
    fetchOrders();
    
    return data;
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    
    // Refresh orders list
    fetchOrders();
    
    return data;
  };

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    refetch: fetchOrders
  };
};
