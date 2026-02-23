/**
 * CountdownCardBackground — single source of truth for the card image pipeline.
 *
 * Both DesignPreview and HeroCountdownCard MUST use this component so that the
 * background image, overlays, blur, and brightness adjustments are rendered
 * with the exact same logic and layer order on every screen.
 *
 * Layer order (bottom → top):
 *   1. ImageBackground  (blurred photo or default baby-bg)
 *   2. Brightness overlay  (dark when brightness < 100, light when > 100)
 *   3. Adaptive content overlay  (white 0.75 for dark text / dark 0.45 for light text)
 *   4. children  (card content — badges, headline, numbers, etc.)
 */
import React from 'react';
import { View, StyleSheet, ImageBackground, Platform } from 'react-native';
import { DesignSettings } from '../../types';

const DEFAULT_BG = require('../../assets/baby-bg.png');

interface Props {
  design: DesignSettings;
  /** Pass `isLightBackground(contentTextColor)` from the parent — true when text is white/light */
  isLightText: boolean;
  children: React.ReactNode;
  /** Style for the outer card wrapper (e.g. borderRadius, shadow) */
  cardStyle?: object;
  /** Background colour for the card wrapper View (typically colors.surface) */
  cardBgColor?: string;
}

export default function CountdownCardBackground({
  design,
  isLightText,
  children,
  cardStyle,
  cardBgColor = '#FFFFFF',
}: Props) {
  const hasCustomBg = design.backgroundPhoto != null;
  const bgSource = hasCustomBg ? { uri: design.backgroundPhoto! } : DEFAULT_BG;

  // Blur: for custom photos use design.blur; fallback image gets a gentle fixed blur
  const blurVal = hasCustomBg ? design.blur : 4;

  // Layer 2 — Brightness overlay (only for custom photo, only when not neutral)
  const brightnessOverlayOpacity = hasCustomBg
    ? design.brightness < 100
      ? (100 - design.brightness) / 100
      : design.brightness > 100
        ? (design.brightness - 100) / 100
        : 0
    : 0;
  const brightnessOverlayColor =
    design.brightness < 100
      ? `rgba(0,0,0,${brightnessOverlayOpacity})`
      : `rgba(255,255,255,${brightnessOverlayOpacity})`;

  // Layer 3 — Adaptive content overlay
  const adaptiveOverlayColor = isLightText
    ? 'rgba(0,0,0,0.45)'
    : 'rgba(255,255,255,0.75)';

  return (
    <View style={[styles.card, { backgroundColor: cardBgColor }, cardStyle]}>
      <ImageBackground
        source={bgSource}
        style={styles.fill}
        imageStyle={styles.bgImage}
        blurRadius={blurVal}
        resizeMode="cover"
      >
        {/* Layer 2: Brightness adjustment overlay */}
        {hasCustomBg && brightnessOverlayOpacity > 0 && (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: brightnessOverlayColor }]}
            pointerEvents="none"
          />
        )}

        {/* Layer 3: Adaptive content overlay */}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: adaptiveOverlayColor }]}
          pointerEvents="none"
        />

        {/* Layer 4: Card content */}
        {children}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  fill: {
    width: '100%',
  },
  bgImage: {
    borderRadius: 20,
  },
});
