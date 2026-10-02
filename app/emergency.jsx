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

// Reusable Presentation Components (Member 1)
import EmergencyButton from '../components/EmergencyButton';
import StatusCard from '../components/StatusCard';
import EmergencyContact from '../components/EmergencyContact';

// Member 3 - Camera / Photo Evidence Component
import EvidenceCard from '../components/EvidenceCard';

/**
 * Emergency Screen (app/emergency.jsx)
 * 
 * Role (Member 1 - Presentation Layer & Main Navigation):
 * Serves as the main container for the emergency features.
 * Contains clearly marked placeholder integration sections where
 * Members 2, 3, and 4 will connect their respective components.
 */
export default function EmergencyScreen() {
  // ----------------------------------------------------
  // Local State (Member 1 UI Presentation)
  // ----------------------------------------------------
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alertType, setAlertType] = useState('CRITICAL');

  // Member 3 - Camera / Photo Evidence State
  const [photoUri, setPhotoUri] = useState(null);

  const handleBroadcastAlert = () => {
    setIsAlertActive(true);
    Alert.alert(
      '🚨 SOS BROADCAST TRIGGERED',
      'Simulated emergency alert dispatched to local responder network.',
      [{ text: 'OK' }]
    );
  };

  const handleCancelAlert = () => {
    setIsAlertActive(false);
    Alert.alert('Alert Deactivated', 'Emergency broadcast has been cancelled.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#7F1D1D" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergency Response</Text>
          <Text style={styles.headerSubtitle}>
            Incident Dispatch & Telemetry Container
          </Text>
        </View>

        {/* Live SOS Banner (Active State) */}
        {isAlertActive ? (
          <View style={styles.activeAlertBanner}>
            <Text style={styles.activeAlertTitle}>🚨 ACTIVE SOS BROADCAST</Text>
            <Text style={styles.activeAlertSub}>
              Simulated emergency signal is actively broadcasting.
            </Text>
          </View>
        ) : null}

        {/* ============================================================ */}
        {/* 1. EMERGENCY STATUS PLACEHOLDER                               */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Emergency Status</Text>
          <StatusCard
            title="Incident Status"
            value={isAlertActive ? "ALERT ACTIVE - BROADCASTING" : "STANDBY - READY"}
            statusType={isAlertActive ? "danger" : "safe"}
            icon="🛡️"
            badge="STATUS PLACEHOLDER"
            description="Visual status indicator for current emergency state."
          />
        </View>

        {/* ============================================================ */}
        {/* 2. EMERGENCY CONTACT PLACEHOLDER                              */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Emergency Contact</Text>
          <EmergencyContact
            name="Barangay Command Center"
            category="Priority Dispatch"
            phone="911 / (032) 231-1234"
            availability="24/7 Hotline"
            icon="📞"
            onCall={() => Alert.alert('Contact', 'Simulated call to Barangay Command Center.')}
            onMessage={() => Alert.alert('Alert', 'Simulated SMS alert to Barangay.')}
          />
        </View>

        {/* ============================================================ */}
        {/* 3. MEMBER 2 - LOCATION FEATURE                                */}
        {/* ============================================================ */}
        {/* MEMBER 2: Replace this placeholder with <LocationCard />      */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current Location (Member 2)</Text>
          <View style={styles.integrationCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📍</Text>
              <Text style={styles.cardTitle}>Location Telemetry</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>MEMBER 2</Text>
              </View>
            </View>
            <Text style={styles.placeholderValue}>
              [ Member 2 - Location Placeholder ]
            </Text>
            <Text style={styles.placeholderNotes}>
              Integration Point: Connect GPS / LocationCard / location.js here.
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 4. MEMBER 3 - CAMERA / EVIDENCE FEATURE                       */}
        {/* ============================================================ */}
        {/* MEMBER 3: EvidenceCard integrated — camera.js + EvidenceCard  */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Photo Evidence (Member 3)</Text>
          <EvidenceCard
            imageUri={photoUri}
            onCapture={(uri) => setPhotoUri(uri)}
            onRemove={() => setPhotoUri(null)}
            title="Photo Evidence"
            subtitle="Capture incident scene for emergency responders"
            allowLibrary={true}
          />
        </View>

        {/* ============================================================ */}
        {/* 5. MEMBER 4 - SENSOR FEATURE                                  */}
        {/* ============================================================ */}
        {/* MEMBER 4: Replace this placeholder with <SensorDisplay />     */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sensor Information (Member 4)</Text>
          <View style={styles.integrationCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>⚡</Text>
              <Text style={styles.cardTitle}>Sensor Telemetry</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>MEMBER 4</Text>
              </View>
            </View>
            <Text style={styles.placeholderValue}>
              [ Member 4 - Sensor Placeholder ]
            </Text>
            <Text style={styles.placeholderNotes}>
              Integration Point: Connect Accelerometer/Gyroscope / SensorDisplay / sensor.js here.
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 6. STORAGE FEATURE                                            */}
        {/* ============================================================ */}
        {/* STORAGE: Replace this placeholder with storage.js data hook   */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Saved Emergency Information</Text>
          <View style={styles.integrationCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💾</Text>
              <Text style={styles.cardTitle}>Saved Emergency Data</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>STORAGE</Text>
              </View>
            </View>
            <Text style={styles.placeholderValue}>
              [ Storage Placeholder ]
            </Text>
            <Text style={styles.placeholderNotes}>
              Integration Point: Connect AsyncStorage / SecureStore / storage.js here.
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <View style={styles.actionSection}>
          {!isAlertActive ? (
            <EmergencyButton
              title="BROADCAST EMERGENCY ALERT"
              subtitle="Signal all connected community responders"
              variant="sos"
              icon="🚨"
              size="large"
              onPress={handleBroadcastAlert}
            />
          ) : (
            <EmergencyButton
              title="CANCEL ACTIVE SOS SIGNAL"
              subtitle="Press to end emergency broadcast"
              variant="secondary"
              icon="🛑"
              size="large"
              onPress={handleCancelAlert}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7F1D1D',
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  header: {
    backgroundColor: '#7F1D1D',
    marginHorizontal: -16,
    marginTop: -14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FECACA',
    marginTop: 2,
  },
  activeAlertBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  activeAlertTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  activeAlertSub: {
    color: '#FEE2E2',
    fontSize: 12,
    marginTop: 2,
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
  integrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  memberBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
  },
  placeholderValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  placeholderNotes: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  actionSection: {
    marginVertical: 10,
  },
});
