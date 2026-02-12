import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesign } from '../../context/DesignContext';
import { usePremium } from '../../context/PremiumContext';

// Font definitions with style information for visual representation
interface FontDef {
  name: string;
  premium: boolean;
  style: 'normal' | 'script' | 'elegant';
}

const PRIMARY_FONTS: FontDef[] = [
  { name: 'Fredoka', premium: false, style: 'normal' },
  { name: 'Poppins', premium: false, style: 'normal' },
  { name: 'Quicksand', premium: false, style: 'normal' },
];

const SCRIPT_FONTS: FontDef[] = [
  { name: 'Dancing Script', premium: true, style: 'script' },
  { name: 'Pacifico', premium: true, style: 'script' },
  { name: 'Satisfy', premium: true, style: 'script' },
  { name: 'Caveat', premium: true, style: 'script' },
  // Additional script fonts
  { name: 'Great Vibes', premium: true, style: 'script' },
  { name: 'Tangerine', premium: true, style: 'script' },
  { name: 'Allura', premium: true, style: 'script' },
  { name: 'Pinyon Script', premium: true, style: 'script' },
];

const ELEGANT_FONTS: FontDef[] = [
  { name: 'Playfair', premium: true, style: 'elegant' },
  { name: 'Cormorant', premium: true, style: 'elegant' },
  { name: 'Lora', premium: true, style: 'elegant' },
  { name: 'Merriweather', premium: true, style: 'elegant' },
  // Additional elegant fonts
  { name: 'Libre Baskerville', premium: true, style: 'elegant' },
  { name: 'Spectral', premium: true, style: 'elegant' },
  { name: 'Crimson Text', premium: true, style: 'elegant' },
  { name: 'EB Garamond', premium: true, style: 'elegant' },
];

interface FontPillProps {
  font: FontDef;
  isSelected: boolean;
  isLocked: boolean;
  primaryColor: string;
  onPress: () => void;
}

function FontPill({ font, isSelected, isLocked, primaryColor, onPress }: FontPillProps) {
  // Determine visual style based on font category
  // This visually indicates the font style until actual fonts are loaded
  const getFontStyle = (): TextStyle => {
    switch (font.style) {
      case 'script':
        return { fontStyle: 'italic', fontWeight: '400' };
      case 'elegant':
        return { fontWeight: '300', letterSpacing: 1 };
      default:
        return { fontWeight: '600' };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.pill,
        isSelected
          ? { backgroundColor: primaryColor, borderColor: primaryColor }
          : { backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.pillText,
          getFontStyle(),
          { color: isSelected ? '#FFFFFF' : '#2D2D2D' },
        ]}
      >
        {font.name}
      </Text>
      {isLocked ? (
        <Ionicons name="lock-closed" size={12} color={isSelected ? '#FFF' : '#AAA'} style={styles.lockIcon} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function TypographyTab() {
  const { design, setFont, colors } = useDesign();
  const { isPremium } = usePremium();

  const handleSelect = (name: string, premium: boolean) => {
    if (premium === true && isPremium !== true) return;
    setFont(name);
  };

  return (
    <View style={styles.container}>
      {/* Primary fonts */}
      <Text style={styles.sectionTitle}>TYPOGRAPHY</Text>
      <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
        Tap a font to apply it instantly
      </Text>
      <View style={styles.pillRow}>
        {PRIMARY_FONTS.map((f) => (
          <FontPill
            key={f.name}
            font={f}
            isSelected={design.fontFamily === f.name}
            isLocked={false}
            primaryColor={colors.primary}
            onPress={() => handleSelect(f.name, f.premium)}
          />
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.accent }]} />

      {/* Premium styles header */}
      <Text style={styles.premiumTitle}>Premium Styles</Text>

      {/* Script fonts */}
      <Text style={styles.categoryLabel}>SCRIPT</Text>
      <Text style={[styles.categoryDesc, { color: colors.textSecondary }]}>
        Flowing, handwritten elegance
      </Text>
      <View style={styles.pillRow}>
        {SCRIPT_FONTS.map((f) => (
          <FontPill
            key={f.name}
            font={f}
            isSelected={design.fontFamily === f.name}
            isLocked={f.premium === true && isPremium !== true}
            primaryColor={colors.primary}
            onPress={() => handleSelect(f.name, f.premium)}
          />
        ))}
      </View>

      {/* Elegant fonts */}
      <Text style={styles.categoryLabel}>ELEGANT</Text>
      <Text style={[styles.categoryDesc, { color: colors.textSecondary }]}>
        Sophisticated serif designs
      </Text>
      <View style={styles.pillRow}>
        {ELEGANT_FONTS.map((f) => (
          <FontPill
            key={f.name}
            font={f}
            isSelected={design.fontFamily === f.name}
            isLocked={f.premium === true && isPremium !== true}
            primaryColor={colors.primary}
            onPress={() => handleSelect(f.name, f.premium)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#2D2D2D',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 14,
  },
  lockIcon: {
    marginLeft: 6,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 14,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#666',
    marginBottom: 4,
    marginTop: 4,
  },
  categoryDesc: {
    fontSize: 11,
    marginBottom: 8,
  },
});
