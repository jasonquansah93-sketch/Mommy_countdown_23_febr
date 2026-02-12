import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import { getDaysRemaining } from '../../utils/date';

export default function TimeRemainingCard() {
  const { profile } = useProfile();
  const { colors } = useDesign();
  const countdownStarted = profile.countdownStarted === true;
  const daysLeft = getDaysRemaining(profile.dueDate);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>TIME REMAINING</Text>
      {countdownStarted ? (
        <>
          <Text style={[styles.number, { color: colors.primary }]}>{daysLeft}</Text>
          <Text style={[styles.unit, { color: colors.text }]}>DAYS</Text>
        </>
      ) : (
        <>
          <Text style={[styles.placeholder, { color: colors.textSecondary }]}>--</Text>
          <Text style={[styles.placeholderHint, { color: colors.textSecondary }]}>
            Start your countdown to see
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  number: {
    fontSize: 72,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 80,
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 4,
  },
  placeholder: {
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },
  placeholderHint: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});
