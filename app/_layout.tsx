import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal/add-moment"
          options={{ presentation: 'modal', headerShown: true, title: 'Add Moment' }}
        />
        <Stack.Screen
          name="modal/moment-detail"
          options={{ presentation: 'modal', headerShown: true, title: 'Moment' }}
        />
        <Stack.Screen
          name="modal/milestone"
          options={{ presentation: 'modal', headerShown: true, title: 'Milestone' }}
        />
        <Stack.Screen
          name="modal/all-moments"
          options={{ presentation: 'modal', headerShown: true, title: 'All Moments' }}
        />
      </Stack>
    </AppProvider>
  );
}
