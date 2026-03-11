import { supabase } from '@/lib/supabase';

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
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
  return data || [];
};

export const getFeaturedRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .limit(3)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching featured restaurants:', error);
    return [];
  }
  return data || [];
};
