import React, { useEffect, useState, useRef } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, Dimensions, Platform, Animated
} from 'react-native';
import { ShoppingBag, Star, Clock, MapPin, ChevronRight, Flame, TrendingUp, Search } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { getCategories, getFeaturedRestaurants, Category, Restaurant } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - 40, 420);

interface Props {
  onRestaurantPress: (restaurant: Restaurant) => void;
}

const STATS = [
  { icon: '🏪', label: 'Restaurantes', value: '200+' },
  { icon: '⚡', label: 'Entrega', value: '30 min' },
  { icon: '⭐', label: 'Calificación', value: '4.9' },
];

export default function Home({ onRestaurantPress }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { itemCount } = useCart();
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // Pulse animation for cart badge
  useEffect(() => {
    if (itemCount > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [itemCount]);

  const filtered = activeCategory
    ? restaurants.filter(r => r.category_id === activeCategory)
    : restaurants;

  return (
    <View style={styles.container}>
      {/* Top accent line */}
      <View style={styles.accentLine} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola de nuevo! 👋</Text>
          <View style={styles.logoRow}>
            <View style={styles.iconBg}>
              <ShoppingBag size={18} color="#0A0A0A" />
            </View>
            <Text style={styles.logo}>Food<Text style={{ color: '#FBBF24' }}>Fast</Text></Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cartBtn} activeOpacity={0.8}>
          <ShoppingBag size={20} color="#FFF" />
          {itemCount > 0 && (
            <Animated.View style={[styles.badge, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTagRow}>
            <Flame size={14} color="#FBBF24" />
            <Text style={styles.heroTag}>La app #1 de comida rápida</Text>
          </View>
          <Text style={styles.heroTitle}>La comida{'\n'}que amas,</Text>
          <Text style={styles.heroSubtitle}>entregada al instante.</Text>

          {/* Search Bar */}
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
            <Search size={18} color="rgba(255,255,255,0.35)" />
            <Text style={styles.searchText}>Busca platillos, restaurantes...</Text>
            <View style={styles.searchKbd}>
              <MapPin size={13} color="#FBBF24" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoGlow} />
          <View style={styles.promoContent}>
            <View style={styles.promoTagRow}>
              <TrendingUp size={13} color="#FBBF24" />
              <Text style={styles.promoTagText}>OFERTA LIMITADA</Text>
            </View>
            <Text style={styles.promoTitle}>50% en tu{'\n'}primer pedido</Text>
            <Text style={styles.promoCode}>Código: <Text style={styles.promoCodeHighlight}>FOODFAST50</Text></Text>
            <TouchableOpacity style={styles.promoBtn} activeOpacity={0.8}>
              <Text style={styles.promoBtnText}>Ordenar Ahora →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoEmojiWrap}>
            <Text style={styles.promoEmoji}>🍔</Text>
            <Text style={[styles.promoEmoji, { fontSize: 36, opacity: 0.4, marginTop: -10 }]}>🍕</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity><Text style={styles.viewAll}>Ver todas →</Text></TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {/* "Todos" pill */}
          <TouchableOpacity
            style={[styles.allPill, !activeCategory && styles.allPillActive]}
            onPress={() => setActiveCategory(null)}
            activeOpacity={0.8}
          >
            <Text style={[styles.allPillText, !activeCategory && styles.allPillTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          {loading ? <ActivityIndicator color="#FBBF24" /> : categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: cat.image_url }} style={styles.categoryChipImg} />
              <View style={[
                styles.chipOverlay,
                activeCategory === cat.id && { backgroundColor: 'rgba(251,191,36,0.35)' }
              ]} />
              <Text style={styles.categoryChipText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory ? 'Filtrados' : '🔥 Destacados'}
          </Text>
          <Text style={styles.countBadge}>{filtered.length} lugares</Text>
        </View>

        <View style={styles.list}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#FBBF24" size="large" />
              <Text style={styles.loadingText}>Cargando restaurantes...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Sin resultados en esta categoría</Text>
            </View>
          ) : filtered.map((res, idx) => (
            <TouchableOpacity
              key={res.id}
              style={[styles.card, idx === 0 && styles.cardFeatured]}
              onPress={() => onRestaurantPress(res)}
              activeOpacity={0.88}
            >
              {/* Featured badge */}
              {idx === 0 && (
                <View style={styles.featuredBadge}>
                  <Flame size={12} color="#0A0A0A" />
                  <Text style={styles.featuredBadgeText}>Popular</Text>
                </View>
              )}

              <Image source={{ uri: res.image_url }} style={styles.cardImg} />
              <View style={styles.cardImgOverlay} />

              {/* Rating */}
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.ratingText}>{res.rating}</Text>
              </View>

              {/* Info */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{res.name}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.metaChip}>
                    <Clock size={12} color="#FBBF24" />
                    <Text style={styles.metaChipText}>{res.time_estimate}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{res.price_range}</Text>
                  </View>
                  <View style={styles.arrowCircle}>
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
  container: { flex: 1, backgroundColor: '#080808' },
  accentLine: { height: 3, backgroundColor: '#FBBF24', width: '100%' },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 18 : 10, paddingBottom: 10,
  },
  greeting: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 2 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBg: { backgroundColor: '#FBBF24', padding: 7, borderRadius: 10 },
  logo: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  cartBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.07)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: '#FBBF24', borderRadius: 11, width: 21, height: 21,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#080808',
  },
  badgeText: { color: '#0A0A0A', fontSize: 11, fontWeight: '900' },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  heroTagRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(251,191,36,0.1)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', marginBottom: 14,
  },
  heroTag: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: -1, lineHeight: 42 },
  heroSubtitle: { fontSize: 36, fontWeight: '900', color: '#FBBF24', letterSpacing: -1, lineHeight: 44 },
  searchBar: {
    marginTop: 18, backgroundColor: 'rgba(255,255,255,0.05)', padding: 14,
    borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  searchText: { color: 'rgba(255,255,255,0.3)', fontSize: 14, flex: 1 },
  searchKbd: {
    backgroundColor: 'rgba(251,191,36,0.1)', padding: 6, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },

  // Stats
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18,
    padding: 14, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },

  // Promo
  promoBanner: {
    marginHorizontal: 20, marginTop: 20, borderRadius: 28,
    backgroundColor: '#111000', borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)',
    padding: 24, flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden', position: 'relative',
  },
  promoGlow: {
    position: 'absolute', top: -30, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(251,191,36,0.08)',
  },
  promoContent: { flex: 1, gap: 6 },
  promoTagRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: 2,
  },
  promoTagText: { color: '#FBBF24', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  promoTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', lineHeight: 28 },
  promoCode: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  promoCodeHighlight: { color: '#FBBF24', fontWeight: '800' },
  promoBtn: {
    marginTop: 6, backgroundColor: '#FBBF24', paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  promoBtnText: { color: '#0A0A0A', fontWeight: '800', fontSize: 13 },
  promoEmojiWrap: { alignItems: 'center' },
  promoEmoji: { fontSize: 52 },

  // Section
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 28, marginBottom: 14,
  },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#FFF' },
  viewAll: { color: '#FBBF24', fontSize: 13, fontWeight: '700' },
  countBadge: {
    color: 'rgba(255,255,255,0.4)', fontSize: 13,
    backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 10,
  },

  // Categories
  categoriesScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 4 },
  allPill: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
  },
  allPillActive: { backgroundColor: '#FBBF24', borderColor: '#FBBF24' },
  allPillText: { color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: 13 },
  allPillTextActive: { color: '#0A0A0A' },
  categoryChip: {
    width: 86, height: 86, borderRadius: 22, overflow: 'hidden',
    justifyContent: 'flex-end', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)',
  },
  categoryChipActive: { borderColor: '#FBBF24' },
  categoryChipImg: { ...StyleSheet.absoluteFillObject },
  chipOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.52)' },
  categoryChipText: { color: '#FFF', fontSize: 11, fontWeight: '800', textAlign: 'center', padding: 8 },

  // Cards
  list: { paddingHorizontal: 20, gap: 14 },
  card: {
    borderRadius: 28, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  cardFeatured: {
    borderColor: 'rgba(251,191,36,0.3)',
    borderWidth: 1.5,
  },
  featuredBadge: {
    position: 'absolute', top: 14, left: 14, zIndex: 10,
    backgroundColor: '#FBBF24', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  featuredBadgeText: { color: '#0A0A0A', fontSize: 11, fontWeight: '800' },
  cardImg: { width: '100%', height: 200 },
  cardImgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,8,8,0.25)',
  },
  ratingBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(8,8,8,0.85)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  ratingText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  cardInfo: { padding: 18 },
  cardName: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 12, letterSpacing: -0.3 },
  cardMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12,
  },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 12,
  },
  metaChipText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  arrowCircle: {
    marginLeft: 'auto', width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(251,191,36,0.12)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },

  // States
  loadingWrap: { alignItems: 'center', padding: 40, gap: 14 },
  loadingText: { color: 'rgba(255,255,255,0.35)', fontSize: 14 },
  emptyWrap: { alignItems: 'center', padding: 40, gap: 10 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontStyle: 'italic' },
});
