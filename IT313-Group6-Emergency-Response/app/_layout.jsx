import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';

/**
 * ============================================================================
 * MAIN NAVIGATION LAYOUT (app/_layout.jsx)
 * ============================================================================
 * 
 * Layer: Presentation Layer & Main Navigation (Member 1)
 * Purpose: Provides persistent 3-destination bottom tab navigation for the
 *          Community Emergency Response Assistant application.
 * 
 * 3 Main Destinations:
 * 1. 🏠 Home (/dashboard)
 * 2. 🚨 Emergency (/emergency)
 * 3. 👤 Profile (/profile)
 * 
 * Oral Defense Explanation:
 * - Expo Router file-based routing utilizes Tabs layout.
 * - Screen options define consistent styling, active/inactive color indicators,
 *   and hidden helper routes (index redirect).
 */
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* Hidden Root Entry (Redirects to Home/Dashboard) */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hides index from displaying as a 4th tab
        }}
      />

      {/* 1. Home / Dashboard Tab */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Text style={styles.tabIcon}>🏠</Text>
            </View>
          ),
        }}
      />

      {/* 2. Emergency Response Tab */}
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarLabel: 'Emergency',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeEmergencyIcon : styles.iconContainer}>
              <Text style={styles.tabIcon}>🚨</Text>
            </View>
          ),
        }}
      />

      {/* 3. User Profile / ICE Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Text style={styles.tabIcon}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tabIcon: {
    fontSize: 20,
  },
  activeIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  activeEmergencyIcon: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
});
