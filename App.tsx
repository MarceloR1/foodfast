import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { CartProvider } from './src/context/CartContext';
import Home from './src/screens/Home';
import RestaurantDetail from './src/screens/RestaurantDetail';
import CartScreen from './src/screens/CartScreen';
import { Restaurant } from './src/services/api';

type Screen = 'home' | 'restaurant' | 'cart';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  function goToRestaurant(restaurant: Restaurant) {
    setSelectedRestaurant(restaurant);
    setScreen('restaurant');
  }

  function goToCart() {
    setScreen('cart');
  }

  function goHome() {
    setScreen('home');
    setSelectedRestaurant(null);
  }

  return (
    <CartProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
          {screen === 'home' && (
            <Home
              onRestaurantPress={goToRestaurant}
              onCartPress={goToCart}
            />
          )}
          {screen === 'restaurant' && selectedRestaurant && (
            <RestaurantDetail
              restaurant={selectedRestaurant}
              onBack={goHome}
              onCartPress={goToCart}
            />
          )}
          {screen === 'cart' && (
            <CartScreen onBack={() => setScreen(selectedRestaurant ? 'restaurant' : 'home')} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
