import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  TextInput, Platform, ActivityIndicator, Dimensions
} from 'react-native';
import { X, User, Phone, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ visible, onClose }: Props) {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await updateProfile({ full_name: name, phone: phone });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Perfil</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre Completo</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
            </View>

            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+504 0000-0000"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, success && styles.saveBtnSuccess]} 
              onPress={handleSave}
              disabled={loading || success}
            >
              {loading ? (
                <ActivityIndicator color="#080808" />
              ) : success ? (
                <Check size={20} color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', padding: 20,
  },
  content: {
    backgroundColor: '#111', borderRadius: 32, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  form: { gap: 16 },
  label: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  saveBtn: {
    backgroundColor: '#FBBF24', borderRadius: 18, height: 56,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
  },
  saveBtnSuccess: { backgroundColor: '#22C55E' },
  saveBtnText: { color: '#080808', fontSize: 16, fontWeight: '900' },
});
