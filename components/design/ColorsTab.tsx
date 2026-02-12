import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesign } from '../../context/DesignContext';
import { THEMES } from '../../constants/themes';

// Color shades for each palette - represents the COLOR RANGE within each theme
const COLOR_SHADES: Record<string, string[]> = {
  rose: ['#FFB6D9', '#FF8BBF', '#E91E8C', '#C91A76', '#A01560', '#FF6FB7', '#FF9FCC'],
  lavender: ['#D1C4E9', '#B388FF', '#9575CD', '#7C4DFF', '#651FFF', '#536DFE', '#7E57C2'],
  ocean: ['#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#0288D1', '#039BE5', '#03A9F4'],
  sage: ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#388E3C', '#2E7D32'],
  sunset: ['#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FF6D00', '#F57C00'],
};

interface ShadePickerProps {
  visible: boolean;
  themeName: string;
  shades: string[];
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

function ShadePicker({ visible, themeName, shades, currentColor, onSelect, onClose }: ShadePickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.shadeModal}>
          <Text style={styles.shadeTitle}>Select a {themeName} shade</Text>
          <Text style={styles.shadeSubtitle}>Tap to apply to your countdown</Text>
          <View style={styles.shadeRow}>
            {shades.map((shade, index) => {
              const isSelected = shade.toLowerCase() === currentColor.toLowerCase();
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.shadeSwatch,
                    { backgroundColor: shade },
                    isSelected && styles.shadeSwatchSelected,
                  ]}
                  onPress={() => {
                    onSelect(shade);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function ColorsTab() {
  const { design, setTheme, setCustomColor, colors } = useDesign();
  const [shadePickerVisible, setShadePickerVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<typeof THEMES[0] | null>(null);

  const handleThemePress = (theme: typeof THEMES[0]) => {
    // If already this theme, open shade picker
    if (design.themeId === theme.id) {
      setSelectedTheme(theme);
      setShadePickerVisible(true);
    } else {
      // Switch to this theme
      setTheme(theme.id);
    }
  };

  const handleShadeSelect = (color: string) => {
    // Update the primary color within the current theme
    setCustomColor('primary', color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>COLOR THEMES</Text>
      <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
        Tap a theme to apply, tap again to customize shades
      </Text>

      {THEMES.map((theme) => {
        const isSelected = design.themeId === theme.id;
        const shades = COLOR_SHADES[theme.id] || [theme.colors.primary];

        return (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.themeCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: isSelected ? theme.colors.primary : colors.accent,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            onPress={() => handleThemePress(theme)}
            activeOpacity={0.7}
          >
            <View style={styles.swatches}>
              {shades.slice(0, 5).map((shade, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.swatch,
                    { backgroundColor: shade },
                    design.colors.primary === shade && styles.swatchActive,
                  ]}
                />
              ))}
            </View>
            <View style={styles.themeInfo}>
              <Text style={[styles.themeName, { color: theme.colors.text }]}>{theme.name}</Text>
              {isSelected && (
                <Text style={[styles.tapHint, { color: theme.colors.textSecondary }]}>
                  Tap for more shades
                </Text>
              )}
            </View>
            {isSelected ? (
              <Ionicons name="chevron-forward" size={22} color={theme.colors.primary} />
            ) : null}
          </TouchableOpacity>
        );
      })}

      {/* Shade picker modal */}
      {selectedTheme && (
        <ShadePicker
          visible={shadePickerVisible}
          themeName={selectedTheme.name}
          shades={COLOR_SHADES[selectedTheme.id] || [selectedTheme.colors.primary]}
          currentColor={design.colors.primary}
          onSelect={handleShadeSelect}
          onClose={() => setShadePickerVisible(false)}
        />
      )}
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
    marginBottom: 16,
    color: '#888',
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  swatches: {
    flexDirection: 'row',
    marginRight: 14,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  swatchActive: {
    borderWidth: 2,
    borderColor: '#2D2D2D',
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  tapHint: {
    fontSize: 11,
    marginTop: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadeModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  shadeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  shadeSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  shadeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  shadeSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  shadeSwatchSelected: {
    borderWidth: 3,
    borderColor: '#2D2D2D',
  },
});
