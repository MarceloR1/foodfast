import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  User, Star, Clock, MapPin, Heart, Bell, Shield, ChevronRight,
  Award, Package, HelpCircle, LogOut
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

type RootStackParamList = {
  Profile: undefined;
  OrderHistory: undefined;
};

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
}

const MENU_ITEMS = [
  { id: 'orders', icon: <Package size={20} color="#FBBF24" />, label: 'Mis Pedidos', count: 0 },
  { id: 'favs', icon: <Heart size={20} color="#EF4444" />, label: 'Mis Favoritos', count: 0 },
  { id: 'addr', icon: <MapPin size={20} color="#3B82F6" />, label: 'Mis Direcciones', count: 0 },
  { id: 'notif', icon: <Bell size={20} color="#A78BFA" />, label: 'Notificaciones', count: 0 },
  { id: 'sec', icon: <Shield size={20} color="#22C55E" />, label: 'Seguridad', count: 0 },
  { id: 'help', icon: <HelpCircle size={20} color="rgba(255,255,255,0.4)" />, label: 'Ayuda', count: 0 },
];

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Invitado';

  const handleMenuPress = (id: string) => {
    if (id === 'orders') {
      navigation.navigate('OrderHistory');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <User size={32} color="#FBBF24" />
          </View>
          <View style={styles.onlineDot} />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{user?.email || 'Inicia sesión para más opciones'}</Text>
        
        {user ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.85}>
            <LogOut size={16} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Pedidos', value: '12', icon: '📦' },
          { label: 'Puntos', value: '1.2K', icon: '⭐' },
          { label: 'Ahorrado', value: 'L1,200', icon: '💰' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statEmoji}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Level badge */}
      <View style={styles.levelCard}>
        <Award size={24} color="#FBBF24" />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.levelTitle}>Nivel: Gourmet Gold 🏅</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.levelSub}>680 / 1000 puntos para Diamond</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
            onPress={() => handleMenuPress(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>{item.icon}</View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.count > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.count}</Text>
                </View>
              )}
              <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>FoodFast v1.0.0 · Hecho con ❤️</Text>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  header: {
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 24 : 16, paddingBottom: 24, gap: 6,
  },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(251,191,36,0.1)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(251,191,36,0.3)',
  },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E',
    borderWidth: 2, borderColor: '#080808',
  },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  loginBtnText: { color: '#080808', fontWeight: '800', fontSize: 14 },
  logoutBtn: {
    marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 14,
    alignItems: 'center', gap: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  levelCard: {
    marginHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(251,191,36,0.07)', borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },
  levelTitle: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4 },
  progressFill: { height: 4, backgroundColor: '#FBBF24', borderRadius: 4 },
  levelSub: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  menuCard: {
    marginHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 15, gap: 14,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#FFF' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuBadge: {
    backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)',
  },
  menuBadgeText: { color: '#FBBF24', fontSize: 11, fontWeight: '800' },
  version: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});
