import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * ============================================================================
 * MEMBER 3 - CAMERA / PHOTO EVIDENCE COMPONENT (Integration Area)
 * ============================================================================
 * 
 * Owner: Member 3
 * File: components/EvidenceCard.jsx
 * Service: services/camera.js
 * 
 * Purpose:
 * Allows user to capture incident photos, preview visual evidence, and attach
 * camera data to the emergency dispatch payload. Member 3 will implement camera
 * hardware access, permissions, and image capture logic in services/camera.js.
 * 
 * Member 1 Integration Note:
 * This placeholder component ensures the application compiles cleanly and
 * provides a seamless drop-in target when Member 3 completes their feature.
 */
export default function EvidenceCard({
  hasPhoto = false,
  photoUri = null,
  onCapturePress,
  onClearPress,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>📷</Text>
          <Text style={styles.title}>Photo Evidence (Camera)</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MEMBER 3 READY</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.captureArea}
        activeOpacity={0.8}
        onPress={onCapturePress}
      >
        <Text style={styles.cameraIcon}>📸</Text>
        <Text style={styles.captureTitle}>
          {hasPhoto ? 'Photo Evidence Attached' : 'Capture Incident Photo'}
        </Text>
        <Text style={styles.captureSubtitle}>
          {hasPhoto
            ? 'Tap to retake photo evidence'
            : 'Tap to open camera & document emergency scene'}
        </Text>
      </TouchableOpacity>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          📷 Member 3 Integration Point: EvidenceCard.jsx & services/camera.js
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderLeftWidth: 5,
    borderLeftColor: '#EA580C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  captureArea: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FDBA74',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  cameraIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  captureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412',
  },
  captureSubtitle: {
    fontSize: 11,
    color: '#C2410C',
    marginTop: 2,
    textAlign: 'center',
  },
  noteBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 11,
    color: '#C2410C',
    fontWeight: '600',
  },
});
