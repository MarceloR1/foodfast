import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { ShoppingBag, Home as HomeIcon, Search, User } from 'lucide-react-native';
import { CartProvider, useCart } from './src/context/CartContext';
import Home from './src/screens/Home';
import RestaurantDetail from './src/screens/RestaurantDetail';
import CartScreen from './src/screens/CartScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Restaurant } from './src/services/api';

type Tab = 'home' | 'search' | 'cart' | 'profile';
type ModalScreen = 'restaurant' | null;

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [modalScreen, setModalScreen] = useState<ModalScreen>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { itemCount } = useCart();

  function openRestaurant(restaurant: Restaurant) {
    setSelectedRestaurant(restaurant);
    setModalScreen('restaurant');
  }

  function closeModal() {
    setModalScreen(null);
    setSelectedRestaurant(null);
  }

  function goToCart() {
    setModalScreen(null);
    setActiveTab('cart');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* Main screens (tab-based) */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && <Home onRestaurantPress={openRestaurant} onCartPress={() => setActiveTab('cart')} />}
        {activeTab === 'search' && <SearchScreen onRestaurantPress={openRestaurant} />}
        {activeTab === 'cart' && <CartScreen onBack={() => setActiveTab('home')} />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Modal overlay screen (Restaurant Detail) */}
      {modalScreen === 'restaurant' && selectedRestaurant && (
        <View style={styles.modalOverlay}>
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={closeModal}
            onCartPress={goToCart}
          />
        </View>
      )}

      {/* Bottom Tab Bar */}
      {modalScreen === null && (
        <View style={styles.tabBar}>
          <TabButton
            icon={<HomeIcon size={22} color={activeTab === 'home' ? '#FBBF24' : 'rgba(255,255,255,0.3)'} />}
            label="Inicio"
            active={activeTab === 'home'}
            onPress={() => setActiveTab('home')}
          />
          <TabButton
            icon={<Search size={22} color={activeTab === 'search' ? '#FBBF24' : 'rgba(255,255,255,0.3)'} />}
            label="Buscar"
            active={activeTab === 'search'}
            onPress={() => setActiveTab('search')}
          />
          <TabButton
            icon={
              <View>
                <ShoppingBag size={22} color={activeTab === 'cart' ? '#FBBF24' : 'rgba(255,255,255,0.3)'} />
                {itemCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
                  </View>
                )}
              </View>
            }
            label="Carrito"
            active={activeTab === 'cart'}
            onPress={() => setActiveTab('cart')}
          />
          <TabButton
            icon={<User size={22} color={activeTab === 'profile' ? '#FBBF24' : 'rgba(255,255,255,0.3)'} />}
            label="Perfil"
            active={activeTab === 'profile'}
            onPress={() => setActiveTab('profile')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function TabButton({ icon, label, active, onPress }: {
  icon: React.ReactNode; label: string; active: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.tabActiveDot} />}
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <CartProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#080808' },
  screenContainer: { flex: 1 },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#080808', zIndex: 50 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#0E0E0E',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: Platform.OS === 'web' ? 8 : 4,
    paddingTop: 8, paddingHorizontal: 10,
  },
  tabBtn: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4, position: 'relative' },
  tabLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
  tabLabelActive: { color: '#FBBF24' },
  tabActiveDot: {
    position: 'absolute', top: -10, width: 4, height: 4,
    borderRadius: 2, backgroundColor: '#FBBF24',
  },
  tabBadge: {
    position: 'absolute', top: -6, right: -8,
    backgroundColor: '#FBBF24', borderRadius: 9, minWidth: 17, height: 17,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: '#080808',
  },
  tabBadgeText: { color: '#080808', fontSize: 10, fontWeight: '900' },
});
