import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDesign } from '../../context/DesignContext';
import { useRouter } from 'expo-router';
import { usePregnancy } from '../../context/PregnancyContext';
import { useProfile } from '../../context/ProfileContext';
import { usePremium } from '../../context/PremiumContext';
import { Moment, Milestone } from '../../types/pregnancy';
import { formatDateLabel, getDaysRemaining, getMilestoneDateState } from '../../utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadJSON, saveJSON } from '../../utils/storage';

const PAYWALL_100_KEY = 'mommy_paywall_100shown';

export default function JourneyScreen() {
  const { colors } = useDesign();
  const router = useRouter();
  const {
    pregnancies,
    currentPregnancy,
    selectedPregnancyId,
    setSelectedPregnancyId,
    isLoaded,
    archiveCurrentPregnancy,
    createNewPregnancy,
    getManualMoments,
  } = usePregnancy();
  const { profile, updateProfile } = useProfile();
  const { isPremium } = usePremium();
  const insets = useSafeAreaInsets();
  const paywall100Triggered = useRef(false);

  const hasMultiplePregnancies = pregnancies.length > 1;
  const activePregnancy = pregnancies.find((p) => p.status === 'active');
  const daysRemaining = currentPregnancy ? getDaysRemaining(currentPregnancy.dueDate) : 999;

  useEffect(() => {
    if (
      activePregnancy &&
      daysRemaining <= 0 &&
      profile.countdownStarted
    ) {
      archiveCurrentPregnancy();
    }
  }, [daysRemaining, activePregnancy, profile.countdownStarted, archiveCurrentPregnancy]);

  // 100-days-to-go paywall trigger — fires once per user lifetime
  useEffect(() => {
    if (isPremium || paywall100Triggered.current) return;
    if (daysRemaining !== 100) return;
    loadJSON<boolean>(PAYWALL_100_KEY).then((shown) => {
      if (!shown) {
        paywall100Triggered.current = true;
        saveJSON(PAYWALL_100_KEY, true);
        router.push('/modal/paywall');
      }
    });
  }, [daysRemaining, isPremium]);

  /** RENDER FIREWALL: Your Moments = ONLY manual entries. Never milestones, never milestone-origin moments. */
  const manualMoments = getManualMoments();
  const allMomentsOnly = manualMoments;
  const recentMoments = [...allMomentsOnly]
    .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 3);

  const handleMomentPress = (id: string) => {
    router.push(`/modal/moment-detail?id=${id}`);
  };

  const handleMilestonePress = (id: string) => {
    router.push(`/modal/milestone?id=${id}`);
  };

  const renderMomentItem = useCallback(
    ({ item }: { item: Moment }) => (
      <TouchableOpacity
        style={[styles.momentCard, { backgroundColor: colors.surface }]}
        onPress={() => handleMomentPress(item.id)}
        activeOpacity={0.8}
      >
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.momentImage} />
        )}
        <Text style={[styles.momentDate, { color: colors.textSecondary }]}>
          {formatDateLabel(item.createdAt)}
        </Text>
        <Text
          style={[styles.momentText, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title ?? item.note ?? ''}
        </Text>
      </TouchableOpacity>
    ),
    [colors]
  );

  /** Emphasis level for final countdown milestones (by title). */
  const getMilestoneEmphasis = useCallback((title: string): 'normal' | 'subtle' | 'strong' | 'celebratory' | 'due-date' => {
    if (title.includes('Due Date')) return 'due-date';
    if (title.includes('1 Day to Go')) return 'celebratory';
    if (title.includes('5 Days to Go')) return 'strong';
    if (title.includes('10 Days to Go')) return 'subtle';
    return 'normal';
  }, []);

  const renderMilestoneItem = useCallback(
    ({ item }: { item: Milestone }) => {
      const hasLinked =
        (item.linkedMomentIds?.length ?? 0) > 0 ||
        (currentPregnancy?.moments.some((mom) => mom.type === 'moment' && mom.linkedMilestoneId === item.id) ?? false);
      const dateState = getMilestoneDateState(item.milestoneDate);
      const emphasis = getMilestoneEmphasis(item.title);

      const isCompleted = dateState === 'past';
      const isToday = dateState === 'today';

      let entryStyle = { borderBottomColor: colors.accent };
      let circleBg = hasLinked ? colors.primary : colors.textSecondary;
      let titleStyle = { color: colors.text };
      let bgStyle = undefined;

      if (isCompleted) {
        entryStyle = { ...entryStyle, opacity: 0.7 };
        titleStyle = { ...titleStyle, opacity: 0.85 };
      } else if (isToday) {
        bgStyle = { backgroundColor: colors.primary + '15' };
        titleStyle = { ...titleStyle, fontWeight: '800' as const };
      }

      if (emphasis === 'subtle' && !isCompleted) {
        titleStyle = { ...titleStyle, fontWeight: '700' as const };
      } else if (emphasis === 'strong' && !isCompleted) {
        entryStyle = { ...entryStyle, borderLeftWidth: 4, borderLeftColor: colors.primary };
        titleStyle = { ...titleStyle, fontWeight: '800' as const };
      } else if (emphasis === 'celebratory' && !isCompleted) {
        entryStyle = { ...entryStyle, borderLeftWidth: 4, borderLeftColor: colors.accent };
        titleStyle = { ...titleStyle, fontWeight: '800' as const, color: colors.primary };
        bgStyle = bgStyle ?? { backgroundColor: colors.primary + '12' };
      } else if (emphasis === 'due-date' && !isCompleted) {
        circleBg = colors.accent;
        titleStyle = { ...titleStyle, fontWeight: '800' as const, color: colors.accent };
        bgStyle = bgStyle ?? { backgroundColor: colors.accent + '18' };
      }

      return (
        <TouchableOpacity
          style={[
            styles.milestoneEntry,
            entryStyle,
            bgStyle,
          ]}
          onPress={() => handleMilestonePress(item.id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.milestoneCircle,
              { backgroundColor: circleBg },
              emphasis === 'due-date' && !isCompleted && { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            {emphasis === 'due-date' && !isCompleted && (
              <Ionicons name="balloon" size={24} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.milestoneContent}>
            <Text style={[styles.milestoneTitle, titleStyle]}>
              {item.title}
            </Text>
            <Text style={[styles.milestoneDate, { color: colors.textSecondary }]}>
              {formatDateLabel(item.milestoneDate)}
            </Text>
            <Text style={[styles.milestoneAdd, { color: colors.textSecondary }]}>
              Add a memory
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [colors, currentPregnancy, getMilestoneEmphasis]
  );

  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary, padding: 20 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>Your Pregnancy Journey</Text>
        <Text style={styles.headerSubtitle}>
          Every moment, memory and milestone in one place.
        </Text>

        {(hasMultiplePregnancies || !activePregnancy) && (
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Select journey:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {!activePregnancy && (
                <TouchableOpacity
                  style={[styles.dropdownItem, styles.dropdownItemSelected]}
                  onPress={() => {
                    const defaultDue = new Date();
                    defaultDue.setMonth(defaultDue.getMonth() + 6);
                    const defaultStart = new Date(defaultDue);
                    defaultStart.setDate(defaultStart.getDate() - 280);
                    const dueIso = defaultDue.toISOString();
                    const startIso = defaultStart.toISOString();
                    updateProfile({
                      dueDate: dueIso,
                      startDate: startIso,
                      countdownStarted: true,
                    });
                    createNewPregnancy({
                      ...profile,
                      dueDate: dueIso,
                      startDate: startIso,
                    });
                  }}
                >
                  <Text style={[styles.dropdownItemText, styles.dropdownItemTextSelected]}>
                    + Create New Pregnancy
                  </Text>
                </TouchableOpacity>
              )}
              {pregnancies.map((p) => {
                const isActive = p.status === 'active';
                const isSelected = p.id === selectedPregnancyId;
                const label = isActive
                  ? 'Current Pregnancy'
                  : `Previous (${formatDateLabel(p.dueDate)})`;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                    ]}
                    onPress={() => setSelectedPregnancyId(p.id)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={() => router.push('/modal/add-moment')}
            activeOpacity={0.8}
            style={styles.ctaButtonWrapper}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>+ Add a Moment</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={[styles.ctaHelper, { color: colors.textSecondary }]}>
            Photo, note or memory from today
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Moments
          </Text>

          {recentMoments.length === 0 ? (
            <View
              style={[
                styles.placeholderCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.accent,
                },
              ]}
            >
              <Text
                style={[styles.placeholderText, { color: colors.textSecondary }]}
              >
                Your story starts with the first moment you save.
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                data={recentMoments}
                keyExtractor={(item) => item.id}
                renderItem={renderMomentItem}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              />
              {allMomentsOnly.length > 3 && (
                <TouchableOpacity
                  style={[styles.viewAllBtn, { borderColor: colors.primary }]}
                  onPress={() => router.push('/modal/all-moments')}
                >
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>
                    View All Moments
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Milestones
          </Text>
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.text,
              },
            ]}
          >
            <Text style={[styles.infoBoxText, { color: colors.text }]}>
              Milestones are created automatically based on your due date. All
              milestones (past, current, and future) are shown here. You can add
              photos or memories to any milestone, even if it already passed.
            </Text>
          </View>

          {currentPregnancy && (
            <View
              style={[
                styles.milestoneContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.accent,
                },
              ]}
            >
              <FlatList
                data={currentPregnancy.milestones.filter((m): m is Milestone => m.type === 'milestone')}
                keyExtractor={(item) => item.id}
                renderItem={renderMilestoneItem}
                scrollEnabled={false}
                ItemSeparatorComponent={null}
              />
            </View>
          )}
        </View>

        <View
          style={[
            styles.lowerInfoBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.text,
            },
          ]}
        >
          <Text style={[styles.lowerInfoText, { color: colors.text }]}>
            All milestones and moments will later come together in a beautiful
            pregnancy timeline or video.
          </Text>
        </View>

        <View style={styles.finalSection}>
          <Text style={[styles.finalTitle, { color: colors.text }]}>
            Your story will grow with you
          </Text>
          <Text style={[styles.finalText, { color: colors.textSecondary }]}>
            Soon you'll be able to relive your journey as a beautiful timeline or
            video.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
  },
  dropdownWrapper: {
    marginTop: 16,
  },
  dropdownLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 6,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 8,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  ctaSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  ctaButtonWrapper: {
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  ctaHelper: {
    fontSize: 13,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  placeholderCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 15,
    textAlign: 'center',
  },
  momentCard: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  momentImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  momentDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  momentText: {
    fontSize: 14,
  },
  viewAllBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  infoBoxText: {
    fontSize: 14,
    lineHeight: 22,
  },
  milestoneContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  milestoneEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  milestoneCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 13,
    marginBottom: 2,
  },
  milestoneAdd: {
    fontSize: 12,
  },
  lowerInfoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 40,
  },
  lowerInfoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  finalSection: {
    marginBottom: 24,
  },
  finalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  finalText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 100,
  },
});
