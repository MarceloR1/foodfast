import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Zap } from 'lucide-react-native';

const PRIMARY_COLOR = '#FBBF24'; // Yellow
const BACKGROUND_COLOR = '#080808'; // Dark

export default function AuthScreen() {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleAuth() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error con Google Auth');
      setLoading(false);
    }
  }

  async function handleAuth() {
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        alert('Revisa tu correo para confirmar tu cuenta');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Zap size={40} color={PRIMARY_COLOR} fill={PRIMARY_COLOR} />
          </View>
          <Text style={styles.title}>FoodFast</Text>
          <Text style={styles.subtitle}>
            {isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta ahora'}
          </Text>
        </View>

        <View style={styles.formCard}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <User size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Mail size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#080808" />
            ) : (
              <>
                <Text style={styles.mainButtonText}>
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Text>
                <ArrowRight size={20} color="#080808" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleAuth} disabled={loading}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
                style={styles.socialIcon} 
              />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialBtn}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} 
                style={[styles.socialIcon, { tintColor: 'white' }]} 
              />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <Text style={styles.switchTextBold}>
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  scrollContent: { padding: 24, paddingTop: 60, minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  title: { fontSize: 32, fontWeight: '900', color: 'white', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  formCard: {
    backgroundColor: '#0E0E0E',
    borderRadius: 32, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16, marginBottom: 16,
    paddingHorizontal: 16, height: 56,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: 'white', fontSize: 16 },
  mainButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16, height: 56,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 8, gap: 8,
  },
  mainButtonText: { color: '#080808', fontSize: 18, fontWeight: '700' },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 16, fontSize: 14 },
  dividerContainer: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { marginHorizontal: 12, color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '600' },
  socialButtons: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1, height: 50, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  socialIcon: { width: 20, height: 20 },
  socialBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
  switchButton: { marginTop: 32, alignItems: 'center' },
  switchText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  switchTextBold: { color: PRIMARY_COLOR, fontWeight: '700' },
});
