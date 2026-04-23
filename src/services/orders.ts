import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  total_amount: number;
  status: 'pending' | 'preparing' | 'delivery' | 'delivered' | 'cancelled';
  delivery_address?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  name: string;
}

export const createOrder = async (userId: string, restaurantId: string, total: number, items: any[], address?: string) => {
  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId,
      total_amount: total,
      status: 'pending',
      delivery_address: address || 'Tegucigalpa, HN',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    menu_item_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price,
    name: item.name,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (name, image_url),
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
