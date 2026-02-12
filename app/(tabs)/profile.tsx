import React, { useState } from 'react';
import { View, Text, TextInput, Switch, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import { usePremium } from '../../context/PremiumContext';

export default function ProfileScreen() {
  const { profile, updateProfile, resetProfile } = useProfile();
  const { colors } = useDesign();
  const { isPremium, togglePremium } = usePremium();
  const [nameInput, setNameInput] = useState(profile.name);

  const handleNameBlur = () => {
    updateProfile({ name: nameInput });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Baby Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.accent }]}
            value={nameInput}
            onChangeText={setNameInput}
            onBlur={handleNameBlur}
            placeholder="Enter baby name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Due Date</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {new Date(profile.dueDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Edit due date in a future update
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: colors.text }]}>Premium</Text>
            <Switch
              value={isPremium === true}
              onValueChange={togglePremium}
            />
          </View>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            {isPremium === true ? 'Premium features unlocked' : 'Toggle to simulate premium access'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>App Info</Text>
          <Text style={[styles.value, { color: colors.text }]}>MommyCount v1.0.0</Text>
        </View>

        {/* Dev: Reset countdown state for testing */}
        <TouchableOpacity
          style={[styles.resetBtn, { backgroundColor: '#FF4444' }]}
          onPress={resetProfile}
          activeOpacity={0.7}
        >
          <Text style={styles.resetText}>RESET COUNTDOWN (Dev)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetBtn: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
