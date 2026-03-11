import React, { useEffect, useState, useRef } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, Dimensions, Platform, Animated
} from 'react-native';
import { ShoppingBag, Star, Clock, Flame, TrendingUp, Zap } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { getCategories, getFeaturedRestaurants, Category, Restaurant } from '../services/api';

const { width } = Dimensions.get('window');
const FEAT_CARD_W = Math.min(width * 0.72, 280);

interface Props {
  onRestaurantPress: (restaurant: Restaurant) => void;
  onCartPress: () => void;
}

const QUICK_ACTIONS = [
  { emoji: '⚡', label: 'Rápido', sub: '<20 min' },
  { emoji: '🆕', label: 'Nuevo', sub: 'Esta semana' },
  { emoji: '🔥', label: 'Popular', sub: 'Top rated' },
  { emoji: '💸', label: 'Ofertas', sub: 'Descuentos' },
];

export default function Home({ onRestaurantPress, onCartPress }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { itemCount } = useCart();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function load() {
      try {
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
          setLoading(false);
          return;
        }
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

  useEffect(() => {
    if (itemCount > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 140, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]).start();
    }
  }, [itemCount]);

  const filtered = activeCategory
    ? restaurants.filter(r => r.category_id === activeCategory)
    : restaurants;

  // Header animates on scroll
  const headerBg = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: ['rgba(8,8,8,0)', 'rgba(8,8,8,1)'],
    extrapolate: 'clamp',
  });

  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Text style={{ fontSize: 50, marginBottom: 20 }}>⚠️</Text>
        <Text style={{ color: '#EF4444', fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 10 }}>Faltan Variables de Entorno</Text>
        <Text style={{ color: '#FFF', fontSize: 14, textAlign: 'center', opacity: 0.7, lineHeight: 22 }}>
          La app no puede conectar con Supabase. En Netlify, debes agregar estas variables:
        </Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, marginTop: 20, width: '100%' }}>
          <Text style={{ color: '#FBBF24', fontSize: 12, fontWeight: '800' }}>EXPO_PUBLIC_SUPABASE_URL</Text>
          <Text style={{ color: '#FBBF24', fontSize: 12, fontWeight: '800', marginTop: 10 }}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky top accent */}
      <View style={styles.accentLine} />

      {/* Floating Header */}
      <Animated.View style={[styles.header, { backgroundColor: headerBg }]} pointerEvents="box-none">
        <View style={styles.headerLeft}>
          <View style={styles.iconBg}><ShoppingBag size={17} color="#080808" /></View>
          <View>
            <Text style={styles.logoText}>Food<Text style={{ color: '#FBBF24' }}>Fast</Text></Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>📍 Tegucigalpa, HN</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={onCartPress} activeOpacity={0.8}>
          <ShoppingBag size={20} color="#FFF" />
          {itemCount > 0 && (
            <Animated.View style={[styles.badge, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={{ height: Platform.OS === 'web' ? 60 : 52 }} />
          <View style={styles.heroBadge}>
            <Zap size={12} color="#FBBF24" />
            <Text style={styles.heroBadgeText}>Entrega en 30 minutos o menos</Text>
          </View>
          <Text style={styles.heroTitle}>La comida{'\n'}que amas,</Text>
          <Text style={styles.heroAccent}>entregada{'\n'}al instante.</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={styles.quickCard} activeOpacity={0.8}>
              <Text style={styles.quickEmoji}>{a.emoji}</Text>
              <Text style={styles.quickLabel}>{a.label}</Text>
              <Text style={styles.quickSub}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured horizontal carousel */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Flame size={16} color="#FBBF24" />
            <Text style={styles.sectionTitle}>Destacados</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featScroll}
          snapToInterval={FEAT_CARD_W + 14}
          decelerationRate="fast"
        >
          {loading ? (
            <ActivityIndicator color="#FBBF24" />
          ) : restaurants.slice(0, 5).map((res, idx) => (
            <TouchableOpacity
              key={res.id}
              style={[styles.featCard, { width: FEAT_CARD_W }]}
              onPress={() => onRestaurantPress(res)}
              activeOpacity={0.88}
            >
              <Image source={{ uri: res.image_url }} style={styles.featImg} />
              <View style={styles.featOverlay} />
              <View style={styles.featRating}>
                <Star size={11} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.featRatingText}>{res.rating}</Text>
              </View>
              <View style={styles.featInfo}>
                <Text style={styles.featName} numberOfLines={1}>{res.name}</Text>
                <View style={styles.featMeta}>
                  <Clock size={11} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.featMetaText}>{res.time_estimate}</Text>
                  <View style={styles.featDot} />
                  <Text style={styles.featPrice}>{res.price_range}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <TrendingUp size={12} color="#FBBF24" />
              <Text style={styles.promoBadgeText}>OFERTA ESPECIAL</Text>
            </View>
            <Text style={styles.promoTitle}>50% OFF en{'\n'}tu primer pedido</Text>
            <Text style={styles.promoCode}>
              Código: <Text style={styles.promoCodeBold}>FOODFAST50</Text>
            </Text>
            <TouchableOpacity style={styles.promoBtn} activeOpacity={0.8}>
              <Text style={styles.promoBtnText}>Ordenar ahora →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoRight}>
            <Text style={{ fontSize: 56 }}>🍔</Text>
            <Text style={{ fontSize: 36, opacity: 0.45, marginTop: -8 }}>🍕</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity><Text style={styles.viewAll}>Ver todas →</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          <TouchableOpacity
            style={[styles.catChip, !activeCategory && styles.catChipActive]}
            onPress={() => setActiveCategory(null)}
            activeOpacity={0.8}
          >
            <Text style={[styles.catChipText, !activeCategory && styles.catChipTextActive]}>Todos</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catCard, activeCategory === cat.id && styles.catCardActive]}
              onPress={() => setActiveCategory(p => p === cat.id ? null : cat.id)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: cat.image_url }} style={styles.catImg} />
              <View style={[styles.catOverlay, activeCategory === cat.id && { backgroundColor: 'rgba(251,191,36,0.4)' }]} />
              <Text style={styles.catText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{activeCategory ? 'Resultados' : '🍽️ Restaurantes'}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{filtered.length}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#FBBF24" size="large" />
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={styles.emptyText}>Sin resultados</Text>
            </View>
          ) : filtered.map((res, idx) => (
            <TouchableOpacity
              key={res.id}
              style={[styles.card, idx === 0 && styles.cardFeatured]}
              onPress={() => onRestaurantPress(res)}
              activeOpacity={0.88}
            >
              {idx === 0 && (
                <View style={styles.popularBadge}>
                  <Flame size={11} color="#080808" />
                  <Text style={styles.popularBadgeText}>Popular</Text>
                </View>
              )}
              <Image source={{ uri: res.image_url }} style={styles.cardImg} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardRating}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.cardRatingText}>{res.rating}</Text>
              </View>
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
                  <View style={{ flex: 1 }} />
                  <View style={styles.goCircle}>
                    <Text style={{ fontSize: 13 }}>→</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  accentLine: { height: 3, backgroundColor: '#FBBF24' },

  // Header
  header: {
    position: 'absolute', top: 3, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBg: { backgroundColor: '#FBBF24', padding: 7, borderRadius: 10 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 0 },
  locationText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  cartBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: '#FBBF24', borderRadius: 11, width: 21, height: 21,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#080808',
  },
  badgeText: { color: '#080808', fontSize: 11, fontWeight: '900' },

  // Hero
  hero: { paddingHorizontal: 20, paddingBottom: 10 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', marginBottom: 16,
    backgroundColor: 'rgba(251,191,36,0.1)', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },
  heroBadgeText: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 38, fontWeight: '900', color: '#FFF', letterSpacing: -1.5, lineHeight: 44 },
  heroAccent: { fontSize: 38, fontWeight: '900', color: '#FBBF24', letterSpacing: -1.5, lineHeight: 44 },

  // Quick actions
  quickRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginTop: 20, marginBottom: 4 },
  quickCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 12,
    alignItems: 'center', gap: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  quickSub: { fontSize: 10, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },

  // Section header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 26, marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#FFF' },
  viewAll: { color: '#FBBF24', fontSize: 13, fontWeight: '700' },
  countPill: {
    backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 12,
  },
  countText: { color: '#FBBF24', fontSize: 12, fontWeight: '800' },

  // Featured carousel
  featScroll: { paddingHorizontal: 20, gap: 14 },
  featCard: { borderRadius: 24, height: 200, overflow: 'hidden', position: 'relative' },
  featImg: { width: '100%', height: '100%' },
  featOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,8,8,0.42)',
  },
  featRating: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(8,8,8,0.82)', paddingHorizontal: 8, paddingVertical: 5,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  featRatingText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  featInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 },
  featName: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 5, letterSpacing: -0.3 },
  featMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featMetaText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  featDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  featPrice: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },

  // Promo
  promoBanner: {
    marginHorizontal: 16, marginTop: 20, borderRadius: 28, overflow: 'hidden',
    backgroundColor: '#0F0A00', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
    padding: 22, flexDirection: 'row', alignItems: 'center',
  },
  promoContent: { flex: 1, gap: 7 },
  promoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(251,191,36,0.1)', paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },
  promoBadgeText: { color: '#FBBF24', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  promoTitle: { fontSize: 21, fontWeight: '900', color: '#FFF', lineHeight: 26, letterSpacing: -0.5 },
  promoCode: { color: 'rgba(255,255,255,0.45)', fontSize: 12 },
  promoCodeBold: { color: '#FBBF24', fontWeight: '800' },
  promoBtn: {
    backgroundColor: '#FBBF24', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 18, alignSelf: 'flex-start',
  },
  promoBtnText: { color: '#080808', fontWeight: '800', fontSize: 13 },
  promoRight: { alignItems: 'center', paddingLeft: 10 },

  // Categories
  catScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  catChip: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', justifyContent: 'center',
  },
  catChipActive: { backgroundColor: '#FBBF24', borderColor: '#FBBF24' },
  catChipText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  catChipTextActive: { color: '#080808' },
  catCard: {
    width: 84, height: 84, borderRadius: 20, overflow: 'hidden',
    justifyContent: 'flex-end', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)',
  },
  catCardActive: { borderColor: '#FBBF24' },
  catImg: { ...StyleSheet.absoluteFillObject },
  catOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.52)' },
  catText: { color: '#FFF', fontSize: 11, fontWeight: '800', textAlign: 'center', paddingBottom: 8, paddingHorizontal: 4 },

  // Cards
  list: { paddingHorizontal: 16, gap: 12 },
  card: {
    borderRadius: 28, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  cardFeatured: { borderColor: 'rgba(251,191,36,0.3)', borderWidth: 1.5 },
  popularBadge: {
    position: 'absolute', top: 13, left: 13, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FBBF24', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 18,
  },
  popularBadgeText: { color: '#080808', fontSize: 11, fontWeight: '800' },
  cardImg: { width: '100%', height: 195 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,8,8,0.22)' },
  cardRating: {
    position: 'absolute', top: 13, right: 13,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(8,8,8,0.88)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  cardRatingText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  cardInfo: { padding: 16 },
  cardName: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 10, letterSpacing: -0.3 },
  cardMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 11,
  },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  metaChipText: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '600' },
  goCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(251,191,36,0.12)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },

  loadingBox: { padding: 40, alignItems: 'center' },
  emptyBox: { padding: 40, alignItems: 'center', gap: 10 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontStyle: 'italic' },
});
