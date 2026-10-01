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
 * ============================================================================
 * HOME / DASHBOARD SCREEN (app/dashboard.jsx)
 * ============================================================================
 * 
 * Layer: Presentation Layer & Home Dashboard (Member 1)
 * Purpose: Central command and status monitoring dashboard for community members.
 * 
 * Key Features:
 * 1. App Title / Community Greeting
 * 2. Real-time Emergency Status indicator
 * 3. Reusable Emergency Status Card
 * 4. Primary Emergency Contact preview (ICE)
 * 5. Location preview (Member 2 placeholder - no direct GPS logic)
 * 6. High-visibility SOS Action Button linking to Emergency screen
 * 7. Quick access hotlines directory
 * 
 * Oral Defense Explanation:
 * - State is managed locally for status toggle demonstrations.
 * - Hardware features (GPS, Camera, Sensors, Storage) are cleanly separated
 *   and reserved for Members 2, 3, and 4.
 */
export default function DashboardScreen() {
  const router = useRouter();

  // ----------------------------------------------------
  // Local State Management (Member 1 UI Presentation)
  // ----------------------------------------------------
  const [currentStatus, setCurrentStatus] = useState('SAFE'); // 'SAFE' | 'STANDBY' | 'EMERGENCY'
  const [readinessLabel, setReadinessLabel] = useState('All Systems Operational');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // ----------------------------------------------------
  // Placeholders (Hardware features reserved for Members 2-4)
  // ----------------------------------------------------
  const locationPreview = 'Location will be provided by Member 2 (GPS)';
  const sensorPreview = 'Sensor status provided by Member 4';

  // Primary Emergency Contact Data (Local / Placeholder)
  const primaryContact = {
    name: 'Juan Dela Cruz (Primary ICE)',
    phone: '0917-123-4567',
    relationship: 'Parent / Guardian',
    availability: 'Primary Emergency Contact',
    icon: '👤',
  };

  // Hotline Directory Data
  const hotlines = [
    {
      id: '1',
      name: 'National Emergency Dispatch',
      category: 'POLICE',
      role: 'National Police & Rescue',
      phone: '911',
      availability: '24/7 Priority Hotline',
      icon: '🚨',
    },
    {
      id: '2',
      name: 'Barangay Health & Rescue Hub',
      category: 'MEDICAL',
      role: 'Medical & Disaster Unit',
      phone: '(032) 231-1234',
      availability: 'Local Station',
      icon: '🚑',
    },
    {
      id: '3',
      name: 'Bureau of Fire Protection (BFP)',
      category: 'FIRE',
      role: 'Fire & Rescue Squad',
      phone: '(032) 254-7890',
      availability: '24/7 Active Duty',
      icon: '🚒',
    },
  ];

  // Filter hotlines
  const filteredHotlines = hotlines.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  // ----------------------------------------------------
  // UI Event Handlers
  // ----------------------------------------------------
  const handleNavigateToEmergency = () => {
    try {
      router.push('/emergency');
    } catch {
      Alert.alert('Navigation', 'Navigating to Emergency Response Screen...');
    }
  };

  const handleStatusToggle = () => {
    if (currentStatus === 'SAFE') {
      setCurrentStatus('STANDBY');
      setReadinessLabel('Heightened Alert / Standby Mode');
      Alert.alert('Status Updated', 'Community readiness set to STANDBY.');
    } else if (currentStatus === 'STANDBY') {
      setCurrentStatus('EMERGENCY');
      setReadinessLabel('Active Emergency Mode Triggered');
      Alert.alert('Emergency Mode', 'Status switched to ACTIVE EMERGENCY.');
    } else {
      setCurrentStatus('SAFE');
      setReadinessLabel('All Systems Operational');
      Alert.alert('Status Reset', 'Status returned to SAFE.');
    }
  };

  const handleCallAction = (name, phone) => {
    Alert.alert(
      'Emergency Call',
      `Connecting to ${name} (${phone})...\n(Native phone dialer integration).`
    );
  };

  const handleAlertAction = (name) => {
    Alert.alert(
      'Quick Alert Sent',
      `Emergency notification broadcasted to ${name}.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Title & Community Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Community Response</Text>
            <Text style={styles.appSubtitle}>Emergency Assistance Assistant</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              currentStatus === 'SAFE' && styles.pillSafe,
              currentStatus === 'STANDBY' && styles.pillStandby,
              currentStatus === 'EMERGENCY' && styles.pillDanger,
            ]}
          >
            <Text style={styles.statusPillText}>
              {currentStatus === 'SAFE' && '🟢 SAFE'}
              {currentStatus === 'STANDBY' && '🟡 STANDBY'}
              {currentStatus === 'EMERGENCY' && '🔴 EMERGENCY'}
            </Text>
          </View>
        </View>

        {/* Primary High-Priority SOS Action Button */}
        <View style={styles.sosSection}>
          <EmergencyButton
            title="TRIGGER SOS / REPORT EMERGENCY"
            subtitle="Quick access to incident report & dispatch broadcast"
            variant="sos"
            icon="🚨"
            size="large"
            onPress={handleNavigateToEmergency}
          />
        </View>

        {/* Current Emergency Status Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Emergency Status</Text>
          <StatusCard
            title="Community Status"
            value={currentStatus}
            statusType={
              currentStatus === 'SAFE'
                ? 'safe'
                : currentStatus === 'STANDBY'
                ? 'warning'
                : 'danger'
            }
            icon="🛡️"
            badge="TAP TO CYCLE STATUS"
            description={readinessLabel}
            onPress={handleStatusToggle}
          />
        </View>

        {/* Primary Emergency Contact Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Emergency Contact</Text>
          <EmergencyContact
            name={primaryContact.name}
            relationship={primaryContact.relationship}
            phone={primaryContact.phone}
            availability={primaryContact.availability}
            icon={primaryContact.icon}
            onCall={() => handleCallAction(primaryContact.name, primaryContact.phone)}
            onMessage={() => handleAlertAction(primaryContact.name)}
          />
        </View>

        {/* Current Location Preview (Member 2 Placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location Preview</Text>
          <StatusCard
            title="GPS Telemetry (Preview)"
            value={locationPreview}
            statusType="info"
            icon="📍"
            badge="MEMBER 2 AREA"
            description="Hardware location coordinates will be provided by Member 2."
            onPress={() =>
              Alert.alert(
                'Location Feature',
                'Native GPS location tracking is managed by Member 2 in services/location.js.'
              )
            }
          />
        </View>

        {/* Quick Access Hotlines Directory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Emergency Hotlines</Text>

          {/* Filter Row */}
          <View style={styles.filterRow}>
            {['ALL', 'MEDICAL', 'FIRE', 'POLICE'].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.filterTab,
                  activeCategory === cat && styles.activeFilterTab,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeCategory === cat && styles.activeFilterTabText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredHotlines.map((contact) => (
            <EmergencyContact
              key={contact.id}
              name={contact.name}
              relationship={contact.role}
              phone={contact.phone}
              availability={contact.availability}
              icon={contact.icon}
              onCall={() => handleCallAction(contact.name, contact.phone)}
              onMessage={() => handleAlertAction(contact.name)}
            />
          ))}
        </View>

        {/* Quick Nav to Emergency Card */}
        <View style={styles.quickAccessCard}>
          <View style={styles.quickAccessInfo}>
            <Text style={styles.quickAccessTitle}>Need immediate assistance?</Text>
            <Text style={styles.quickAccessDesc}>
              Open the full Emergency screen for multi-feature dispatch.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quickAccessBtn}
            onPress={handleNavigateToEmergency}
          >
            <Text style={styles.quickAccessBtnText}>Open Screen →</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillSafe: {
    backgroundColor: '#DCFCE7',
  },
  pillStandby: {
    backgroundColor: '#FEF3C7',
  },
  pillDanger: {
    backgroundColor: '#FEE2E2',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  sosSection: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 6,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  activeFilterTab: {
    backgroundColor: '#DC2626',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  quickAccessCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickAccessInfo: {
    flex: 1,
    marginRight: 10,
  },
  quickAccessTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quickAccessDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  quickAccessBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  quickAccessBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
