import React, { useState } from 'react';
import {
  View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, Platform
} from 'react-native';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useCart } from '../context/CartContext';

interface Props {
  onBack: () => void;
}

export default function CartScreen({ onBack }: Props) {
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const [ordered, setOrdered] = useState(false);

  function handleOrder() {
    setOrdered(true);
    setTimeout(() => { clearCart(); setOrdered(false); onBack(); }, 2500);
  }

  if (ordered) {
    return (
      <View style={styles.successWrap}>
        <CheckCircle size={80} color="#22C55E" />
        <Text style={styles.successTitle}>¡Pedido realizado!</Text>
        <Text style={styles.successSub}>Tu comida está en camino 🚀</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Carrito</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySub}>Agrega platillos desde los restaurantes</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.exploreBtnText}>Explorar restaurantes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map(item => (
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.image_url }} style={styles.itemImg} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemRest}>{item.restaurantName}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.controls}>
                  <TouchableOpacity
                    style={styles.ctrlBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    {item.quantity === 1
                      ? <Trash2 size={15} color="#EF4444" />
                      : <Minus size={15} color="#FFF" />
                    }
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={[styles.ctrlBtn, styles.ctrlBtnPlus]}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={15} color="#0A0A0A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total ({itemCount} artículos)</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.orderBtn} onPress={handleOrder} activeOpacity={0.85}>
              <ShoppingBag size={20} color="#0A0A0A" />
              <Text style={styles.orderBtnText}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 14, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  clearText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, marginBottom: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  itemImg: { width: 80, height: 80 },
  itemInfo: { flex: 1, paddingVertical: 12, gap: 3 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  itemRest: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#FBBF24', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 14 },
  ctrlBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center',
  },
  ctrlBtnPlus: { backgroundColor: '#FBBF24' },
  qty: { color: '#FFF', fontWeight: '700', fontSize: 15, minWidth: 20, textAlign: 'center' },
  footer: {
    padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  totalValue: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  orderBtn: {
    backgroundColor: '#FBBF24', borderRadius: 20, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  orderBtnText: { color: '#0A0A0A', fontWeight: '800', fontSize: 16 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 40 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  exploreBtn: {
    marginTop: 10, backgroundColor: '#FBBF24', paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 20,
  },
  exploreBtnText: { color: '#0A0A0A', fontWeight: '700', fontSize: 15 },
  successWrap: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center', gap: 16 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  successSub: { fontSize: 16, color: 'rgba(255,255,255,0.6)' },
});
