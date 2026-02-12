import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDesign } from '../../context/DesignContext';
import GradientButton from './GradientButton';

export default function CustomizeCTA() {
  const { colors } = useDesign();
  const router = useRouter();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>MAKE IT TRULY YOURS</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Personalize your countdown with fonts, colors, and photos
      </Text>
      <GradientButton
        title="CUSTOMIZE DESIGN"
        icon="pencil"
        onPress={() => router.push('/(tabs)/design')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 100,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  button: {
    width: '100%',
  },
});
