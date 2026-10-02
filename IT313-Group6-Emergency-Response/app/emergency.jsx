import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ============================================================================
// REUSABLE COMPONENTS (MEMBER 1)
// ============================================================================
import EmergencyButton from '../components/EmergencyButton';
import StatusCard from '../components/StatusCard';
import EmergencyContact from '../components/EmergencyContact';

// ============================================================================
// MEMBER INTEGRATION IMPORTS
// ============================================================================
// import LocationCard from '../components/LocationCard';    // MEMBER 2 - LOCATION
// import EvidenceCard from '../components/EvidenceCard';    // MEMBER 3 - CAMERA / PHOTO EVIDENCE
import SensorDisplay from '../components/SensorDisplay';     // MEMBER 4 - SENSOR
import {
  clearEmergencyInformation,
  getEmergencyInformation,
  saveEmergencyInformation,
} from '../services/storage';                                // MEMBER 4 - STORAGE

/**
 * ============================================================================
 * EMERGENCY SCREEN (app/emergency.jsx)
 * ============================================================================
 * 
 * Layer: Presentation Layer & Central Integration Container (Member 1)
 * Purpose: Central emergency dispatch screen coordinating all member modules.
 * 
 * 6 Clearly Separated Sections:
 * 1. Emergency Status
 * 2. Emergency Contact
 * 3. Current Location (Member 2 Integration Area)
 * 4. Photo Evidence (Member 3 Integration Area)
 * 5. Sensor Information (Member 4 Integration Area)
 * 6. Saved Emergency Information (Member 4 Storage Integration Area)
 * 
 * Oral Defense Explanation:
 * - Member 1 owns the presentation layout, UI state, and integration containers.
 * - Hardware APIs and specific services (GPS, Camera, Sensors, AsyncStorage)
 *   are decoupled into standalone components and services owned by Members 2–4.
 */
export default function EmergencyScreen() {
  // ----------------------------------------------------
  // Local State Management (Member 1 UI Presentation)
  // ----------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState('MEDICAL');
  const [severityLevel, setSeverityLevel] = useState('CRITICAL'); // 'MODERATE' | 'HIGH' | 'CRITICAL'
  const [incidentNotes, setIncidentNotes] = useState('');
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [activeAlertTimestamp, setActiveAlertTimestamp] = useState(null);

  // Emergency Incident Categories
  const incidentCategories = [
    { id: 'MEDICAL', label: 'Medical', icon: '🚑', color: '#DC2626' },
    { id: 'FIRE', label: 'Fire', icon: '🚒', color: '#EA580C' },
    { id: 'POLICE', label: 'Police', icon: '👮', color: '#2563EB' },
    { id: 'DISASTER', label: 'Disaster', icon: '🌊', color: '#0891B2' },
    { id: 'ACCIDENT', label: 'Accident', icon: '⚠️', color: '#D97706' },
  ];

  // ----------------------------------------------------
  // UI Event Handlers (Presentation Triggers)
  // ----------------------------------------------------
  const handleBroadcastSOS = () => {
    setIsAlertActive(true);
    const timeString = new Date().toLocaleTimeString();
    setActiveAlertTimestamp(timeString);

    Alert.alert(
      '🚨 EMERGENCY BROADCAST ACTIVATED',
      `Category: ${selectedCategory}\nSeverity: ${severityLevel}\nTime: ${timeString}\nNotes: ${incidentNotes || 'None specified'}\n\nEmergency dispatch signal broadcasted.`,
      [{ text: 'Acknowledged' }]
    );
  };

  const handleDeactivateSOS = () => {
    Alert.alert(
      'Cancel Emergency Alert',
      'Are you sure you want to deactivate the active SOS broadcast?',
      [
        { text: 'Keep Active', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            setIsAlertActive(false);
            setActiveAlertTimestamp(null);
          },
        },
      ]
    );
  };

  const handleCallDispatcher = (contactName, phone) => {
    Alert.alert('Emergency Call', `Initiating call to ${contactName} (${phone}).`);
  };

  // ----------------------------------------------------
  // Member 4 - Local Emergency Information Storage Handlers
  // ----------------------------------------------------
  const [savedEmergencyData, setSavedEmergencyData] = useState(null);
  const [storageStatusMessage, setStorageStatusMessage] = useState('No saved records yet.');

  // Load existing saved emergency information on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getEmergencyInformation();
        if (res.success && res.data) {
          setSavedEmergencyData(res.data);
          setStorageStatusMessage(`Loaded: ${res.data.category || 'Incident'} (${res.data.timestamp || 'Recorded'})`);
        }
      } catch (err) {
        console.warn('Storage initial load error:', err);
      }
    })();
  }, []);

  const handleSaveToStorage = async () => {
    const payload = {
      category: selectedCategory,
      severity: severityLevel,
      notes: incidentNotes || 'No notes specified',
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };

    const res = await saveEmergencyInformation(payload);
    if (res.success) {
      setSavedEmergencyData(payload);
      setStorageStatusMessage(`Saved: ${payload.category} (${payload.timestamp})`);
      Alert.alert(
        '💾 Local Storage Saved',
        `Offline emergency information saved successfully to device storage!\n\nCategory: ${payload.category}\nSeverity: ${payload.severity}\nTime: ${payload.timestamp}\nNotes: ${payload.notes}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Storage Error', res.error || 'Failed to save emergency data.');
    }
  };

  const handleRetrieveFromStorage = async () => {
    const res = await getEmergencyInformation();
    if (res.success && res.data) {
      setSavedEmergencyData(res.data);
      Alert.alert(
        '📂 Stored Emergency Record',
        `Category: ${res.data.category}\nSeverity: ${res.data.severity}\nNotes: ${res.data.notes}\nSaved At: ${res.data.timestamp} (${res.data.date || 'Today'})`,
        [{ text: 'Done' }]
      );
    } else {
      Alert.alert('Offline Storage', 'No saved emergency records found on device.');
    }
  };

  const handleClearStorage = async () => {
    Alert.alert(
      'Clear Stored Data',
      'Are you sure you want to remove the saved emergency information from device storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            const res = await clearEmergencyInformation();
            if (res.success) {
              setSavedEmergencyData(null);
              setStorageStatusMessage('No saved records yet.');
              Alert.alert('Storage Cleared', 'Local emergency information has been removed.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#7F1D1D" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header & Emergency Identifier */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Emergency Central</Text>
            <Text style={styles.headerSubtitle}>
              Incident Reporting & Emergency Dispatch
            </Text>
          </View>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentBadgeText}>URGENT</Text>
          </View>
        </View>

        {/* Active Emergency Broadcast Banner */}
        {isAlertActive ? (
          <View style={styles.activeBanner}>
            <Text style={styles.activeBannerTitle}>🚨 ACTIVE SOS BROADCAST</Text>
            <Text style={styles.activeBannerText}>
              Broadcast initiated at {activeAlertTimestamp} • Severity: {severityLevel}
            </Text>
            <Text style={styles.activeBannerSub}>
              Responders and emergency contacts have been notified.
            </Text>
          </View>
        ) : null}

        {/* ============================================================ */}
        {/* SECTION 1: EMERGENCY STATUS                                  */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>1. Emergency Status</Text>

          <StatusCard
            title="System Alert Status"
            value={isAlertActive ? `ACTIVE SOS: ${selectedCategory}` : 'STANDBY (READY TO BROADCAST)'}
            statusType={isAlertActive ? 'danger' : 'safe'}
            icon="🚨"
            badge={isAlertActive ? 'BROADCASTING' : 'READY'}
            description={
              isAlertActive
                ? `Active emergency signal broadcasting at ${severityLevel} level.`
                : 'Select category and severity below to broadcast emergency response.'
            }
          />

          {/* Incident Category Selector */}
          <Text style={styles.subSectionTitle}>Select Incident Category:</Text>
          <View style={styles.categoryGrid}>
            {incidentCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    isSelected && {
                      borderColor: cat.color,
                      backgroundColor: '#FEF2F2',
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && { color: cat.color, fontWeight: '800' },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Severity Selector */}
          <Text style={styles.subSectionTitle}>Urgency / Severity Level:</Text>
          <View style={styles.severityRow}>
            {['MODERATE', 'HIGH', 'CRITICAL'].map((level) => {
              const isSelected = severityLevel === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityBtn,
                    isSelected && styles.severityBtnActive,
                    isSelected && level === 'CRITICAL' && styles.criticalBtnActive,
                  ]}
                  onPress={() => setSeverityLevel(level)}
                >
                  <Text
                    style={[
                      styles.severityBtnText,
                      isSelected && styles.severityBtnTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Incident Details */}
          <Text style={styles.subSectionTitle}>Incident Notes (Optional):</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe immediate danger, victims, or landmarks..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={incidentNotes}
            onChangeText={setIncidentNotes}
          />
        </View>

        {/* Primary Broadcast / Cancel SOS Button */}
        <View style={styles.actionSection}>
          {!isAlertActive ? (
            <EmergencyButton
              title={`BROADCAST ${selectedCategory} SOS`}
              subtitle="Signal responders with current telemetry payload"
              variant="sos"
              icon="🚨"
              size="large"
              onPress={handleBroadcastSOS}
            />
          ) : (
            <EmergencyButton
              title="CANCEL ACTIVE SOS SIGNAL"
              subtitle="Deactivate broadcast when situation is secured"
              variant="secondary"
              icon="🛑"
              size="large"
              onPress={handleDeactivateSOS}
            />
          )}
        </View>

        {/* ============================================================ */}
        {/* SECTION 2: EMERGENCY CONTACT                                 */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>2. Emergency Contact</Text>
          <EmergencyContact
            name="Maria Dela Cruz (ICE Contact)"
            relationship="Parent / Next of Kin"
            phone="0917-123-4567"
            availability="Primary In Case of Emergency"
            icon="👤"
            onCall={() => handleCallDispatcher('Maria Dela Cruz', '0917-123-4567')}
            onMessage={() =>
              Alert.alert('Alert Sent', 'Sent emergency notification to Maria Dela Cruz.')
            }
          />
          <EmergencyContact
            name="National Emergency Dispatch Desk"
            relationship="Police, Medical & Rescue"
            phone="911"
            availability="24/7 Priority Emergency"
            icon="🚨"
            onCall={() => handleCallDispatcher('911 Dispatch Desk', '911')}
          />
        </View>

        {/* ============================================================ */}
        {/* SECTION 3: CURRENT LOCATION                                  */}
        {/* // MEMBER 2 - LOCATION FEATURE                               */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>3. Current Location</Text>
          {/* 
            MEMBER 2 INTEGRATION POINT:
            When Member 2 completes their feature, import LocationCard:
            import LocationCard from "../components/LocationCard";
            <LocationCard />
          */}
          <StatusCard
            title="GPS Telemetry (LocationCard Integration Area)"
            value="10.3157° N, 123.8854° E (Placeholder)"
            statusType="info"
            icon="📍"
            badge="MEMBER 2 AREA"
            description="Integration point for Member 2 LocationCard component and services/location.js."
          />
        </View>

        {/* ============================================================ */}
        {/* SECTION 4: PHOTO EVIDENCE                                    */}
        {/* // MEMBER 3 - CAMERA / PHOTO EVIDENCE FEATURE                */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>4. Photo Evidence</Text>
          {/* 
            MEMBER 3 INTEGRATION POINT:
            When Member 3 completes their feature, import EvidenceCard:
            import EvidenceCard from "../components/EvidenceCard";
            <EvidenceCard />
          */}
          <StatusCard
            title="Visual Evidence (EvidenceCard Integration Area)"
            value="No Photo Attached (Placeholder)"
            statusType="warning"
            icon="📷"
            badge="MEMBER 3 AREA"
            description="Integration point for Member 3 EvidenceCard component and services/camera.js."
          />
        </View>

        {/* ============================================================ */}
        {/* SECTION 5: SENSOR INFORMATION                                */}
        {/* // MEMBER 4 - SENSOR FEATURE                                 */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>5. Sensor Information</Text>
          <SensorDisplay />
        </View>

        {/* ============================================================ */}
        {/* SECTION 6: SAVED EMERGENCY INFORMATION                       */}
        {/* // MEMBER 4 - STORAGE FEATURE                                */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>6. Saved Emergency Information</Text>
          <View style={styles.storageCard}>
            <View style={styles.storageHeaderRow}>
              <View style={styles.storageTitleRow}>
                <Text style={styles.storageIcon}>💾</Text>
                <Text style={styles.storageTitle}>Offline Incident Storage</Text>
              </View>
              <View
                style={[
                  styles.storageBadge,
                  savedEmergencyData ? styles.storageBadgeActive : styles.storageBadgeEmpty,
                ]}
              >
                <Text
                  style={[
                    styles.storageBadgeText,
                    savedEmergencyData ? styles.storageBadgeTextActive : styles.storageBadgeTextEmpty,
                  ]}
                >
                  {savedEmergencyData ? 'DATA STORED' : 'NO DATA'}
                </Text>
              </View>
            </View>

            <View style={styles.storageDataBox}>
              <Text style={styles.storageDataLabel}>Storage Status:</Text>
              <Text style={styles.storageDataText}>{storageStatusMessage}</Text>
              {savedEmergencyData ? (
                <View style={styles.storageRecordDetails}>
                  <Text style={styles.storageDetailText}>
                    • Category: {savedEmergencyData.category}
                  </Text>
                  <Text style={styles.storageDetailText}>
                    • Severity: {savedEmergencyData.severity}
                  </Text>
                  <Text style={styles.storageDetailText} numberOfLines={2}>
                    • Notes: {savedEmergencyData.notes}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Clickable Actions */}
            <View style={styles.storageBtnRow}>
              <TouchableOpacity
                style={[styles.storageActionBtn, styles.storageSaveBtn]}
                onPress={handleSaveToStorage}
                activeOpacity={0.7}
              >
                <Text style={styles.storageBtnIcon}>💾</Text>
                <Text style={styles.storageSaveBtnText}>Save Info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.storageActionBtn, styles.storageLoadBtn]}
                onPress={handleRetrieveFromStorage}
                activeOpacity={0.7}
              >
                <Text style={styles.storageBtnIcon}>📂</Text>
                <Text style={styles.storageLoadBtnText}>Retrieve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.storageActionBtn, styles.storageClearBtn]}
                onPress={handleClearStorage}
                activeOpacity={0.7}
              >
                <Text style={styles.storageBtnIcon}>🗑️</Text>
                <Text style={styles.storageClearBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Safety Instructions Card */}
        <View style={styles.protocolCard}>
          <Text style={styles.protocolTitle}>📋 Emergency Protocol Summary:</Text>
          <Text style={styles.protocolItem}>• Step 1: Ensure immediate physical safety.</Text>
          <Text style={styles.protocolItem}>• Step 2: Broadcast SOS signal with category.</Text>
          <Text style={styles.protocolItem}>• Step 3: Keep phone powered on for responder dispatch.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7F1D1D', // Deep Red Theme
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  activeBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FCA5A5',
    alignItems: 'center',
  },
  activeBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  activeBannerText: {
    color: '#FEE2E2',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  activeBannerSub: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  severityBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  severityBtnActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  criticalBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#991B1B',
  },
  severityBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  severityBtnTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  actionSection: {
    marginVertical: 10,
  },
  protocolCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 12,
    marginTop: 6,
  },
  protocolTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 6,
  },
  protocolItem: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  // Member 4 - Storage Card Styles
  storageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderLeftWidth: 5,
    borderLeftColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  storageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
    paddingBottom: 8,
  },
  storageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storageIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#14532D',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  storageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  storageBadgeActive: {
    backgroundColor: '#DCFCE7',
  },
  storageBadgeEmpty: {
    backgroundColor: '#F1F5F9',
  },
  storageBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  storageBadgeTextActive: {
    color: '#16A34A',
  },
  storageBadgeTextEmpty: {
    color: '#64748B',
  },
  storageDataBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  storageDataLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  storageDataText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14532D',
  },
  storageRecordDetails: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
  },
  storageDetailText: {
    fontSize: 12,
    color: '#15803D',
    marginVertical: 1,
  },
  storageBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  storageActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
  },
  storageSaveBtn: {
    backgroundColor: '#16A34A',
  },
  storageLoadBtn: {
    backgroundColor: '#2563EB',
  },
  storageClearBtn: {
    backgroundColor: '#EF4444',
  },
  storageBtnIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  storageSaveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  storageLoadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  storageClearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
