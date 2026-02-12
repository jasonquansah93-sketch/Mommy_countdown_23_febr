import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useProfile } from '../../context/ProfileContext';
import { useDesign } from '../../context/DesignContext';
import GradientHeader from '../../components/home/GradientHeader';
import HeroCountdownCard from '../../components/home/HeroCountdownCard';
import TimeRemainingCard from '../../components/home/TimeRemainingCard';
import JourneyProgress from '../../components/home/JourneyProgress';
import PregnancyDetailsCard from '../../components/home/PregnancyDetailsCard';
import GenderSelector from '../../components/home/GenderSelector';
import CustomizeCTA from '../../components/home/CustomizeCTA';

// Approximate Y positions for scrolling
const PREGNANCY_DETAILS_Y = 480; // Scroll target for "START YOUR COUNTDOWN" button

export default function HomeScreen() {
  const { isLoaded } = useProfile();
  const { colors } = useDesign();
  const scrollRef = useRef<ScrollView>(null);

  // Scroll to top (used when countdown is started from PregnancyDetailsCard)
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Scroll down to Pregnancy Details section (used when "START YOUR COUNTDOWN" is pressed in Hero)
  const scrollToDetails = () => {
    scrollRef.current?.scrollTo({ y: PREGNANCY_DETAILS_Y, animated: true });
  };

  if (isLoaded === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroCountdownCard onScrollToDetails={scrollToDetails} />
        <TimeRemainingCard />
        <JourneyProgress />
        <PregnancyDetailsCard onCountdownStarted={scrollToTop} />
        <GenderSelector />
        <CustomizeCTA />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
});
