import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DebugApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FoodFast Debug Mode</Text>
      <Text style={styles.subtext}>Si ves esto, el entorno está funcionando correctamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FBBF24',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 14,
  }
});
