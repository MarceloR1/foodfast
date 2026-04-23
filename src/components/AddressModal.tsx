import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  TextInput, ScrollView, Platform, Dimensions
} from 'react-native';
import { MapPin, X, Navigation, Home, Briefcase, Plus } from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface Address {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
}

const SAVED_ADDRESSES: Address[] = [
  { id: '1', label: 'Mi Casa', address: 'Colonia Palmira, Calle 4, Edificio 12', type: 'home' },
  { id: '2', label: 'Trabajo', address: 'Centro Corporativo Los Próceres, Torre 1', type: 'work' },
];

export default function AddressModal({ visible, onClose, onSelect }: Props) {
  const [newAddress, setNewAddress] = useState('');

  const getIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home size={18} color="#FBBF24" />;
      case 'work': return <Briefcase size={18} color="#FBBF24" />;
      default: return <MapPin size={18} color="#FBBF24" />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismiss} onPress={onClose} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>¿A dónde enviamos?</Text>
              <Text style={styles.subtitle}>Selecciona o agrega una dirección</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <MapPin size={18} color="rgba(255,255,255,0.3)" />
            <TextInput
              style={styles.input}
              placeholder="Buscar nueva dirección..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TouchableOpacity style={styles.nearMeBtn}>
              <Navigation size={14} color="#080808" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Tus direcciones</Text>
            {SAVED_ADDRESSES.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={styles.addrCard}
                onPress={() => {
                  onSelect(addr.address);
                  onClose();
                }}
              >
                <View style={styles.iconBg}>
                  {getIcon(addr.type)}
                </View>
                <View style={styles.addrInfo}>
                  <Text style={styles.addrLabel}>{addr.label}</Text>
                  <Text style={styles.addrText} numberOfLines={1}>{addr.address}</Text>
                </View>
                <View style={styles.checkCircle} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addMore}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Plus size={18} color="rgba(255,255,255,0.4)" />
              </View>
              <Text style={styles.addMoreText}>Agregar nueva dirección</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity 
            style={styles.confirmBtn}
            onPress={() => {
              if (newAddress) onSelect(newAddress);
              onClose();
            }}
          >
            <Text style={styles.confirmBtnText}>Confirmar ubicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  dismiss: { flex: 1 },
  content: {
    backgroundColor: '#111',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    maxHeight: height * 0.8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    marginLeft: 10,
  },
  nearMeBtn: {
    backgroundColor: '#FBBF24',
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  scroll: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  addrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBg: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(251,191,36,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  addrInfo: { flex: 1, marginLeft: 15 },
  addrLabel: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  addrText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 5,
  },
  addMoreText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600', marginLeft: 15 },
  confirmBtn: {
    backgroundColor: '#FBBF24',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#080808', fontWeight: '900', fontSize: 16 },
});
