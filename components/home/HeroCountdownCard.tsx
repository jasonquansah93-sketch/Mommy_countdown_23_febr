import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import { getResolvedFontFamily } from '../../constants/fonts';
import { getContrastingTextColor } from '../../utils/contrast';
import { usePremium } from '../../context/PremiumContext';
import { getWeeksAndDays, getTimeUntilDueMs } from '../../utils/date';
import GradientButton from './GradientButton';
import { useRouter } from 'expo-router';

// Default soft baby background
const DEFAULT_BG = require('../../assets/baby-bg.png');

// Display modes for countdown
type CountdownMode = 'weeks' | 'detailed';

interface Props {
  onScrollToDetails?: () => void;
}

export default function HeroCountdownCard({ onScrollToDetails }: Props) {
  const { profile } = useProfile();
  const { colors, design } = useDesign();
  const { isPremium } = usePremium();
  const router = useRouter();

  const { weeks, days } = getWeeksAndDays(profile.dueDate);
  const [time, setTime] = useState(getTimeUntilDueMs(profile.dueDate));
  const countdownStarted = profile.countdownStarted === true;

  // Mode state: 'weeks' = WEEKS|DAYS|HOURS, 'detailed' = MIN|SEC|MS as primary
  const [displayMode, setDisplayMode] = useState<CountdownMode>('weeks');

  useEffect(() => {
    if (!countdownStarted) return;
    const interval = setInterval(() => {
      setTime(getTimeUntilDueMs(profile.dueDate));
    }, 100);
    return () => clearInterval(interval);
  }, [profile.dueDate, countdownStarted]);

  const genderLabel =
    profile.gender === 'boy'
      ? "IT'S A BOY"
      : profile.gender === 'girl'
        ? "IT'S A GIRL"
        : "IT'S A SURPRISE";

  const displayFont = getResolvedFontFamily(design.fontFamily);
  const showGenderBadge = !design.hideGenderLabel;

  const mode = design.textColorMode ?? 'auto';
  const customColor = design.customTextColor;
  const badgeBg = '#FFFFFF';
  const contentBg = colors.background;
  const badgeTextColor = getContrastingTextColor(badgeBg, mode, customColor);
  const contentTextColor = getContrastingTextColor(contentBg, mode, customColor);

  const handleShare = () => {
    const msg = `Only ${weeks} weeks and ${days} days until we meet our baby! 💕`;
    Share.share({ message: msg });
  };

  // In STATE A: scroll DOWN to Pregnancy Details section (does NOT start countdown)
  const handleScrollToDetails = () => {
    onScrollToDetails?.();
  };

  // Toggle between display modes
  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === 'weeks' ? 'detailed' : 'weeks');
  };

  const hasCustomBg = design.backgroundPhoto != null;
  const bgSource = hasCustomBg ? { uri: design.backgroundPhoto } : DEFAULT_BG;

  const cardInner = (
    <View style={styles.innerCard}>
      {/* Blur/light overlay on background image */}
      <View style={styles.blurOverlay} />

      {/* Top row: gender badge + premium + edit */}
      <View style={styles.topRow}>
        {showGenderBadge && (
          <View style={styles.genderBadge}>
            <Text style={[styles.genderText, { color: badgeTextColor, fontFamily: displayFont }]}>
              {genderLabel}
            </Text>
          </View>
        )}
        <View style={styles.topRight}>
          {isPremium === true && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={12} color={colors.primary} />
              <Text style={[styles.premiumText, { color: colors.primary }]}>Premium</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.editCircle, { backgroundColor: '#FFFFFF' }]}
            onPress={() => router.push('/(tabs)/design')}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color={contentTextColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* STATE A: Not started */}
      {!countdownStarted && (
        <View style={styles.notStartedContent}>
          <Text style={[styles.notStartedTitle, { color: contentTextColor }]}>
            Ready to start?
          </Text>
          <Text style={[styles.notStartedSub, { color: contentTextColor, opacity: 0.85 }]}>
            Set your dates and begin counting down
          </Text>
          <GradientButton
            title="START YOUR COUNTDOWN"
            onPress={handleScrollToDetails}
            style={styles.fullWidthBtn}
          />
        </View>
      )}

      {/* STATE B: Countdown running */}
      {countdownStarted && (
        <>
          <Text style={[styles.subtitle, { color: contentTextColor, fontFamily: displayFont }]}>
            Counting down to meet you...
          </Text>

          {/* Tappable countdown area to switch modes */}
          <TouchableOpacity
            onPress={toggleDisplayMode}
            activeOpacity={0.8}
            style={styles.countdownTouchable}
          >
            {displayMode === 'weeks' ? (
              <>
                {/* Primary: WEEKS | DAYS | HOURS */}
                <View style={styles.primaryRow}>
                  <CountUnit value={String(weeks).padStart(2, '0')} label="WEEKS" color={contentTextColor} />
                  <View style={[styles.divider, { backgroundColor: colors.accent }]} />
                  <CountUnit value={String(days).padStart(2, '0')} label="DAYS" color={contentTextColor} />
                  <View style={[styles.divider, { backgroundColor: colors.accent }]} />
                  <CountUnit value={String(time.hours).padStart(2, '0')} label="HOURS" color={contentTextColor} />
                </View>

                {/* Secondary pill: MIN : SEC : MS */}
                <View style={[styles.secondaryPill, { backgroundColor: colors.background }]}>
                  <SmallUnit value={String(time.minutes).padStart(2, '0')} label="MIN" color={contentTextColor} />
                  <Text style={[styles.colon, { color: contentTextColor }]}>:</Text>
                  <SmallUnit value={String(time.seconds).padStart(2, '0')} label="SEC" color={contentTextColor} />
                  <Text style={[styles.colon, { color: contentTextColor }]}>:</Text>
                  <SmallUnit value={String(time.ms).padStart(2, '0')} label="MS" color={contentTextColor} style={{ opacity: 0.8 }} />
                </View>
              </>
            ) : (
              <>
                {/* Alternative mode: MINUTES | SECONDS | MILLISECONDS as primary */}
                <View style={styles.primaryRow}>
                  <CountUnit
                    value={String(time.totalMinutes).padStart(2, '0')}
                    label="MINUTES"
                    color={contentTextColor}
                  />
                  <View style={[styles.divider, { backgroundColor: colors.accent }]} />
                  <CountUnit
                    value={String(time.seconds).padStart(2, '0')}
                    label="SECONDS"
                    color={contentTextColor}
                  />
                  <View style={[styles.divider, { backgroundColor: colors.accent }]} />
                  <CountUnit
                    value={String(time.ms).padStart(2, '0')}
                    label="MS"
                    color={contentTextColor}
                  />
                </View>

                {/* Secondary: Weeks/Days/Hours */}
                <View style={[styles.secondaryPill, { backgroundColor: colors.background }]}>
                  <SmallUnit value={String(weeks).padStart(2, '0')} label="WKS" color={contentTextColor} />
                  <Text style={[styles.colon, { color: contentTextColor }]}>:</Text>
                  <SmallUnit value={String(days).padStart(2, '0')} label="DAYS" color={contentTextColor} />
                  <Text style={[styles.colon, { color: contentTextColor }]}>:</Text>
                  <SmallUnit value={String(time.hours).padStart(2, '0')} label="HRS" color={contentTextColor} style={{ opacity: 0.8 }} />
                </View>
              </>
            )}
          </TouchableOpacity>

          {/* Mode switch hint */}
          <Text style={[styles.modeHint, { color: colors.textSecondary }]}>
            Tap countdown to switch view
          </Text>

          {/* Share button */}
          <GradientButton
            title="SHARE OUR COUNTDOWN 💛"
            icon="share-outline"
            onPress={handleShare}
            style={styles.fullWidthBtn}
          />
        </>
      )}
    </View>
  );

  const blurVal = hasCustomBg ? (design.blur > 0 ? design.blur : 8) : 4;
  const brightnessOverlayOpacity = hasCustomBg
    ? design.brightness < 100
      ? (100 - design.brightness) / 100
      : design.brightness > 100
        ? (design.brightness - 100) / 100
        : 0
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <ImageBackground
        source={bgSource}
        style={styles.bgFill}
        imageStyle={styles.bgImageRadius}
        blurRadius={blurVal}
        resizeMode="cover"
      >
        {hasCustomBg && brightnessOverlayOpacity > 0 && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor:
                  design.brightness < 100
                    ? `rgba(0,0,0,${brightnessOverlayOpacity})`
                    : `rgba(255,255,255,${brightnessOverlayOpacity})`,
              },
            ]}
            pointerEvents="none"
          />
        )}
        {cardInner}
      </ImageBackground>
    </View>
  );
}

function CountUnit({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.cBlock}>
      <Text style={[styles.cValue, { color }]}>{value}</Text>
      <Text style={[styles.cLabel, { color }]}>{label}</Text>
    </View>
  );
}

function SmallUnit({
  value,
  label,
  color,
  style,
}: {
  value: string;
  label: string;
  color: string;
  style?: object;
}) {
  return (
    <View style={styles.sBlock}>
      <Text style={[styles.sValue, { color }]}>{value}</Text>
      <Text style={[styles.sLabel, { color }, style]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  bgFill: {
    width: '100%',
  },
  bgImageRadius: {
    borderRadius: 20,
  },
  innerCard: {
    padding: 20,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  genderBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  editCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // STATE A
  notStartedContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  notStartedTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  notStartedSub: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  fullWidthBtn: {
    width: '100%',
  },
  // STATE B
  subtitle: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 16,
  },
  cBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  cValue: {
    fontSize: 48,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  cLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
    color: '#888',
  },
  countdownTouchable: {
    alignItems: 'center',
  },
  secondaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  modeHint: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  colon: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 8,
    marginBottom: 14,
  },
  sBlock: {
    alignItems: 'center',
    minWidth: 48,
  },
  sValue: {
    fontSize: 28,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  sLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
    color: '#AAA',
  },
});
