import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import { getWeeksAndDays, getDaysRemaining, formatDateLabel } from '../../utils/date';

// ─── Premium feature list ────────────────────────────────────────────────────
const PREMIUM_FEATURES = [
  {
    icon: 'water-outline',
    color: '#E91E8C',
    title: 'Remove watermark from all shared memories',
    subtitle: 'Share your precious moments beautifully',
  },
  {
    icon: 'image-outline',
    color: '#FF9800',
    title: 'Export images in high-resolution quality',
    subtitle: 'Perfect for printing and preserving',
  },
  {
    icon: 'gift-outline',
    color: '#9C27B0',
    title: 'Exclusive memory stickers & frames',
    subtitle: 'Personalize your countdown journey',
  },
  {
    icon: 'sparkles-outline',
    color: '#0298D1',
    title: 'Animated countdown cards',
    subtitle: 'Watch your journey come to life',
  },
  {
    icon: 'heart-outline',
    color: '#E91E8C',
    title: 'Unlimited memories & milestones',
    subtitle: 'Capture every special moment',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
interface SettingsRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  isLast: boolean;
  onPress?: () => void;
}
function SettingsRow({ iconName, iconBg, iconColor, label, value, isLast, onPress }: SettingsRowProps) {
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

interface ReminderRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  isLast: boolean;
}
function ReminderRow({ iconName, iconBg, iconColor, title, subtitle, value, onToggle, isLast }: ReminderRowProps) {
  return (
    <View style={[styles.listRow, !isLast && styles.listRowBorder]}>
      <View style={[styles.rowIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <View style={styles.reminderText}>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#FFBB80' }}
        thumbColor={value ? '#FF9800' : '#FFFFFF'}
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { profile } = useProfile();
  const { colors } = useDesign();

  const [remindersWeekly, setRemindersWeekly] = useState(true);
  const [remindersMilestones, setRemindersMilestones] = useState(true);

  const { weeks } = getWeeksAndDays(profile.dueDate);
  const daysLeft = getDaysRemaining(profile.dueDate);
  const babyName = profile.name || 'Baby Smith';

  // Due date pill: "DUE OCT 24, 2025"
  const dueDatePillText = (() => {
    const d = new Date(profile.dueDate);
    if (isNaN(d.getTime())) return 'DUE DATE';
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `DUE ${month} ${d.getDate()}, ${d.getFullYear()}`;
  })();

  // Due date row value: "Oct 24, 2025"
  const dueDateRow = formatDateLabel(profile.dueDate);

  // Gender for stats
  const genderSymbol = profile.gender === 'boy' ? '♂' : profile.gender === 'girl' ? '♀' : '?';
  const genderLabel =
    profile.gender === 'boy' ? 'BOY' : profile.gender === 'girl' ? 'GIRL' : 'SURPRISE';
  const genderColor =
    profile.gender === 'boy' ? '#64B5F6' : profile.gender === 'girl' ? '#E91E8C' : '#C4A77D';

  // Display format label
  const displayFormatLabel = (() => {
    switch (profile.timerDisplayMode) {
      case 'hours': return 'Hours';
      case 'minutes': return 'Minutes';
      case 'seconds': return 'Seconds';
      default: return 'Weeks + Days';
    }
  })();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Your baby &amp; preferences</Text>
          </View>
          <TouchableOpacity style={[styles.editBtn, { borderColor: colors.accent }]}>
            <Ionicons name="pencil" size={17} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Profile Card ──────────────────────────── */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={52} color="#D0D0D0" />
            </View>
            <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={styles.profileName}>{babyName}</Text>

          {/* Due date pill */}
          <View style={styles.duePill}>
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

        {/* ── Baby Details ──────────────────────────── */}
        <Text style={styles.sectionTitle}>Baby Details</Text>
        <View style={styles.listCard}>
          <SettingsRow
            iconName="person-outline"
            iconBg="#FFF0F5"
            iconColor="#E91E8C"
            label="Baby Name"
            value={babyName}
            isLast={false}
          />
          <SettingsRow
            iconName="calendar-outline"
            iconBg="#FFF8F0"
            iconColor="#FF9800"
            label="Due Date"
            value={dueDateRow}
            isLast={false}
          />
          <SettingsRow
            iconName="time-outline"
            iconBg="#F0F8FF"
            iconColor="#0298D1"
            label="Display Format"
            value={displayFormatLabel}
            isLast={true}
          />
        </View>

        {/* ── Reminders ─────────────────────────────── */}
        <Text style={styles.sectionTitle}>Reminders</Text>
        <View style={styles.listCard}>
          <ReminderRow
            iconName="notifications-outline"
            iconBg="#FFF8F0"
            iconColor="#FF9800"
            title="Weekly Update"
            subtitle="New week notification"
            value={remindersWeekly}
            onToggle={() => setRemindersWeekly((v) => !v)}
            isLast={false}
          />
          <ReminderRow
            iconName="star-outline"
            iconBg="#FFFBF0"
            iconColor="#FFC107"
            title="Milestones"
            subtitle="Special days & moments"
            value={remindersMilestones}
            onToggle={() => setRemindersMilestones((v) => !v)}
            isLast={true}
          />
        </View>

        {/* ── Premium ───────────────────────────────── */}
        <View style={styles.premiumHeaderRow}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <View style={[styles.plusBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.plusBadgeText}>PLUS</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#FFFFFF', '#FFF5F9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.premiumCard}
        >
          {/* Top row */}
          <View style={styles.premiumTopRow}>
            <View style={[styles.premiumIconCircle, { backgroundColor: '#FFF0F5' }]}>
              <Ionicons name="heart" size={22} color="#E91E8C" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.premiumCardTitle}>MommyCount Plus</Text>
              <Text style={styles.premiumCardSubtitle}>Make every memory perfect</Text>
            </View>
          </View>

          {/* Feature rows */}
          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIconCircle, { backgroundColor: `${f.color}18` }]}>
                <Ionicons name={f.icon as keyof typeof Ionicons.glyphMap} size={16} color={f.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
              </View>
            </View>
          ))}

          {/* CTA */}
          <TouchableOpacity style={[styles.ctaButton, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
            <Text style={styles.ctaText}>Unlock Perfect Memories</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>One-time purchase • Lifetime access</Text>
        </LinearGradient>

        {/* ── App Settings ──────────────────────────── */}
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.listCard}>
          <SettingsRow
            iconName="globe-outline"
            iconBg="#F0F8FF"
            iconColor="#0298D1"
            label="Language"
            value="English"
            isLast={false}
          />
          <SettingsRow
            iconName="color-palette-outline"
            iconBg="#FFF0F5"
            iconColor="#E91E8C"
            label="Theme"
            value="Soft Cream"
            isLast={false}
          />
          <SettingsRow
            iconName="share-social-outline"
            iconBg="#F0FFF4"
            iconColor="#66BB6A"
            label="Share App"
            value=""
            isLast={false}
          />
          <SettingsRow
            iconName="star-outline"
            iconBg="#FFFBF0"
            iconColor="#FFC107"
            label="Rate Us"
            value=""
            isLast={true}
          />
        </View>

        {/* ── Footer ────────────────────────────────── */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F4EF',
  },
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
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...CARD_SHADOW,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EBEBEB',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    backgroundColor: '#FF6B35',
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
    marginTop: 0,
  },

  // List card (shared by Baby Details, Reminders, App Settings)
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
  reminderText: {
    flex: 1,
  },
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

  // Premium header
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

  // Premium card
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
});
