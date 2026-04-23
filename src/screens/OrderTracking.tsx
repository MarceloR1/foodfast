import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, Dimensions, Platform, ScrollView
} from 'react-native';
import { ArrowLeft, Clock, MapPin, Phone, MessageSquare, CheckCircle2, Bike } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const STEPS = [
  { label: 'Confirmado', sub: 'El restaurante recibió tu pedido', icon: '✅' },
  { label: 'Preparando', sub: 'Tu comida está en el horno', icon: '👨‍🍳' },
  { label: 'En camino', sub: 'El repartidor va hacia ti', icon: '🛵' },
  { label: 'Entregado', sub: '¡Buen provecho!', icon: '✨' },
];

export default function OrderTracking({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Simulate progress
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 8000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / (STEPS.length - 1),
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <ArrowLeft size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Sigue tu pedido</Text>
          <Text style={styles.orderId}>Orden #FF-8293</Text>
        </View>
      </View>

      {/* Map Simulation */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.mapImg}
        />
        <View style={styles.mapOverlay} />
        
        {/* Animated Bike Marker */}
        <Animated.View style={[styles.bikeMarker, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.bikeCircle}>
            <Bike size={18} color="#080808" />
          </View>
          <View style={styles.bikeTriangle} />
        </Animated.View>

        <View style={styles.destMarker}>
          <View style={styles.destCircle}>
            <MapPin size={18} color="#FFF" fill="#EF4444" />
          </View>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.dragBar} />
        
        <View style={styles.deliveryInfo}>
          <View>
            <Text style={styles.etaTitle}>Tiempo estimado</Text>
            <Text style={styles.etaTime}>12 - 18 min</Text>
          </View>
          <View style={styles.statusBadge}>
            <Clock size={14} color="#FBBF24" />
            <Text style={styles.statusBadgeText}>{STEPS[currentStep].label}</Text>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.trackerContainer}>
          <View style={styles.trackLine}>
            <Animated.View 
              style={[
                styles.trackFill, 
                { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
              ]} 
            />
          </View>
          <View style={styles.stepsRow}>
            {STEPS.map((step, i) => (
              <View key={i} style={styles.stepNode}>
                <View style={[
                  styles.nodeCircle, 
                  i <= currentStep && styles.nodeActive,
                  i < currentStep && styles.nodeDone
                ]}>
                  {i < currentStep ? (
                    <CheckCircle2 size={16} color="#080808" />
                  ) : (
                    <Text style={{ fontSize: 14 }}>{step.icon}</Text>
                  )}
                </View>
                <Text style={[styles.nodeLabel, i === currentStep && styles.labelActive]}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Courier Info */}
        <View style={styles.courierRow}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.courierImg} 
          />
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>Carlos Rodríguez</Text>
            <View style={styles.courierMeta}>
              <Star size={12} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.courierRating}>4.9 (240 entregas)</Text>
            </View>
          </View>
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.actionBtn}>
              <MessageSquare size={20} color="#FBBF24" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.callBtn]}>
              <Phone size={20} color="#080808" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, gap: 15,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: { flex: 1 },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  orderId: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },

  mapContainer: { flex: 1, position: 'relative', overflow: 'hidden' },
  mapImg: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,8,8,0.3)' },

  bikeMarker: {
    position: 'absolute', top: '40%', left: '30%', alignItems: 'center',
  },
  bikeCircle: {
    backgroundColor: '#FBBF24', width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FBBF24', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 8,
  },
  bikeTriangle: {
    width: 0, height: 0, backgroundColor: 'transparent',
    borderStyle: 'solid', borderLeftWidth: 8, borderRightWidth: 8,
    borderTopWidth: 12, borderLeftColor: 'transparent',
    borderRightColor: 'transparent', borderTopColor: '#FBBF24',
    marginTop: -2,
  },

  destMarker: {
    position: 'absolute', top: '60%', right: '20%',
  },
  destCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },

  infoCard: {
    backgroundColor: '#121212', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  dragBar: {
    width: 40, height: 5, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3, alignSelf: 'center', marginBottom: 25,
  },
  deliveryInfo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 25,
  },
  etaTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '600' },
  etaTime: { color: '#FFF', fontSize: 26, fontWeight: '900', marginTop: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(251,191,36,0.1)', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
  },
  statusBadgeText: { color: '#FBBF24', fontWeight: '800', fontSize: 12 },

  trackerContainer: { marginBottom: 30 },
  trackLine: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3,
    marginHorizontal: 10, overflow: 'hidden',
  },
  trackFill: { height: '100%', backgroundColor: '#FBBF24' },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -15 },
  stepNode: { alignItems: 'center', gap: 8 },
  nodeCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.08)',
  },
  nodeActive: { borderColor: '#FBBF24', backgroundColor: '#FBBF24' },
  nodeDone: { backgroundColor: '#FBBF24', borderColor: '#FBBF24' },
  nodeLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.3)' },
  labelActive: { color: '#FFF' },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 25 },

  courierRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  courierImg: { width: 50, height: 50, borderRadius: 25 },
  courierInfo: { flex: 1 },
  courierName: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  courierMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  courierRating: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  actionBtns: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  callBtn: { backgroundColor: '#FBBF24', borderColor: '#FBBF24' },
});
