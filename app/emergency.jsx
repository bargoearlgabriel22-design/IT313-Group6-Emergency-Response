import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
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

// Member 3 - Local Storage Service
import {
  saveEmergencyInfo,
  getEmergencyInfo,
  clearEmergencyInfo,
} from '../services/storage';

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

  // Member 3 - Local Storage State
  const [savedInfo, setSavedInfo] = useState(null);
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageError, setStorageError] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);

  // Load saved emergency info when the screen mounts
  useEffect(() => {
    (async () => {
      const result = await getEmergencyInfo();
      setStorageLoading(false);
      if (result.success) {
        setSavedInfo(result.data);
      } else {
        setStorageError(result.error);
      }
    })();
  }, []);

  // Member 3 - Save emergency info (includes current photo if captured)
  const handleSaveEmergencyInfo = async () => {
    setSavingInfo(true);
    setStorageError(null);
    const infoToSave = {
      name: 'Emergency Responder',
      contactNumber: '911',
      address: 'Current Location',
      bloodType: 'O+',
      allergies: 'None',
      notes: 'Community emergency response active.',
      savedAt: new Date().toISOString(),
      // Include captured photo URI so it displays inside the saved card
      photoUri: photoUri || null,
    };
    const result = await saveEmergencyInfo(infoToSave);
    setSavingInfo(false);
    if (result.success) {
      setSavedInfo(infoToSave);
      Alert.alert('✅ Saved', 'Emergency information saved to device storage.');
    } else {
      setStorageError(result.error);
      Alert.alert('❌ Error', result.error || 'Failed to save emergency information.');
    }
  };

  // Member 3 - Clear saved info from storage
  const handleClearEmergencyInfo = async () => {
    const result = await clearEmergencyInfo();
    if (result.success) {
      setSavedInfo(null);
      Alert.alert('🗑️ Cleared', 'Emergency information removed from device storage.');
    } else {
      setStorageError(result.error);
    }
  };

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
            onSelectImage={(uri) => setPhotoUri(uri)}
            onDelete={() => {
              setPhotoUri(null);
              setSavedInfo((prev) => (prev ? { ...prev, photoUri: null } : null));
            }}
            onRemove={() => {
              setPhotoUri(null);
              setSavedInfo((prev) => (prev ? { ...prev, photoUri: null } : null));
            }}
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
        {/* 6. STORAGE FEATURE — Member 3 (storage.js integrated)         */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Saved Emergency Information</Text>
          <View style={styles.storageCard}>

            {/* Header */}
            <View style={styles.storageHeader}>
              <Text style={styles.cardIcon}>💾</Text>
              <Text style={styles.cardTitle}>Emergency Data (storage.js)</Text>
              <View style={[styles.memberBadge, styles.storageBadge]}>
                <Text style={styles.memberBadgeText}>STORAGE</Text>
              </View>
            </View>

            {/* Loading state */}
            {storageLoading ? (
              <Text style={styles.storageStatus}>⏳ Loading saved data…</Text>
            ) : null}

            {/* Storage error */}
            {!storageLoading && storageError ? (
              <Text style={styles.storageErrorText}>⚠️ {storageError}</Text>
            ) : null}

            {/* No data yet */}
            {!storageLoading && !storageError && !savedInfo ? (
              <View style={styles.storageEmptyBox}>
                <Text style={styles.storageEmptyIcon}>📋</Text>
                <Text style={styles.storageEmptyTitle}>No Data Saved Yet</Text>
                <Text style={styles.storageEmptyNote}>
                  Tap "Save" to store emergency information locally on this device.
                </Text>
              </View>
            ) : null}

            {/* Saved data display */}
            {!storageLoading && savedInfo ? (
              <View style={styles.storageDataBox}>
                <View style={styles.storageDataRow}>
                  <Text style={styles.storageDataLabel}>👤 Name</Text>
                  <Text style={styles.storageDataValue}>{savedInfo.name}</Text>
                </View>
                <View style={styles.storageDataRow}>
                  <Text style={styles.storageDataLabel}>📞 Contact</Text>
                  <Text style={styles.storageDataValue}>{savedInfo.contactNumber}</Text>
                </View>
                <View style={styles.storageDataRow}>
                  <Text style={styles.storageDataLabel}>🩸 Blood Type</Text>
                  <Text style={styles.storageDataValue}>{savedInfo.bloodType}</Text>
                </View>
                <View style={styles.storageDataRow}>
                  <Text style={styles.storageDataLabel}>📍 Address</Text>
                  <Text style={styles.storageDataValue}>{savedInfo.address}</Text>
                </View>
                {savedInfo.notes ? (
                  <View style={styles.storageDataRow}>
                    <Text style={styles.storageDataLabel}>📝 Notes</Text>
                    <Text style={styles.storageDataValue}>{savedInfo.notes}</Text>
                  </View>
                ) : null}

                {/* ── Photo Evidence preview inside the storage card ── */}
                {savedInfo.photoUri ? (
                  <View style={styles.storagePhotoBox}>
                    <Text style={styles.storagePhotoLabel}>📷 Photo Evidence</Text>
                    <Image
                      source={{ uri: savedInfo.photoUri }}
                      style={styles.storagePhotoPreview}
                      resizeMode="cover"
                    />
                    <Text style={styles.storagePhotoNote}>
                      ✅ Evidence photo linked to this record
                    </Text>
                  </View>
                ) : (
                  <View style={styles.storagePhotoEmptyBox}>
                    <Text style={styles.storagePhotoEmptyText}>
                      📸 No photo attached — capture a photo above and Save Info again.
                    </Text>
                  </View>
                )}

                {savedInfo.savedAt ? (
                  <Text style={styles.storageSavedAt}>
                    ✅ Saved: {new Date(savedInfo.savedAt).toLocaleString()}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {/* Action Buttons */}
            {!storageLoading ? (
              <View style={styles.storageActionRow}>
                <TouchableOpacity
                  style={[styles.storageBtn, styles.storageSaveBtn, savingInfo && styles.storageBtnDisabled]}
                  onPress={handleSaveEmergencyInfo}
                  disabled={savingInfo}
                  activeOpacity={0.8}
                >
                  <Text style={styles.storageSaveBtnText}>
                    {savingInfo ? '⏳ Saving…' : '💾 Save Info'}
                  </Text>
                </TouchableOpacity>
                {savedInfo ? (
                  <TouchableOpacity
                    style={[styles.storageBtn, styles.storageClearBtn]}
                    onPress={handleClearEmergencyInfo}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.storageClearBtnText}>🗑️ Clear</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

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

  // ── Member 3 Storage Card ──
  storageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageBadge: {
    backgroundColor: '#ECFDF5',
  },
  storageStatus: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 12,
  },
  storageErrorText: {
    fontSize: 12,
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  storageEmptyBox: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    marginBottom: 12,
  },
  storageEmptyIcon: { fontSize: 28, marginBottom: 4 },
  storageEmptyTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  storageEmptyNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 16,
  },
  storageDataBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  storageDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  storageDataLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  storageDataValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  storageSavedAt: {
    fontSize: 10,
    color: '#166534',
    marginTop: 8,
    textAlign: 'right',
  },
  storageActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  storageBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  storageSaveBtn: {
    backgroundColor: '#0F172A',
  },
  storageSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  storageBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  storageClearBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  storageClearBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Photo preview inside storage card ──
  storagePhotoBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  storagePhotoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  storagePhotoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#0F172A',
  },
  storagePhotoNote: {
    fontSize: 11,
    color: '#166534',
    marginTop: 6,
  },
  storagePhotoEmptyBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  storagePhotoEmptyText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
});
