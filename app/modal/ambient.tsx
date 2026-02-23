import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesign } from '../../context/DesignContext';
import { useProfile } from '../../context/ProfileContext';
import { usePremium } from '../../context/PremiumContext';
import { getDaysRemaining } from '../../utils/date';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_BG = require('../../assets/baby-bg.png');

export default function AmbientScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { design, colors } = useDesign();
  const { profile } = useProfile();
  const { isPremium } = usePremium();

  // Gate: redirect non-premium users to paywall
  useEffect(() => {
    if (!isPremium) {
      router.replace('/modal/paywall');
    }
  }, [isPremium]);

  const daysLeft = getDaysRemaining(profile.dueDate);

  // Gentle slow pulse animation
  const pulse = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.85, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bgSource = design.backgroundPhoto ? { uri: design.backgroundPhoto } : DEFAULT_BG;
  const textColor = '#FFFFFF';

  if (!isPremium) return null;

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <ImageBackground
        source={bgSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        blurRadius={design.blur ?? 0}
      >
        {/* Dark veil for readability */}
        <View style={[StyleSheet.absoluteFill, styles.veil]} />
      </ImageBackground>

      {/* Close tap — entire screen edge */}
      <TouchableOpacity
        style={[styles.closeZone, { top: insets.top + 12, right: 20 }]}
        onPress={() => router.back()}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Ionicons name="close-circle" size={30} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>

      {/* Centered countdown */}
      <View style={styles.center} pointerEvents="none">
        <Animated.Text style={[styles.daysNumber, { color: textColor, transform: [{ scale: pulse }] }]}>
          {daysLeft}
        </Animated.Text>
        <Text style={[styles.daysLabel, { color: 'rgba(255,255,255,0.6)' }]}>
          DAYS TO GO
        </Text>
        {profile.name ? (
          <Text style={[styles.babyName, { color: 'rgba(255,255,255,0.45)' }]}>
            {profile.name}
          </Text>
        ) : null}
      </View>

      {/* Hint */}
      <Text style={[styles.hint, { bottom: insets.bottom + 20 }]}>
        Tap to close
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  veil: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  closeZone: {
    position: 'absolute',
    zIndex: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNumber: {
    fontSize: 120,
    fontWeight: '800',
    lineHeight: 130,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  daysLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 6,
    marginTop: 8,
  },
  babyName: {
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 2,
    marginTop: 16,
  },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.25)',
    fontSize: 13,
    letterSpacing: 1,
  },
});
