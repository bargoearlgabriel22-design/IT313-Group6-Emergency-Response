import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * ============================================================================
 * MEMBER 2 - LOCATION COMPONENT (Integration Area)
 * ============================================================================
 * 
 * Owner: Member 2
 * File: components/LocationCard.jsx
 * Service: services/location.js
 * 
 * Purpose:
 * Displays GPS coordinates, location status, accuracy, and location refresh
 * controls. Member 2 will implement native GPS location fetching and permissions
 * in services/location.js and use it here.
 * 
 * Member 1 Integration Note:
 * This placeholder component ensures the application compiles cleanly and
 * provides a seamless drop-in target when Member 2 completes their feature.
 */
export default function LocationCard({
  latitude = 10.3157,
  longitude = 123.8854,
  accuracy = '±3m (Simulated)',
  status = 'Ready / Standby',
  timestamp,
}) {
  const displayTime = timestamp || new Date().toLocaleTimeString();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.title}>Current Location (GPS)</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MEMBER 2 READY</Text>
        </View>
      </View>

      <Text style={styles.coordinates}>
        {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
      </Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailText}>Accuracy: {accuracy}</Text>
        <Text style={styles.detailText}>Status: {status}</Text>
      </View>

      <Text style={styles.timestamp}>Last updated: {displayTime}</Text>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          📍 Member 2 Integration Point: LocationCard.jsx & services/location.js
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
    borderColor: '#BAE6FD',
    borderLeftWidth: 5,
    borderLeftColor: '#0284C7',
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
    marginBottom: 6,
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
    color: '#0369A1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  coordinates: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  noteBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '600',
  },
});
