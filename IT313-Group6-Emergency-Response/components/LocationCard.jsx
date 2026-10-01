/**
 * ============================================================================
 * MEMBER 2 - LOCATION CARD COMPONENT (components/LocationCard.jsx)
 * ============================================================================
 * 
 * Project: Community Emergency Response Assistant (IT313)
 * Owner: Member 2 (GPS / Location + Location Permission Handling)
 * Architecture Layer: Presentation Component Layer
 * 
 * Flow:
 * LocationCard (UI) -> services/location.js -> expo-location -> Device GPS
 * 
 * Oral Defense Explanation:
 * - This reusable card presents GPS telemetry to the user.
 * - Receives at least TWO props: `latitude` and `longitude`.
 * - Also supports optional props: `loading`, `errorMessage`, `onLocationUpdate`.
 * - If coordinates are passed as props, it displays them directly.
 * - If coordinates are not yet available, user can tap "Get Current Location"
 *   to trigger `getCurrentLocation()` in `services/location.js`.
 * - Clearly handles and displays 3 critical state messages:
 *     1. Location is loading (ActivityIndicator + "Location is loading...")
 *     2. Permission is denied ("Location permission was denied...")
 *     3. Location cannot be obtained ("Location cannot be obtained...")
 */

import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCurrentLocation } from '../services/location';

export default function LocationCard({
  latitude,
  longitude,
  address,
  loading = false,
  errorMessage = null,
  autoFetch = true,
  onLocationUpdate,
}) {
  // Internal state when component manages its own location fetch
  const [internalCoords, setInternalCoords] = useState(null);
  const [internalAddress, setInternalAddress] = useState(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(null);

  // Effective values: external props take precedence over internal state
  const effectiveLoading = loading || internalLoading;
  const effectiveLat = latitude !== undefined && latitude !== null ? latitude : internalCoords?.latitude;
  const effectiveLng = longitude !== undefined && longitude !== null ? longitude : internalCoords?.longitude;
  const effectiveAddress = address || internalAddress;
  const effectiveError = errorMessage || internalError;

  // Handler calling Member 2's location service
  const handleFetchLocation = async () => {
    setInternalLoading(true);
    setInternalError(null);

    const result = await getCurrentLocation();

    if (result.success) {
      setInternalCoords({
        latitude: result.latitude,
        longitude: result.longitude,
      });
      setInternalAddress(result.address || null);
      if (typeof onLocationUpdate === 'function') {
        onLocationUpdate(result);
      }
    } else {
      setInternalError(result.error);
    }

    setInternalLoading(false);
  };

  // Auto-fetch GPS coordinates on mount if coordinates not provided
  useEffect(() => {
    if (autoFetch && latitude === undefined && longitude === undefined) {
      handleFetchLocation();
    }
  }, [autoFetch, latitude, longitude]);

  const hasCoords =
    effectiveLat !== undefined &&
    effectiveLat !== null &&
    effectiveLng !== undefined &&
    effectiveLng !== null;

  const isPermissionDenied =
    effectiveError && effectiveError.toLowerCase().includes('permission');

  return (
    <View style={styles.card}>
      {/* Header with Title and GPS Badge */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.title}>Current Location</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GPS</Text>
        </View>
      </View>

      {/* State 1: Location is Loading */}
      {effectiveLoading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color="#0284C7" />
          <Text style={styles.loadingText}>Location is loading...</Text>
        </View>
      )}

      {/* State 2: Error / Permission Denied */}
      {!effectiveLoading && effectiveError && (
        <View
          style={[
            styles.messageBox,
            isPermissionDenied ? styles.deniedBox : styles.errorBox,
          ]}
        >
          <Text style={styles.statusEmoji}>
            {isPermissionDenied ? '🔒' : '⚠️'}
          </Text>
          <Text
            style={[
              styles.messageText,
              isPermissionDenied ? styles.deniedText : styles.errorText,
            ]}
          >
            {effectiveError}
          </Text>
        </View>
      )}

      {/* State 3: Coordinates Available */}
      {!effectiveLoading && hasCoords && (
        <View style={styles.coordsContainer}>
          <View style={styles.coordRow}>
            <Text style={styles.coordLabel}>Latitude:</Text>
            <Text style={styles.coordValue}>
              {typeof effectiveLat === 'number' ? effectiveLat.toFixed(6) : effectiveLat}
            </Text>
          </View>
          <View style={styles.coordRow}>
            <Text style={styles.coordLabel}>Longitude:</Text>
            <Text style={styles.coordValue}>
              {typeof effectiveLng === 'number' ? effectiveLng.toFixed(6) : effectiveLng}
            </Text>
          </View>
          {effectiveAddress ? (
            <View style={styles.addressBox}>
              <Text style={styles.addressLabel}>Address / Area:</Text>
              <Text style={styles.addressValue}>{effectiveAddress}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* State 4: Location cannot be obtained / initial placeholder */}
      {!effectiveLoading && !effectiveError && !hasCoords && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Location cannot be obtained.</Text>
          <Text style={styles.emptySubtext}>
            Please request GPS coordinates to attach your location to this report.
          </Text>
        </View>
      )}

      {/* Action Button: Triggers services/location.js */}
      <TouchableOpacity
        style={[styles.button, effectiveLoading && styles.buttonDisabled]}
        onPress={handleFetchLocation}
        disabled={effectiveLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {effectiveLoading
            ? 'Acquiring GPS Signal...'
            : hasCoords
            ? 'Refresh Location'
            : 'Get Current Location'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderLeftWidth: 5,
    borderLeftColor: '#0284C7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0369A1',
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  stateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  coordsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  coordLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  coordValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  addressBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0F2FE',
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 2,
  },
  addressValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 18,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  deniedBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  errorBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  statusEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  deniedText: {
    color: '#991B1B',
  },
  errorText: {
    color: '#92400E',
  },
  emptyContainer: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
