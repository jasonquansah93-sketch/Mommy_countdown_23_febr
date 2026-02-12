import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesign } from '../../context/DesignContext';
import { useRouter } from 'expo-router';

export default function GradientHeader() {
  const { colors } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.left}>
        <View style={styles.heartCircle}>
          <Ionicons name="heart" size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.brand}>
          <Text style={styles.brandBold}>MOMMY</Text>
          <Text style={styles.brandLight}>COUNT</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.gearCircle}
        onPress={() => router.push('/(tabs)/profile')}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brand: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  brandBold: {
    fontWeight: '800',
  },
  brandLight: {
    fontWeight: '300',
  },
  gearCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
