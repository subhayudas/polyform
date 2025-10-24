
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  order_number: string;
  file_name: string;
  material: string;
  material_id?: string;
  quantity: number;
  price: number | null;
  status: string;
  priority?: string;
  notes: string | null;
  estimated_delivery: string | null;
  estimated_weight?: number;
  estimated_volume?: number;
  estimated_print_time?: number;
  support_required?: boolean;
  infill_percentage?: number;
  layer_height?: number;
  color?: string;
  post_processing?: string[];
  production_notes?: string;
  shipping_address?: any;
  billing_address?: any;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancelled_reason?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Related data
  material_data?: {
    id: string;
    name: string;
    type: string;
    cost_per_gram: number;
    density: number;
    setup_cost: number;
    color_options: string[];
    properties: any;
  };
  order_files?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    file_category: string;
    created_at: string;
  }>;
  order_items?: Array<{
    id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    specifications: any;
  }>;
  customer?: {
    full_name: string;
    email: string;
    company: string;
    phone: string;
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      console.log('No user found, skipping order fetch');
      setIsLoading(false);
      return;
    }

    console.log('Fetching orders for user:', user.id, 'Role:', userRole);
    setIsLoading(true);
    setError(null);

    try {
      // Start with a simple query first
      let query = supabase
        .from('orders')
        .select('*');
      
      // If user is not admin, only show their orders
      if (userRole !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      console.log('Executing query...');
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Orders fetched successfully:', data?.length || 0, 'orders');
      
      // If we have orders, try to fetch related data
      if (data && data.length > 0) {
        console.log('Fetching related data...');
        
        // Fetch materials data
        const materialIds = data.map(order => order.material_id).filter(Boolean);
        let materialsData = {};
        if (materialIds.length > 0) {
          const { data: materials } = await supabase
            .from('materials')
            .select('*')
            .in('id', materialIds);
          
          if (materials) {
            materialsData = materials.reduce((acc, material) => {
              acc[material.id] = material;
              return acc;
            }, {});
          }
        }
        
        // Fetch profiles data
        const userIds = [...new Set(data.map(order => order.user_id))];
        let profilesData = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
          
          if (profiles) {
            profilesData = profiles.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
          }
        }
        
        // Combine the data
        const enrichedOrders = data.map(order => ({
          ...order,
          material_data: order.material_id ? materialsData[order.material_id] : null,
          customer: profilesData[order.user_id] || null,
          order_files: [], // We'll fetch these separately if needed
          order_items: [] // We'll fetch these separately if needed
        }));
        
        setOrders(enrichedOrders);
      } else {
        setOrders([]);
      }
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

  const updateOrderStatus = async (orderId: string, newStatus: string, changeReason?: string) => {
    const { data, error } = await supabase.rpc('update_order_status', {
      order_id: orderId,
      new_status: newStatus,
      changed_by: user?.id,
      change_reason: changeReason
    });

    if (error) throw error;
    
    // Refresh orders list
    fetchOrders();
    
    return data;
  };

  const getOrderById = async (orderId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        material_data:materials(*),
        order_files(*),
        order_items(*),
        customer:profiles(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  };

  const getOrderStatusHistory = async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const uploadOrderFile = async (orderId: string, file: File, category: string = 'model') => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${orderId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('order-files')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('order_files')
      .insert({
        order_id: orderId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
        file_category: category,
        uploaded_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    
    // Refresh orders list
    fetchOrders();
    
    return data;
  };

  const getMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  };

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    updateOrderStatus,
    getOrderById,
    getOrderStatusHistory,
    uploadOrderFile,
    getMaterials,
    refetch: fetchOrders
  };
};
