import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  image_url: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  time_estimate: string;
  price_range: string;
  image_url: string;
  category_id: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const resolveUrl = (url: string) => url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) { console.error('Error fetching categories:', error); return []; }
  return (data || []).map((c: any) => ({ ...c, image_url: resolveUrl(c.image_url) }));
};

export const getFeaturedRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants').select('*').limit(6).order('rating', { ascending: false });
  if (error) { console.error('Error fetching restaurants:', error); return []; }
  return (data || []).map((r: any) => ({ ...r, image_url: resolveUrl(r.image_url) }));
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants').select('*').order('rating', { ascending: false });
  if (error) { console.error('Error fetching restaurants:', error); return []; }
  return (data || []).map((r: any) => ({ ...r, image_url: resolveUrl(r.image_url) }));
};

export const getMenuItems = async (restaurantId: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items').select('*').eq('restaurant_id', restaurantId).order('name');
  if (error) { console.error('Error fetching menu items:', error); return []; }
  return (data || []).map((m: any) => ({ ...m, image_url: resolveUrl(m.image_url) }));
};
