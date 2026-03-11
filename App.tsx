import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native';
import { getCategories, getFeaturedRestaurants, Category, Restaurant } from './src/services/api';

const { width } = Dimensions.get('window');

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('App: Mounted');
    
    async function loadData() {
      console.log('App: Starting loadData...');
      try {
        const [cats, rests] = await Promise.all([
          getCategories().catch(e => { console.error('Cats fail:', e); return []; }),
          getFeaturedRestaurants().catch(e => { console.error('Rests fail:', e); return []; })
        ]);
        
        setCategories(cats || []);
        setRestaurants(rests || []);
        
        if (!cats?.length && !rests?.length) {
           console.warn('App: No data returned from Supabase');
        }
      } catch (err: any) {
        console.error('App: Load Error:', err);
        setError(err.message || 'Error de conexión con la base de datos');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!mounted) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Aliveness Signal */}
      <View style={{ height: 2, backgroundColor: '#FBBF24', width: '100%' }} />
      <Text style={{color: '#FBBF24', fontSize: 10, textAlign: 'center', marginTop: 10, fontWeight: 'bold'}}>
        FOODFAST LIVE • {loading ? 'CONECTANDO...' : 'SISTEMA ONLINE'}
      </Text>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.iconBg}>
            <Text style={{fontSize: 16}}>🛍️</Text>
          </View>
          <Text style={styles.logoText}>Food<Text style={{color: '#FBBF24'}}>Fast</Text></Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
           <Text style={{fontSize: 20}}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>La comida que amas,</Text>
          <Text style={styles.heroSubtitle}>entregada al instante.</Text>
          <View style={styles.searchBar}>
            <Text>📍</Text>
            <Text style={styles.searchText}>Introduce tu dirección...</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Text style={{color: '#FFF', fontSize: 10, marginTop: 5, textAlign: 'center'}}>Verifica tu conexión y las variables de Supabase.</Text>
          </View>
        )}

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías Populares</Text>
          <Text style={styles.viewAll}>Ver todas</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {loading ? (
             <ActivityIndicator color="#FBBF24" />
          ) : categories.length > 0 ? (
            categories.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                <Image 
                  source={{ uri: (cat.image_url || '').startsWith('/') ? `https://gfrqsrwxhbmntnshrkyf.supabase.co/storage/v1/object/public/images${cat.image_url}` : (cat.image_url || 'https://via.placeholder.com/150') }} 
                  style={styles.categoryImage} 
                />
                <View style={styles.categoryOverlay} />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))
          ) : !loading && (
            <Text style={styles.emptyText}>No hay categorías disponibles.</Text>
          )}
        </ScrollView>

        {/* Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Restaurantes Destacados</Text>
        </View>

        <View style={styles.restaurantsContainer}>
          {loading ? (
            <ActivityIndicator color="#FBBF24" size="large" />
          ) : restaurants.length > 0 ? (
            restaurants.map(res => (
              <TouchableOpacity key={res.id} style={styles.restaurantCard}>
                <Image 
                  source={{ uri: (res.image_url || '').startsWith('/') ? `https://gfrqsrwxhbmntnshrkyf.supabase.co/storage/v1/object/public/images${res.image_url}` : (res.image_url || 'https://via.placeholder.com/300') }} 
                  style={styles.restaurantImage} 
                />
                <View style={styles.ratingBadge}>
                  <Text style={{fontSize: 12}}>⭐</Text>
                  <Text style={styles.ratingText}>{res.rating}</Text>
                </View>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{res.name}</Text>
                  <View style={styles.restaurantMeta}>
                    <View style={styles.metaItem}>
                      <Text>🕒</Text>
                      <Text style={styles.metaText}>{res.time_estimate}</Text>
                    </View>
                    <Text style={styles.priceRange}>{res.price_range}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : !loading && (
            <Text style={styles.emptyText}>No hay restaurantes disponibles.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    backgroundColor: '#FBBF24',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cartButton: {
    padding: 8,
  },
  hero: {
    padding: 20,
    marginTop: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  heroSubtitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FBBF24',
  },
  searchBar: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchText: {
    color: 'rgba(255,255,255,0.4)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  viewAll: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesScroll: {
    paddingLeft: 20,
    gap: 15,
  },
  categoryCard: {
    width: 120,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryImage: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 40,
  },
  restaurantCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
  },
  ratingBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(15,15,15,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ratingText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  restaurantInfo: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  priceRange: {
    color: '#FBBF24',
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
    fontStyle: 'italic',
  }
});
