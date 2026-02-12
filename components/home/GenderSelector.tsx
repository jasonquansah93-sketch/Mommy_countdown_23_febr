import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';

const GENDERS: {
  key: 'boy' | 'girl' | 'surprise';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selectedBorder: string;
  selectedBg: string;
}[] = [
  { key: 'boy', label: 'BOY', icon: 'male', selectedBorder: '#4FC3F7', selectedBg: '#E3F2FD' },
  { key: 'girl', label: 'GIRL', icon: 'female', selectedBorder: '#E91E8C', selectedBg: '#FCE4EC' },
  { key: 'surprise', label: 'SURPRISE', icon: 'gift', selectedBorder: '#E91E8C', selectedBg: '#FCE4EC' },
];

export default function GenderSelector() {
  const { profile, updateProfile } = useProfile();
  const { colors } = useDesign();
  const selected = profile.gender ?? 'surprise';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>IT'S A...</Text>
      <View style={styles.row}>
        {GENDERS.map((g) => {
          const isSelected = selected === g.key;
          return (
            <TouchableOpacity
              key={g.key}
              style={[
                styles.option,
                {
                  borderColor: isSelected ? g.selectedBorder : colors.accent,
                  backgroundColor: isSelected ? g.selectedBg : colors.surface,
                  borderWidth: isSelected ? 2.5 : 1.5,
                },
              ]}
              onPress={() => updateProfile({ gender: g.key })}
              activeOpacity={0.7}
            >
              <Ionicons
                name={g.icon}
                size={28}
                color={isSelected ? g.selectedBorder : colors.textSecondary}
              />
              <Text
                style={[
                  styles.optionLabel,
                  { color: isSelected ? g.selectedBorder : colors.textSecondary },
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    marginHorizontal: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 6,
  },
});
