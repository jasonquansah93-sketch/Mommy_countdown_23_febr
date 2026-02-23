import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import { getWeeksAndDays, getDaysRemaining, formatDateLabel } from '../../utils/date';
import { loadJSON, saveJSON } from '../../utils/storage';

// ─── Reminders persistence ───────────────────────────────────────────────────
const REMINDERS_KEY = 'mommy_reminders';
interface RemindersState {
  weekly: boolean;
  milestones: boolean;
}

// ─── Premium feature list (copy-only, no new colors) ─────────────────────────
const PREMIUM_FEATURES = [
  {
    icon: 'water-outline',
    title: 'Remove watermark from all shared memories',
    subtitle: 'Share your precious moments beautifully',
  },
  {
    icon: 'image-outline',
    title: 'Export images in high-resolution quality',
    subtitle: 'Perfect for printing and preserving',
  },
  {
    icon: 'gift-outline',
    title: 'Exclusive memory stickers & frames',
    subtitle: 'Personalize your countdown journey',
  },
  {
    icon: 'sparkles-outline',
    title: 'Animated countdown cards',
    subtitle: 'Watch your journey come to life',
  },
  {
    icon: 'heart-outline',
    title: 'Unlimited memories & milestones',
    subtitle: 'Capture every special moment',
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ActiveRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  isLast: boolean;
  onPress: () => void;
}
function ActiveRow({ iconName, iconBg, iconColor, label, value, isLast, onPress }: ActiveRowProps) {
  return (
    <TouchableOpacity
      style={[styles.listRow, !isLast && styles.listRowBorder]}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View style={[styles.rowIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color="#CCCCCC" style={{ marginLeft: 4 }} />
      </View>
    </TouchableOpacity>
  );
}

interface DisabledRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  isLast: boolean;
}
function DisabledRow({ iconName, iconBg, iconColor, label, value, isLast }: DisabledRowProps) {
  return (
    <View style={[styles.listRow, !isLast && styles.listRowBorder]}>
      <View style={[styles.rowIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {/* Disabled chevron — dimmed to signal non-interactive */}
        <Ionicons name="chevron-forward" size={16} color="#E0E0E0" style={{ marginLeft: 4, opacity: 0.4 }} />
      </View>
    </View>
  );
}

interface ReminderRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  isLast: boolean;
  accentColor: string;
}
function ReminderRow({
  iconName, iconBg, iconColor,
  title, subtitle,
  value, onToggle, isLast,
  accentColor,
}: ReminderRowProps) {
  return (
    <View style={[styles.listRow, !isLast && styles.listRowBorder]}>
      <View style={[styles.rowIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <View style={styles.reminderText}>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderSubtitle}>{subtitle}</Text>
      </View>
      {/* Toggle: full-opacity accent on ON track, always white thumb for contrast */}
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#D1D1D6', true: accentColor }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1D6"
      />
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const { colors } = useDesign();

  // ── Reminders — persisted ──────────────────────────────────────────────────
  const [remindersWeekly, setRemindersWeekly] = useState(true);
  const [remindersMilestones, setRemindersMilestones] = useState(true);

  useEffect(() => {
    loadJSON<RemindersState>(REMINDERS_KEY).then((saved) => {
      if (saved) {
        setRemindersWeekly(saved.weekly);
        setRemindersMilestones(saved.milestones);
      }
    });
  }, []);

  const toggleWeekly = useCallback(() => {
    setRemindersWeekly((prev) => {
      const next = !prev;
      saveJSON<RemindersState>(REMINDERS_KEY, { weekly: next, milestones: remindersMilestones });
      return next;
    });
  }, [remindersMilestones]);

  const toggleMilestones = useCallback(() => {
    setRemindersMilestones((prev) => {
      const next = !prev;
      saveJSON<RemindersState>(REMINDERS_KEY, { weekly: remindersWeekly, milestones: next });
      return next;
    });
  }, [remindersWeekly]);

  // ── Baby name edit modal ───────────────────────────────────────────────────
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const openNameEdit = () => {
    setNameInput(profile.name || '');
    setIsEditingName(true);
  };

  const saveNameEdit = () => {
    const trimmed = nameInput.trim();
    if (trimmed) updateProfile({ name: trimmed });
    setIsEditingName(false);
  };

  // ── Derived values — same utilities as Countdown ──────────────────────────
  const { weeks } = getWeeksAndDays(profile.dueDate);
  const daysLeft = getDaysRemaining(profile.dueDate);
  const babyName = profile.name || 'Baby';

  // Due date pill text: "DUE MAR 28, 2026" — read-only, derived from global dueDate
  const dueDatePillText = (() => {
    const d = new Date(profile.dueDate);
    if (isNaN(d.getTime())) return 'DUE DATE';
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `DUE ${month} ${d.getDate()}, ${d.getFullYear()}`;
  })();

  // Due date row value: "Mar 28, 2026" — read-only
  const dueDateRow = formatDateLabel(profile.dueDate);

  // Gender stats
  const genderSymbol =
    profile.gender === 'boy' ? '♂' : profile.gender === 'girl' ? '♀' : '?';
  const genderLabel =
    profile.gender === 'boy' ? 'BOY' : profile.gender === 'girl' ? 'GIRL' : 'SURPRISE';
  // Gender icon color follows theme, not hardcoded
  const genderColor = colors.primary;

  // Row icon colors derived from theme
  const pillBg = colors.primary;
  const iconPrimary = colors.primary;
  const iconPrimaryBg = colors.background;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8F4EF' }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Your baby &amp; preferences</Text>
          </View>
          {/* Edit button — opens Baby Name edit only */}
          <TouchableOpacity
            style={[styles.editBtn, { borderColor: colors.accent }]}
            onPress={openNameEdit}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={17} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Profile Card ─────────────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          {/* Name — tap to edit */}
          <TouchableOpacity onPress={openNameEdit} activeOpacity={0.7}>
            <Text style={styles.profileName}>{babyName}</Text>
          </TouchableOpacity>

          {/* Due date pill — color from theme, read-only */}
          <View style={[styles.duePill, { backgroundColor: pillBg }]}>
            <Ionicons name="calendar-outline" size={11} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.duePillText}>{dueDatePillText}</Text>
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{weeks}</Text>
              <Text style={styles.statLabel}>WEEK</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statCol}>
              <Text style={[styles.statSymbol, { color: genderColor }]}>{genderSymbol}</Text>
              <Text style={styles.statLabel}>{genderLabel}</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{daysLeft}</Text>
              <Text style={styles.statLabel}>DAYS LEFT</Text>
            </View>
          </View>
        </View>

        {/* ── Baby Details ─────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Baby Details</Text>
        <View style={styles.listCard}>
          {/* Baby Name — only editable row */}
          <ActiveRow
            iconName="person-outline"
            iconBg={iconPrimaryBg}
            iconColor={iconPrimary}
            label="Baby Name"
            value={babyName}
            isLast={false}
            onPress={openNameEdit}
          />
          {/* Due Date — read-only, no edit entry point here */}
          <DisabledRow
            iconName="calendar-outline"
            iconBg="#FFF8F0"
            iconColor="#AAAAAA"
            label="Due Date"
            value={dueDateRow}
            isLast={true}
          />
        </View>

        {/* ── Reminders ────────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Reminders</Text>
        <View style={styles.listCard}>
          <ReminderRow
            iconName="notifications-outline"
            iconBg={iconPrimaryBg}
            iconColor={iconPrimary}
            title="Weekly Update"
            subtitle="New week notification"
            value={remindersWeekly}
            onToggle={toggleWeekly}
            isLast={false}
            accentColor={colors.primary}
          />
          <ReminderRow
            iconName="star-outline"
            iconBg={iconPrimaryBg}
            iconColor={iconPrimary}
            title="Milestones"
            subtitle="Special days &amp; moments"
            value={remindersMilestones}
            onToggle={toggleMilestones}
            isLast={true}
            accentColor={colors.primary}
          />
        </View>

        {/* ── Premium ──────────────────────────────────────────────────────── */}
        <View style={styles.premiumHeaderRow}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <View style={[styles.plusBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.plusBadgeText}>PLUS</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#FFFFFF', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.premiumCard}
        >
          <View style={styles.premiumTopRow}>
            <View style={[styles.premiumIconCircle, { backgroundColor: iconPrimaryBg }]}>
              <Ionicons name="heart" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.premiumCardTitle}>MommyCount Plus</Text>
              <Text style={styles.premiumCardSubtitle}>Make every memory perfect</Text>
            </View>
          </View>

          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIconCircle, { backgroundColor: iconPrimaryBg }]}>
                <Ionicons
                  name={f.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Unlock Perfect Memories</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>One-time purchase • Lifetime access</Text>
        </LinearGradient>

        {/* ── App Settings ─────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.listCard}>
          <ActiveRow
            iconName="globe-outline"
            iconBg="#F0F8FF"
            iconColor="#0298D1"
            label="Language"
            value="English"
            isLast={false}
            onPress={() => {}}
          />
          <ActiveRow
            iconName="share-social-outline"
            iconBg="#F0FFF4"
            iconColor="#66BB6A"
            label="Share App"
            value=""
            isLast={false}
            onPress={() => {}}
          />
          <ActiveRow
            iconName="star-outline"
            iconBg="#FFFBF0"
            iconColor="#FFC107"
            label="Rate Us"
            value=""
            isLast={true}
            onPress={() => {}}
          />
        </View>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>  •  </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms of Use</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>  •  </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Support</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerVersion}>Version 2.4.0 • Made with ♡ for moms</Text>
        </View>
      </ScrollView>

      {/* ── Baby Name Edit Modal ──────────────────────────────────────────── */}
      <Modal visible={isEditingName} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsEditingName(false)}
          />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Baby Name</Text>
            <TextInput
              style={[styles.nameInput, { borderColor: colors.accent }]}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter baby name"
              placeholderTextColor="#AAAAAA"
              autoFocus
              selectTextOnFocus
              returnKeyType="done"
              onSubmitEditing={saveNameEdit}
              maxLength={40}
            />
            <TouchableOpacity
              style={[styles.modalDoneBtn, { backgroundColor: colors.primary }]}
              onPress={saveNameEdit}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDoneBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const CARD_RADIUS = 18;
const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
    ...CARD_SHADOW,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...CARD_SHADOW,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  duePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  duePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statSep: {
    width: 1,
    height: 32,
    backgroundColor: '#EBEBEB',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 34,
  },
  statSymbol: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#AAAAAA',
    letterSpacing: 0.8,
    marginTop: 2,
  },

  // Section title
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },

  // List card
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    marginBottom: 24,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 14,
    color: '#888888',
  },

  // Reminder rows
  reminderText: { flex: 1 },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reminderSubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 1,
  },

  // Premium
  premiumHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  plusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  plusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  premiumCard: {
    borderRadius: CARD_RADIUS,
    padding: 18,
    marginBottom: 24,
    ...CARD_SHADOW,
  },
  premiumTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  premiumCardSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  featureIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    lineHeight: 17,
  },
  ctaButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ctaNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAAAAA',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  footerDot: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  footerVersion: {
    fontSize: 12,
    color: '#BBBBBB',
  },

  // Name edit modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  nameInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDoneBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
