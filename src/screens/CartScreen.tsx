import React, { useState } from 'react';
import {
  View, ScrollView, Image, TouchableOpacity, Text, StyleSheet,
  Platform, Animated
} from 'react-native';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CheckCircle, Zap } from 'lucide-react-native';
import { useCart } from '../context/CartContext';

import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Cart'>;
}

const DELIVERY_FEE = 65;
const FREE_DELIVERY_THRESHOLD = 450;

import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orders';

export default function CartScreen({ navigation }: Props) {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const [ordered, setOrdered] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = total + deliveryFee;

  async function handleOrder() {
    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido');
      return;
    }

    if (items.length === 0) return;

    setIsOrdering(true);
    try {
      // Find restaurantId (assuming all items are from the same restaurant for now)
      // For a real app, you'd handle multiple restaurants or force one at a time
      const restaurantId = (items[0] as any).restaurant_id || '9ce988e4-8a12-4f2b-8a9d-547e7d6b8c9d'; // Fallback for safety

      await createOrder(user.id, restaurantId, grandTotal, items);
      
      setOrdered(true);
      setTimeout(() => {
        clearCart();
        setOrdered(false);
        navigation.navigate('Home');
      }, 3000);
    } catch (err: any) {
      alert('Error al procesar el pedido: ' + err.message);
    } finally {
      setIsOrdering(false);
    }
  }

  if (ordered) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successGlow} />
        <CheckCircle size={90} color="#22C55E" />
        <Text style={styles.successTitle}>¡Pedido confirmado!</Text>
        <Text style={styles.successSub}>Tu comida está en camino 🛵</Text>
        <View style={styles.etaCard}>
          <Zap size={18} color="#FBBF24" />
          <Text style={styles.etaText}>Tiempo estimado: <Text style={{ color: '#FBBF24', fontWeight: '800' }}>25–35 min</Text></Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Mi Carrito</Text>
          <Text style={styles.subtitle}>{itemCount} artículos</Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySub}>¡Agrega platillos desde los restaurantes!</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
            <ShoppingBag size={18} color="#0A0A0A" />
            <Text style={styles.exploreBtnText}>Explorar restaurantes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Free delivery progress bar */}
          {total < FREE_DELIVERY_THRESHOLD && (
            <View style={styles.promoBar}>
              <Text style={styles.promoBarText}>
                Agrega <Text style={{ color: '#FBBF24', fontWeight: '800' }}>
                  L{((FREE_DELIVERY_THRESHOLD - total)).toFixed(2)}
                </Text> más para envío gratis 🎉
              </Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` as any }]} />
              </View>
            </View>
          )}
          {total >= FREE_DELIVERY_THRESHOLD && (
            <View style={[styles.promoBar, { borderColor: 'rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.06)' }]}>
              <Text style={[styles.promoBarText, { color: '#22C55E' }]}>✅ ¡Envío gratis desbloqueado!</Text>
            </View>
          )}

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {/* Group by restaurant */}
            {items.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image_url }} style={styles.itemImg} />
                <View style={styles.itemBody}>
                  <Text style={styles.itemRest} numberOfLines={1}>{item.restaurantName}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>L{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={[styles.qtyBtn, item.quantity === 1 && styles.qtyBtnDelete]}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    activeOpacity={0.8}
                  >
                    {item.quantity === 1
                      ? <Trash2 size={14} color="#EF4444" />
                      : <Minus size={14} color="#FFF" />
                    }
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={[styles.qtyBtn, styles.qtyBtnPlus]}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    activeOpacity={0.8}
                  >
                    <Plus size={14} color="#0A0A0A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Order Summary + Checkout */}
          <View style={styles.footer}>
            {/* Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>L{total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío</Text>
                {deliveryFee === 0
                  ? <Text style={[styles.summaryValue, { color: '#22C55E' }]}>Gratis</Text>
                  : <Text style={styles.summaryValue}>L{deliveryFee.toFixed(2)}</Text>
                }
              </View>
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>L{grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.orderBtn, isOrdering && { opacity: 0.7 }]} 
              onPress={handleOrder} 
              disabled={isOrdering}
              activeOpacity={0.85}
            >
              {isOrdering ? (
                <ActivityIndicator color="#0A0A0A" style={{ flex: 1 }} />
              ) : (
                <>
                  <Zap size={20} color="#0A0A0A" />
                  <Text style={styles.orderBtnText}>Confirmar Pedido</Text>
                  <Text style={styles.orderBtnTotal}>L{grandTotal.toFixed(2)}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 14, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 1 },
  clearBtn: {
    marginLeft: 'auto', width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(239,68,68,0.1)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },

  // Promo bar
  promoBar: {
    margin: 16, padding: 14, borderRadius: 16,
    backgroundColor: 'rgba(251,191,36,0.06)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
    gap: 8,
  },
  promoBarText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4 },
  progressFill: { height: 4, backgroundColor: '#FBBF24', borderRadius: 4 },

  list: { flex: 1, paddingHorizontal: 16 },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 0, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 22, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  itemImg: { width: 84, height: 84 },
  itemBody: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 2 },
  itemRest: { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '600' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#FFF', lineHeight: 19 },
  itemPrice: { fontSize: 15, fontWeight: '900', color: '#FBBF24', marginTop: 4 },
  qtyControls: {
    flexDirection: 'column', alignItems: 'center', gap: 8,
    paddingRight: 14, paddingVertical: 10,
  },
  qtyBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnDelete: { backgroundColor: 'rgba(239,68,68,0.1)' },
  qtyBtnPlus: { backgroundColor: '#FBBF24' },
  qty: { color: '#FFF', fontWeight: '800', fontSize: 15 },

  footer: {
    padding: 16, paddingBottom: Platform.OS === 'web' ? 16 : 24,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', gap: 14,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 16,
    gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  summaryValue: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  summaryTotalRow: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', paddingTop: 10, marginTop: 2,
  },
  totalLabel: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  totalValue: { color: '#FBBF24', fontSize: 20, fontWeight: '900' },
  orderBtn: {
    backgroundColor: '#FBBF24', borderRadius: 22, paddingVertical: 16, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  orderBtnText: { color: '#0A0A0A', fontWeight: '800', fontSize: 16, flex: 1 },
  orderBtnTotal: { color: '#0A0A0A', fontWeight: '900', fontSize: 16 },

  // Empty
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, padding: 40 },
  emptyEmoji: { fontSize: 72 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  emptySub: { fontSize: 15, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  exploreBtn: {
    marginTop: 8, backgroundColor: '#FBBF24', paddingHorizontal: 24, paddingVertical: 13,
    borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  exploreBtnText: { color: '#0A0A0A', fontWeight: '800', fontSize: 15 },

  // Success
  successScreen: { flex: 1, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center', gap: 16, padding: 40 },
  successGlow: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(34,197,94,0.06)', alignSelf: 'center', top: '30%',
  },
  successTitle: { fontSize: 30, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  successSub: { fontSize: 16, color: 'rgba(255,255,255,0.5)' },
  etaCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(251,191,36,0.08)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
    padding: 14, borderRadius: 18, marginTop: 10,
  },
  etaText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
});
