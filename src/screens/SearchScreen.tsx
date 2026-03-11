import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Platform
} from 'react-native';
import { Search as SearchIcon, Star, Clock, X } from 'lucide-react-native';
import { Restaurant, getRestaurants } from '../services/api';

interface Props {
  onRestaurantPress: (r: Restaurant) => void;
}

const TAGS = ['🍔 Burgers', '🍕 Pizza', '🍣 Sushi', '🌮 Tacos', '🍜 Ramen', '🥩 Carnes', '🥗 Saludable'];

export default function SearchScreen({ onRestaurantPress }: Props) {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    getRestaurants().then(setRestaurants).finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r => {
    const q = query.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.price_range.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <Text style={styles.subtitle}>Encuentra tus platillos favoritos</Text>
      </View>

      {/* Search input */}
      <View style={styles.searchRow}>
        <SearchIcon size={18} color="rgba(255,255,255,0.3)" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Restaurantes, platillos..."
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={17} color="rgba(255,255,255,0.35)" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
        {TAGS.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, activeTag === tag && styles.tagActive]}
            onPress={() => { setActiveTag(prev => prev === tag ? null : tag); setQuery(''); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tagText, activeTag === tag && styles.tagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {loading ? 'Cargando...' : `${filtered.length} resultados`}
        </Text>
        {loading ? (
          <ActivityIndicator color="#FBBF24" size="large" style={{ marginTop: 40 }} />
        ) : filtered.map(res => (
          <TouchableOpacity
            key={res.id}
            style={styles.row}
            onPress={() => onRestaurantPress(res)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: res.image_url }} style={styles.rowImg} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{res.name}</Text>
              <View style={styles.rowMeta}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.rowMetaText}>{res.rating}</Text>
                <Text style={styles.rowDot}>·</Text>
                <Clock size={12} color="rgba(255,255,255,0.4)" />
                <Text style={styles.rowMetaText}>{res.time_estimate}</Text>
                <Text style={styles.rowDot}>·</Text>
                <Text style={[styles.rowMetaText, { color: '#FBBF24' }]}>{res.price_range}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create;
const styles = s({
  container: { flex: 1, backgroundColor: '#080808' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 14, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  searchRow: {
    marginHorizontal: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  input: { flex: 1, color: '#FFF', fontSize: 15, outlineStyle: 'none' } as any,
  tagsScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  tag: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  tagActive: { backgroundColor: '#FBBF24', borderColor: '#FBBF24' },
  tagText: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '600' },
  tagTextActive: { color: '#080808' },
  list: { flex: 1, paddingHorizontal: 16 },
  resultsCount: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10, fontWeight: '600' },
  row: {
    flexDirection: 'row', gap: 0, overflow: 'hidden', borderRadius: 22, marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  rowImg: { width: 90, height: 90 },
  rowInfo: { flex: 1, padding: 14, justifyContent: 'center', gap: 6 },
  rowName: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rowMetaText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  rowDot: { color: 'rgba(255,255,255,0.2)', fontSize: 14 },
});
