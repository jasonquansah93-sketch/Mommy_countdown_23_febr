import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import { getJourneyProgress, formatDateLabel } from '../../utils/date';
import DatePickerModal from '../DatePickerModal';

export default function JourneyProgress() {
  const { profile, updateProfile } = useProfile();
  const { colors } = useDesign();
  const countdownStarted = profile.countdownStarted === true;
  const percent = getJourneyProgress(profile.startDate, profile.dueDate);

  const [editingDate, setEditingDate] = useState<'start' | 'due' | null>(null);
  const [tempDate, setTempDate] = useState(new Date());

  const openStartPicker = () => {
    setTempDate(new Date(profile.startDate));
    setEditingDate('start');
  };

  const openDuePicker = () => {
    setTempDate(new Date(profile.dueDate));
    setEditingDate('due');
  };

  const confirmDate = () => {
    if (editingDate === 'start') {
      updateProfile({ startDate: tempDate.toISOString() });
    } else if (editingDate === 'due') {
      updateProfile({ dueDate: tempDate.toISOString() });
    }
    setEditingDate(null);
  };

  const cancelPicker = () => {
    setEditingDate(null);
  };

  // Before countdown started, show placeholder state
  if (!countdownStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.label, { color: colors.text }]}>JOURNEY PROGRESS</Text>
          <Text style={[styles.percent, { color: colors.textSecondary }]}>--%</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.accent }]}>
          <View style={[styles.fill, { backgroundColor: colors.primary, width: '0%' }]} />
        </View>
        <View style={styles.dateRow}>
          <Text style={[styles.dateTextPlaceholder, { color: colors.textSecondary }]}>
            Start: --
          </Text>
          <Text style={[styles.dateTextPlaceholder, { color: colors.textSecondary }]}>
            Due: --
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.label, { color: colors.text }]}>JOURNEY PROGRESS</Text>
          <Text style={[styles.percent, { color: colors.primary }]}>{percent}%</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.accent }]}>
          <View style={[styles.fill, { backgroundColor: colors.primary, width: `${percent}%` }]} />
        </View>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={openStartPicker} activeOpacity={0.6}>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              Start: {formatDateLabel(profile.startDate)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openDuePicker} activeOpacity={0.6}>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              Due: {formatDateLabel(profile.dueDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date picker modal - using robust component for real device compatibility */}
      <DatePickerModal
        visible={editingDate !== null}
        title={editingDate === 'start' ? 'Edit Start Date' : 'Edit Due Date'}
        value={tempDate}
        onChange={setTempDate}
        onConfirm={confirmDate}
        onCancel={cancelPicker}
        maximumDate={editingDate === 'start' ? new Date() : undefined}
        minimumDate={editingDate === 'due' ? new Date() : undefined}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  percent: {
    fontSize: 15,
    fontWeight: '700',
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    borderRadius: 5,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  dateTextPlaceholder: {
    fontSize: 12,
    fontWeight: '500',
  },
});
