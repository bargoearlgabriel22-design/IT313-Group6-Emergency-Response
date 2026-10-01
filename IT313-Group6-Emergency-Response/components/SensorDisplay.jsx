import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * ============================================================================
 * MEMBER 4 - SENSOR & STORAGE COMPONENT (Integration Area)
 * ============================================================================
 * 
 * Owner: Member 4
 * File: components/SensorDisplay.jsx
 * Services: services/sensor.js, services/storage.js
 * 
 * Purpose:
 * Displays hardware sensor data (accelerometer / motion / shake impact)
 * and shows saved offline emergency information stored via local storage.
 * Member 4 will implement sensor reading logic in services/sensor.js and
 * offline storage logic in services/storage.js.
 * 
 * Member 1 Integration Note:
 * This placeholder component ensures the application compiles cleanly and
 * provides a seamless drop-in target when Member 4 completes their feature.
 */
export default function SensorDisplay({
  sensorStatus = 'Active / Monitoring',
  impactDetected = 'No Impact Detected',
  shakeCount = 0,
  savedReportsCount = 0,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>⚡</Text>
          <Text style={styles.title}>Sensor & Storage Monitor</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MEMBER 4 READY</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Sensor Status</Text>
          <Text style={styles.gridValue}>{sensorStatus}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Motion / Shake</Text>
          <Text style={styles.gridValue}>{shakeCount} Events</Text>
        </View>
      </View>

      <View style={styles.storageRow}>
        <Text style={styles.storageLabel}>💾 Saved Offline Incidents:</Text>
        <Text style={styles.storageValue}>{savedReportsCount} Logged</Text>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          ⚡ Member 4 Integration: SensorDisplay.jsx, services/sensor.js & services/storage.js
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
    borderColor: '#DDD6FE',
    borderLeftWidth: 5,
    borderLeftColor: '#7C3AED',
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
    color: '#6D28D9',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 8,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6D28D9',
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1B4B',
    marginTop: 2,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 2,
  },
  storageLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  storageValue: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 11,
    color: '#6D28D9',
    fontWeight: '600',
  },
});
