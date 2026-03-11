import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, Dimensions, Platform
} from 'react-native';
import { ShoppingBag, Star, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { getCategories, getFeaturedRestaurants, Category, Restaurant } from '../services/api';

const { width } = Dimensions.get('window');

interface Props {
  onRestaurantPress: (restaurant: Restaurant) => void;
}

export default function Home({ onRestaurantPress }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const [cats, rests] = await Promise.all([
          getCategories().catch(() => []),
          getFeaturedRestaurants().catch(() => []),
        ]);
        setCategories(cats);
        setRestaurants(rests);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = activeCategory
    ? restaurants.filter(r => r.category_id === activeCategory)
    : restaurants;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Buen provecho! 👋</Text>
          <View style={styles.logoRow}>
            <View style={styles.iconBg}><ShoppingBag size={20} color="#0F0F0F" /></View>
            <Text style={styles.logo}>Food<Text style={{ color: '#FBBF24' }}>Fast</Text></Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cartBtn} activeOpacity={0.8}>
          <ShoppingBag size={22} color="#FFF" />
          {itemCount > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{itemCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>La comida que amas,</Text>
          <Text style={styles.heroSubtitle}>entregada al instante.</Text>
          <View style={styles.searchBar}>
            <MapPin size={18} color="rgba(255,255,255,0.4)" />
            <Text style={styles.searchText}>Busca restaurantes o platillos...</Text>
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTag}>🔥 OFERTA DEL DÍA</Text>
            <Text style={styles.promoTitle}>50% en tu primer pedido</Text>
            <Text style={styles.promoSub}>Usa el código FOODFAST50</Text>
            <TouchableOpacity style={styles.promoBtn} activeOpacity={0.8}>
              <Text style={styles.promoBtnText}>Ordenar Ahora</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoEmoji}>🍔</Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <Text style={styles.viewAll}>Ver todas</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {loading ? <ActivityIndicator color="#FBBF24" /> : categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: cat.image_url }} style={styles.categoryChipImg} />
              <View style={styles.chipOverlay} />
              <Text style={styles.categoryChipText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory ? 'Restaurantes filtrados' : 'Destacados'}
          </Text>
        </View>

        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator color="#FBBF24" size="large" style={{ padding: 40 }} />
          ) : filtered.length === 0 ? (
            <Text style={styles.emptyText}>No hay restaurantes disponibles.</Text>
          ) : filtered.map(res => (
            <TouchableOpacity
              key={res.id}
              style={styles.card}
              onPress={() => onRestaurantPress(res)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: res.image_url }} style={styles.cardImg} />
              {/* Gradient overlay */}
              <View style={styles.cardGradient} />
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.ratingText}>{res.rating}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{res.name}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={13} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.metaText}>{res.time_estimate}</Text>
                  </View>
                  <Text style={styles.priceTag}>{res.price_range}</Text>
                  <View style={styles.detailArrow}>
                    <ChevronRight size={16} color="#FBBF24" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 10, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  greeting: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 4 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBg: { backgroundColor: '#FBBF24', padding: 6, borderRadius: 8 },
  logo: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  cartBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#FBBF24', borderRadius: 10, width: 19, height: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#0A0A0A', fontSize: 11, fontWeight: '800' },
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#FFF', lineHeight: 36 },
  heroSubtitle: { fontSize: 30, fontWeight: '800', color: '#FBBF24', lineHeight: 36 },
  searchBar: {
    marginTop: 16, backgroundColor: 'rgba(255,255,255,0.05)', padding: 14,
    borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  searchText: { color: 'rgba(255,255,255,0.35)', fontSize: 14 },
  promoBanner: {
    marginHorizontal: 20, marginTop: 20, borderRadius: 24,
    backgroundColor: '#1A1200', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
    padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoContent: { flex: 1 },
  promoTag: { fontSize: 11, fontWeight: '700', color: '#FBBF24', marginBottom: 6, letterSpacing: 1 },
  promoTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  promoSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 14 },
  promoBtn: {
    backgroundColor: '#FBBF24', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  promoBtnText: { color: '#0A0A0A', fontWeight: '700', fontSize: 13 },
  promoEmoji: { fontSize: 60, marginLeft: 10 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 28, marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  viewAll: { color: '#FBBF24', fontSize: 13, fontWeight: '600' },
  categoriesScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  categoryChip: {
    width: 90, height: 90, borderRadius: 20, overflow: 'hidden',
    justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryChipActive: { borderColor: '#FBBF24', borderWidth: 2 },
  categoryChipImg: { ...StyleSheet.absoluteFillObject },
  chipOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  categoryChipText: { color: '#FFF', fontSize: 12, fontWeight: '700', textAlign: 'center', padding: 8 },
  list: { paddingHorizontal: 20, gap: 16, paddingBottom: 48 },
  card: {
    borderRadius: 28, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  cardImg: { width: '100%', height: 190 },
  cardGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
    backgroundColor: 'rgba(10,10,10,0.3)',
  },
  ratingBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(10,10,10,0.85)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  ratingText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  cardInfo: { padding: 18 },
  cardName: { fontSize: 17, fontWeight: '700', color: '#FFF', marginBottom: 10 },
  cardMeta: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12, gap: 10,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  metaText: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  priceTag: { color: '#FBBF24', fontWeight: '700', fontSize: 13 },
  detailArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(251,191,36,0.1)', justifyContent: 'center', alignItems: 'center',
  },
  emptyText: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 40, fontStyle: 'italic' },
});
