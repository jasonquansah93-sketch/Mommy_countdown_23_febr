import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesign } from '../context/DesignContext';
import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'hourglass',
  journey: 'leaf',
  design: 'color-palette',
  profile: 'person',
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  journey: 'Journey',
  design: 'Design',
  profile: 'Profile',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useDesign();
  const router = useRouter();

  const leftTabs = state.routes.slice(0, 2);
  const rightTabs = state.routes.slice(2, 4);

  const renderTab = (route: (typeof state.routes)[number], index: number) => {
    const realIndex = state.routes.indexOf(route);
    const isFocused = state.index === realIndex;
    const iconName = TAB_ICONS[route.name] || 'ellipse';

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={{ selected: isFocused === true }}
        accessibilityLabel={TAB_LABELS[route.name]}
        onPress={() => navigation.navigate(route.name)}
        style={styles.tab}
      >
        <Ionicons
          name={isFocused ? iconName : (`${iconName}-outline` as keyof typeof Ionicons.glyphMap)}
          size={24}
          color={isFocused ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.accent }]}>
      {leftTabs.map(renderTab)}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={[styles.centerButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/modal/add-moment')}
          accessibilityLabel="Add moment"
        >
          <Ionicons name="camera" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {rightTabs.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
