import React, { useEffect, useState, useRef } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, Platform, Animated, Dimensions
} from 'react-native';
import { ArrowLeft, Star, Clock, ShoppingCart, Plus, Check, Flame } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { getMenuItems, MenuItem, Restaurant } from '../services/api';

const { width } = Dimensions.get('window');

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  RestaurantDetail: { restaurant: Restaurant };
};

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'RestaurantDetail'>;
  route: RouteProp<RootStackParamList, 'RestaurantDetail'>;
}

export default function RestaurantDetail({ navigation, route }: Props) {
  const { restaurant } = route.params;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem, itemCount, total } = useCart();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header opacity based on scroll
  const headerBg = scrollY.interpolate({
    inputRange: [160, 240],
    outputRange: ['rgba(8,8,8,0)', 'rgba(8,8,8,0.98)'],
    extrapolate: 'clamp',
  });
  const heroScale = scrollY.interpolate({
    inputRange: [-80, 0],
    outputRange: [1.15, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    getMenuItems(restaurant.id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [restaurant.id]);

  function handleAdd(item: MenuItem) {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      restaurantName: restaurant.name,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  }

  return (
    <View style={styles.container}>
      {/* Floating header (becomes visible on scroll) */}
      <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.floatingTitle} numberOfLines={1}>{restaurant.name}</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')} activeOpacity={0.8}>
          <ShoppingCart size={20} color="#FFF" />
          {itemCount > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{itemCount}</Text></View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <Animated.View style={[styles.heroWrapper, { transform: [{ scale: heroScale }] }]}>
          <Image source={{ uri: restaurant.image_url }} style={styles.heroImg} />
          <View style={styles.heroGradient} />
        </Animated.View>

        {/* Restaurant Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          {restaurant.description ? (
            <Text style={styles.restaurantDesc}>{restaurant.description}</Text>
          ) : (
            <Text style={styles.restaurantDesc}>Disfruta lo mejor de la gastronomía con entrega rápida y segura. 🚀</Text>
          )}

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.tagText}>{restaurant.rating} de 5</Text>
            </View>
            <View style={styles.tag}>
              <Clock size={14} color="rgba(255,255,255,0.6)" />
              <Text style={styles.tagText}>{restaurant.time_estimate}</Text>
            </View>
            <View style={[styles.tag, styles.tagGold]}>
              <Text style={styles.tagGoldText}>{restaurant.price_range}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerIcon}>
            <Text style={{ fontSize: 18 }}>🍽️</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>

        {/* Menu section */}
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menú del restaurante</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#FBBF24" size="large" />
            <Text style={styles.loadingText}>Cargando menú...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>👨‍🍳</Text>
            <Text style={styles.emptyTitle}>Menú en preparación</Text>
            <Text style={styles.emptyText}>Este restaurante está configurando su menú. ¡Vuelve pronto!</Text>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map((item, idx) => (
              <View key={item.id} style={[styles.menuItem, idx === 0 && styles.menuItemFeatured]}>
                {idx === 0 && (
                  <View style={styles.popularTag}>
                    <Flame size={11} color="#0A0A0A" />
                    <Text style={styles.popularTagText}>Popular</Text>
                  </View>
                )}
                <Image
                  source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                  style={styles.itemImg}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.description ? (
                    <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                  ) : null}
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>L{item.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={[styles.addBtn, addedId === item.id && styles.addBtnSuccess]}
                      onPress={() => handleAdd(item)}
                      activeOpacity={0.8}
                    >
                      {addedId === item.id
                        ? <Check size={17} color="#FFF" />
                        : <Plus size={17} color="#0A0A0A" />
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: itemCount > 0 ? 100 : 40 }} />
      </Animated.ScrollView>

      {/* Sticky cart bar */}
      {itemCount > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartBarBadge}>
              <Text style={styles.cartBarBadgeText}>{itemCount}</Text>
            </View>
            <Text style={styles.cartBarLabel}>artículos</Text>
          </View>
          <TouchableOpacity style={styles.cartBarBtn} onPress={() => navigation.navigate('Cart')} activeOpacity={0.85}>
            <Text style={styles.cartBarBtnText}>Ver carrito</Text>
            <Text style={styles.cartBarTotal}>${total.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },

  // Floating header
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'web' ? 16 : 12, paddingBottom: 12,
  },
  floatingTitle: { color: '#FFF', fontWeight: '700', fontSize: 16, flex: 1, textAlign: 'center', marginHorizontal: 10 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(8,8,8,0.7)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#FBBF24', borderRadius: 10, width: 19, height: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#0A0A0A', fontSize: 11, fontWeight: '800' },

  // Hero
  heroWrapper: { height: 300, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,8,8,0.4)',
  },

  // Info card
  infoCard: {
    marginHorizontal: 16, marginTop: -24,
    backgroundColor: '#111', borderRadius: 28,
    padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    zIndex: 10,
    // Shadow for iOS/web
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  restaurantName: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 8, letterSpacing: -0.5 },
  restaurantDesc: { fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 19, marginBottom: 14 },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tagText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  tagGold: { backgroundColor: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.25)' },
  tagGoldText: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  dividerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center',
  },

  // Menu
  menuHeader: { paddingHorizontal: 20, marginBottom: 14 },
  menuTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  itemList: { paddingHorizontal: 16, gap: 10 },
  menuItem: {
    flexDirection: 'row', gap: 0, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 22,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  menuItemFeatured: { borderColor: 'rgba(251,191,36,0.25)', borderWidth: 1.5 },
  popularTag: {
    position: 'absolute', top: 10, left: 10, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FBBF24', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  popularTagText: { color: '#0A0A0A', fontSize: 10, fontWeight: '800' },
  itemImg: { width: 95, height: 95 },
  itemInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  itemName: { fontSize: 14, fontWeight: '800', color: '#FFF', letterSpacing: -0.2 },
  itemDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 16, marginTop: 2 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  itemPrice: { fontSize: 16, fontWeight: '900', color: '#FBBF24' },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FBBF24', justifyContent: 'center', alignItems: 'center',
  },
  addBtnSuccess: { backgroundColor: '#22C55E' },

  // Sticky cart bar
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(8,8,8,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20, paddingVertical: 14, paddingBottom: Platform.OS === 'web' ? 14 : 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartBarBadge: {
    backgroundColor: '#FBBF24', width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  cartBarBadgeText: { color: '#0A0A0A', fontWeight: '900', fontSize: 13 },
  cartBarLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  cartBarBtn: {
    flex: 1, backgroundColor: '#FBBF24', borderRadius: 20, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18,
  },
  cartBarBtnText: { color: '#0A0A0A', fontWeight: '800', fontSize: 14 },
  cartBarTotal: { color: '#0A0A0A', fontWeight: '900', fontSize: 15 },

  // State screens
  loadingWrap: { alignItems: 'center', padding: 40, gap: 14 },
  loadingText: { color: 'rgba(255,255,255,0.35)', fontSize: 14 },
  emptyWrap: { alignItems: 'center', padding: 40, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 21 },
});
