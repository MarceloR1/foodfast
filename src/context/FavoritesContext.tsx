import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (restaurantId: string) => Promise<void>;
  isFavorite: (restaurantId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('restaurant_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setFavorites(data.map(f => f.restaurant_id));
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const toggleFavorite = async (restaurantId: string) => {
    if (!user) return;

    const isFav = favorites.includes(restaurantId);
    
    // Optimistic update
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== restaurantId));
    } else {
      setFavorites(prev => [...prev, restaurantId]);
    }

    try {
      if (isFav) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, restaurant_id: restaurantId });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert on error
      loadFavorites();
    }
  };

  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
