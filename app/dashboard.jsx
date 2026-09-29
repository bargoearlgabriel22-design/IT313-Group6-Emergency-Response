import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

// Reusable Presentation Components (Member 1)
import EmergencyButton from '../components/EmergencyButton';
import StatusCard from '../components/StatusCard';
import EmergencyContact from '../components/EmergencyContact';

/**
 * Home Screen (app/dashboard.jsx)
 * 
 * Role (Member 1 - Presentation Layer & Main Navigation):
 * The central landing and home screen of the application.
 * Contains placeholders for user greeting, emergency status,
 * location, contact, emergency action, and quick access navigation.
 */
export default function HomeScreen() {
  const router = useRouter();

  // ----------------------------------------------------
  // Local State (Member 1 UI Presentation)
  // ----------------------------------------------------
  const [emergencyStatus, setEmergencyStatus] = useState('SAFE'); // 'SAFE' | 'ALERT'
  const [userName, setUserName] = useState('User');

  // ----------------------------------------------------
  // Placeholders for Features Managed by Other Members
  // ----------------------------------------------------
  const placeholderLocation = 'Not available yet';
  const placeholderContact = 'Not available yet';

  // Navigation handlers
  const handleNavigateEmergency = () => {
    router.push('/emergency');
  };

  const handleNavigateProfile = () => {
    router.push('/profile');
  };

  const handleToggleStatus = () => {
    if (emergencyStatus === 'SAFE') {
      setEmergencyStatus('ALERT');
      Alert.alert(
        'Status Simulation',
        'Emergency Status changed to ALERT (Simulated presentation toggle).'
      );
    } else {
      setEmergencyStatus('SAFE');
      Alert.alert(
        'Status Simulation',
        'Emergency Status restored to SAFE.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Title Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Community Emergency</Text>
          <Text style={styles.appSubtitle}>Response Assistant</Text>
        </View>

        {/* User Greeting Card */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingText}>Hello, {userName} 👋</Text>
            <Text style={styles.subGreetingText}>
              Community Safety & Response Hub
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileBadge}
            onPress={handleNavigateProfile}
          >
            <Text style={styles.profileBadgeText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Emergency Status</Text>
          <StatusCard
            title="System Readiness"
            value={emergencyStatus}
            statusType={emergencyStatus === 'SAFE' ? 'safe' : 'danger'}
            icon={emergencyStatus === 'SAFE' ? '🛡️' : '🚨'}
            badge="TAP TO TOGGLE"
            description={
              emergencyStatus === 'SAFE'
                ? 'All emergency community channels are normal.'
                : 'Active emergency simulated in your sector.'
            }
            onPress={handleToggleStatus}
          />
        </View>

        {/* Current Location (Placeholder for Member 2) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current Location</Text>
          <StatusCard
            title="GPS Telemetry (Member 2)"
            value={placeholderLocation}
            statusType="info"
            icon="📍"
            badge="PLACEHOLDER"
            description="GPS / Location API will be connected by Member 2."
          />
        </View>

        {/* Emergency Contact (Placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Emergency Contact</Text>
          <StatusCard
            title="Primary Emergency Contact"
            value={placeholderContact}
            statusType="warning"
            icon="📞"
            badge="PLACEHOLDER"
            description="Contact will be loaded from storage or Member 4."
          />
        </View>

        {/* High-Priority Emergency Action Button */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionLabel}>Emergency Action</Text>
          <EmergencyButton
            title="🚨 TRIGGER EMERGENCY"
            subtitle="Immediate SOS & incident dispatch container"
            variant="sos"
            icon="🚨"
            size="large"
            onPress={handleNavigateEmergency}
          />
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Access</Text>
          <View style={styles.quickAccessRow}>
            <TouchableOpacity
              style={[styles.quickCard, styles.emergencyQuickCard]}
              onPress={handleNavigateEmergency}
              activeOpacity={0.8}
            >
              <Text style={styles.quickCardIcon}>🚨</Text>
              <Text style={styles.quickCardTitle}>View Emergency</Text>
              <Text style={styles.quickCardSub}>Incident Container</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCard, styles.profileQuickCard]}
              onPress={handleNavigateProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.quickCardIcon}>👤</Text>
              <Text style={styles.quickCardTitle}>View Profile</Text>
              <Text style={styles.quickCardSub}>User & ICE Info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Community Hotline Directory Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Standard Response Hotline</Text>
          <EmergencyContact
            name="National Emergency Hotline"
            category="Police, Fire, & Rescue"
            phone="911"
            availability="24/7 Priority"
            icon="📞"
            onCall={() => Alert.alert('Hotline', 'Simulated call to 911.')}
            onMessage={() => Alert.alert('Alert', 'Simulated emergency alert.')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  header: {
    backgroundColor: '#0F172A',
    marginHorizontal: -16,
    marginTop: -14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  greetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  subGreetingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  profileBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  actionSection: {
    marginVertical: 8,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emergencyQuickCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  profileQuickCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  quickCardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
