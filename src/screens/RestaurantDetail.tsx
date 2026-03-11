import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, Platform
} from 'react-native';
import { ArrowLeft, Star, Clock, ShoppingBag, Plus, Minus, Check } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { getMenuItems, MenuItem, Restaurant } from '../services/api';

interface Props {
  restaurant: Restaurant;
  onBack: () => void;
  onCartPress: () => void;
}

export default function RestaurantDetail({ restaurant, onBack, onCartPress }: Props) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem, itemCount } = useCart();

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
    setTimeout(() => setAddedId(null), 1200);
  }

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={styles.heroWrapper}>
        <Image source={{ uri: restaurant.image_url }} style={styles.heroImg} />
        <View style={styles.heroOverlay} />

        {/* Back + Cart floating buttons */}
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.8}>
            <ArrowLeft size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onCartPress} activeOpacity={0.8}>
            <ShoppingBag size={20} color="#FFF" />
            {itemCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{itemCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        {/* Info on hero */}
        <View style={styles.heroInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Star size={13} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.tagText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.tag}>
              <Clock size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.tagText}>{restaurant.time_estimate}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceTagText}>{restaurant.price_range}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu */}
      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>🍽️ Menú</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#FBBF24" size="large" style={{ padding: 40 }} />
        ) : items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Menú en preparación</Text>
            <Text style={styles.emptyText}>Este restaurante está configurando su menú. ¡Vuelve pronto!</Text>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map(item => (
              <View key={item.id} style={styles.menuItem}>
                <Image source={{ uri: item.image_url }} style={styles.itemImg} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.description ? (
                    <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                  ) : null}
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={[styles.addBtn, addedId === item.id && styles.addBtnDone]}
                      onPress={() => handleAdd(item)}
                      activeOpacity={0.8}
                    >
                      {addedId === item.id
                        ? <Check size={18} color="#0A0A0A" />
                        : <Plus size={18} color="#0A0A0A" />
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  heroWrapper: { height: 280, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.55)',
  },
  headerBtns: {
    position: 'absolute', top: Platform.OS === 'web' ? 20 : 14,
    left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between',
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(10,10,10,0.7)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#FBBF24', borderRadius: 10, width: 19, height: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#0A0A0A', fontSize: 11, fontWeight: '800' },
  heroInfo: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  restaurantName: { fontSize: 26, fontWeight: '800', color: '#FFF', marginBottom: 10 },
  tags: { flexDirection: 'row', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(10,10,10,0.75)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  tagText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  priceTag: {
    backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)',
  },
  priceTagText: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },
  menuScroll: { flex: 1 },
  menuHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  menuTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  itemList: { paddingHorizontal: 16, gap: 12 },
  menuItem: {
    flexDirection: 'row', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  itemImg: { width: 90, height: 90 },
  itemInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  itemName: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  itemDesc: { fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 17 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#FBBF24' },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FBBF24', justifyContent: 'center', alignItems: 'center',
  },
  addBtnDone: { backgroundColor: '#22C55E' },
  emptyWrap: { alignItems: 'center', padding: 40, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
});
