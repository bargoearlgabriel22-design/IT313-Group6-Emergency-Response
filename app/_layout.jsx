import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';

/**
 * Root Navigation Layout (app/_layout.jsx)
 * 
 * Role (Member 1 - Main Navigation):
 * Configures the persistent 3-tab navigation bar for the
 * Community Emergency Response Assistant.
 * 
 * 3 Main Tabs:
 * 1. 🏠 Home (/dashboard)
 * 2. 🚨 Emergency (/emergency)
 * 3. 👤 Profile (/profile)
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
          href: null, // Hides index from showing as a 4th tab
        }}
      />

      {/* 1. Home Tab */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Text style={styles.tabIcon}>🏠</Text>
            </View>
          ),
        }}
      />

      {/* 2. Emergency Tab */}
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarLabel: 'Emergency',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeEmergencyIcon : null}>
              <Text style={styles.tabIcon}>🚨</Text>
            </View>
          ),
        }}
      />

      {/* 3. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
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
