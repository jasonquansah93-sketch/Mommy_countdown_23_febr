import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDesign } from '../../context/DesignContext';
import { usePremium } from '../../context/PremiumContext';
import { DESIGN_PRESETS } from '../../constants/presets';
import { Ionicons } from '@expo/vector-icons';

export default function PresetsTab() {
  const { design, setPreset, colors } = useDesign();
  const { isPremium } = usePremium();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PREMIUM PRESETS</Text>
      <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
        Complete looks with one tap
      </Text>

      <View style={styles.grid}>
        {DESIGN_PRESETS.map((preset) => {
          const isSelected = design.presetId === preset.id;
          const isLocked = preset.premium === true && isPremium !== true;
          return (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetCard,
                {
                  borderColor: isSelected ? colors.primary : colors.accent,
                  borderWidth: isSelected ? 2 : 1.5,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => {
                if (isLocked) return;
                setPreset(preset.id, preset.themeId, preset.fontFamily, preset.filter);
              }}
            >
              <View style={styles.presetContent}>
                <Text style={[styles.presetName, { color: colors.text }]} numberOfLines={2}>
                  {preset.name}
                </Text>
                <Text style={[styles.presetDesc, { color: colors.textSecondary }]}>
                  {preset.description}
                </Text>
              </View>
              {isLocked ? (
                <Ionicons name="lock-closed" size={14} color={colors.textSecondary} style={styles.lockIcon} />
              ) : null}
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={styles.checkIcon} />
              ) : null}
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    minHeight: 80,
    position: 'relative',
  },
  presetContent: {
    flex: 1,
  },
  presetName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  presetDesc: {
    fontSize: 13,
  },
  lockIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
