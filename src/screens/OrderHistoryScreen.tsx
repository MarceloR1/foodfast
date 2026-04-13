import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Image, Platform
} from 'react-native';
import { ArrowLeft, Package, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orders';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  OrderHistory: undefined;
};

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'OrderHistory'>;
}

export default function OrderHistoryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserOrders(user.id)
        .then(setOrders)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#22C55E';
      case 'cancelled': return '#EF4444';
      default: return '#FBBF24';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'delivery': return 'En camino';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Pedidos</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FBBF24" size="large" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Package size={64} color="rgba(255,255,255,0.1)" />
          <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
          <Text style={styles.emptySub}>¡Realiza tu primer pedido y aparecerá aquí!</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {orders.map(order => (
            <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.8}>
              <View style={styles.orderHeader}>
                <Image 
                  source={{ uri: order.restaurants?.image_url }} 
                  style={styles.restaurantImg} 
                />
                <View style={styles.orderMeta}>
                  <Text style={styles.restaurantName}>{order.restaurants?.name}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {getStatusLabel(order.status)}
                    </Text>
                    <Text style={styles.dateText}>
                      • {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
              </View>

              <View style={styles.orderBody}>
                <Text style={styles.itemsSummary}>
                  {order.order_items?.length} productos • L{order.total_amount.toFixed(2)}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.reorderBtn}>
                <Text style={styles.reorderText}>Ver detalle</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginTop: 16 },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8 },
  list: { padding: 16, gap: 12 },
  orderCard: {
    backgroundColor: '#0E0E0E', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  orderHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  restaurantImg: { width: 50, height: 50, borderRadius: 12 },
  orderMeta: { flex: 1, gap: 2 },
  restaurantName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  dateText: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  orderBody: { 
    marginTop: 12, paddingVertical: 10, 
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' 
  },
  itemsSummary: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  reorderBtn: {
    marginTop: 8, paddingVertical: 10, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  reorderText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
});
