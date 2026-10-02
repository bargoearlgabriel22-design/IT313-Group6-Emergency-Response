import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  DEFAULT_SENSOR_INTERVAL_MS,
  SENSOR_TYPE_NAME,
  analyzeSensorReading,
  checkSensorAvailability,
  formatSensorValue,
  subscribeToSensor,
} from '../services/sensor';

/**
 * ============================================================================
 * MEMBER 4 - SENSOR DISPLAY COMPONENT (components/SensorDisplay.jsx)
 * ============================================================================
 * 
 * IT313 Group 6: Community Emergency Response Assistant
 * Owner: Member 4 (Sensor & Local Storage)
 * 
 * Reusable Component Requirements:
 * 1. Must receive at least TWO props:
 *    - `sensorType`: Type name of the sensor being monitored
 *    - `sensorValue`: Current formatted reading value of the sensor
 * 2. Displays:
 *    - "Sensor Information"
 *    - "Sensor Type: ______"
 *    - "Value: ______"
 * 3. Handles:
 *    - Sensor unavailable (e.g. simulator/web fallback)
 *    - Loading state (while initializing sensor hardware)
 *    - Error handling (graceful alert, no app crashes)
 * 4. Architecture:
 *    SensorDisplay (UI) -> services/sensor.js -> Expo Sensors API -> Hardware
 * 
 * Integration:
 * Member 1 can import and drop in:
 * `import SensorDisplay from "../components/SensorDisplay";`
 * `<SensorDisplay />` or `<SensorDisplay sensorType="..." sensorValue="..." />`
 */
export default function SensorDisplay({
  sensorType = SENSOR_TYPE_NAME,
  sensorValue = null,
  isAvailable = null,
  isLoading = false,
  errorMessage = null,
  autoSubscribe = true,
  onToggleMonitoring = null,
}) {
  // --------------------------------------------------------------------------
  // Internal State (used when props are not externally driven)
  // --------------------------------------------------------------------------
  const [internalLoading, setInternalLoading] = useState(isLoading);
  const [internalAvailable, setInternalAvailable] = useState(isAvailable);
  const [internalError, setInternalError] = useState(errorMessage);
  const [internalValue, setInternalValue] = useState(sensorValue);
  const [internalStatus, setInternalStatus] = useState('Standby');
  const [isImpact, setIsImpact] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Sync state if controlled props change
  useEffect(() => {
    if (sensorValue !== null) setInternalValue(sensorValue);
  }, [sensorValue]);

  useEffect(() => {
    if (isAvailable !== null) setInternalAvailable(isAvailable);
  }, [isAvailable]);

  useEffect(() => {
    if (errorMessage !== null) setInternalError(errorMessage);
  }, [errorMessage]);

  // --------------------------------------------------------------------------
  // Lifecycle: Subscribe / Unsubscribe via services/sensor.js
  // --------------------------------------------------------------------------
  useEffect(() => {
    // If external sensorValue is explicitly provided or monitoring is paused, do not auto-subscribe
    if (sensorValue !== null || !autoSubscribe || !isMonitoring) {
      return;
    }

    let unsubscribe = null;
    let isMounted = true;

    setInternalLoading(true);
    setInternalError(null);

    // Step 1: Check sensor availability
    checkSensorAvailability().then(({ available, error }) => {
      if (!isMounted) return;

      setInternalAvailable(available);
      setInternalLoading(false);

      if (!available) {
        setInternalError(error || 'Sensor is unavailable on this device or platform.');
        setInternalValue('Hardware sensor unavailable');
        setInternalStatus('Unavailable');
        return;
      }

      // Step 2: Subscribe to live sensor updates
      unsubscribe = subscribeToSensor(
        (data) => {
          if (!isMounted) return;
          setInternalValue(data.formattedValue);
          setInternalStatus(data.status);
          setIsImpact(data.isImpact);
        },
        (err) => {
          if (!isMounted) return;
          setInternalError(err?.message || 'Error receiving sensor data.');
          setInternalStatus('Error');
        },
        DEFAULT_SENSOR_INTERVAL_MS
      );
    });

    // Cleanup: Unsubscribe when component unmounts or monitoring stops
    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [sensorValue, autoSubscribe, isMonitoring]);

  // --------------------------------------------------------------------------
  // Resolved Display Values
  // --------------------------------------------------------------------------
  const activeLoading = isLoading || internalLoading;
  const activeAvailable = isAvailable !== null ? isAvailable : internalAvailable;
  const activeError = errorMessage || internalError;
  const displayValue = sensorValue !== null
    ? sensorValue
    : internalValue || (activeAvailable === false ? 'Unavailable' : 'Waiting for telemetry...');

  // Toggle monitoring handler (demonstrates unsubscribing on demand)
  const handleToggle = () => {
    if (onToggleMonitoring) {
      onToggleMonitoring(!isMonitoring);
    } else {
      setIsMonitoring((prev) => !prev);
    }
  };

  // Web / Simulation fallback handler (useful for testing when hardware sensor is absent)
  const [simIndex, setSimIndex] = useState(0);
  const handleSimulateReading = () => {
    const samples = [
      { x: 0.05, y: 0.98, z: 0.12, label: 'Stationary / Normal (~1.0G)' },
      { x: 0.85, y: 1.15, z: 0.70, label: 'Active Movement (~1.6G)' },
      { x: 1.95, y: 1.65, z: 1.30, label: 'High Impact / Fall (~2.8G)' },
    ];
    const sample = samples[simIndex % samples.length];
    setSimIndex((prev) => prev + 1);

    const { magnitude, status, isImpact: impactFlag } = analyzeSensorReading(sample.x, sample.y, sample.z);
    setInternalValue(formatSensorValue({ ...sample, magnitude }));
    setInternalStatus(status);
    setIsImpact(impactFlag);
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.headerIcon}>⚡</Text>
          <Text style={styles.cardTitle}>Sensor Information</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            activeError
              ? styles.badgeError
              : activeAvailable === false
              ? styles.badgeUnavailable
              : isImpact
              ? styles.badgeImpact
              : styles.badgeActive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              activeError
                ? styles.badgeTextError
                : activeAvailable === false
                ? styles.badgeTextUnavailable
                : isImpact
                ? styles.badgeTextImpact
                : styles.badgeTextActive,
            ]}
          >
            {activeError
              ? 'ERROR'
              : activeAvailable === false
              ? 'UNAVAILABLE'
              : isImpact
              ? 'IMPACT DETECTED'
              : isMonitoring
              ? 'MONITORING'
              : 'PAUSED'}
          </Text>
        </View>
      </View>

      {/* Main Sensor Information Fields */}
      <View style={styles.contentContainer}>
        {/* Field 1: Sensor Type */}
        <View style={styles.infoRow}>
          <Text style={styles.fieldLabel}>Sensor Type:</Text>
          <Text style={styles.fieldValue} numberOfLines={2}>
            {sensorType}
          </Text>
        </View>

        {/* Field 2: Value */}
        <View style={styles.infoRow}>
          <Text style={styles.fieldLabel}>Value:</Text>
          {activeLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#7C3AED" />
              <Text style={styles.loadingText}>Loading sensor telemetry...</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.fieldValue,
                activeError && styles.errorText,
                activeAvailable === false && styles.unavailableText,
                isImpact && styles.impactText,
              ]}
              selectable
            >
              {displayValue}
            </Text>
          )}
        </View>
      </View>

      {/* Conditional State: Loading */}
      {activeLoading && (
        <View style={styles.stateNotice}>
          <Text style={styles.stateNoticeText}>
            ⏳ Initializing hardware accelerometer sensor...
          </Text>
        </View>
      )}

      {/* Conditional State: Sensor Unavailable */}
      {activeAvailable === false && !activeLoading && (
        <View style={[styles.stateNotice, styles.noticeUnavailable]}>
          <Text style={styles.noticeTitle}>⚠️ Sensor Unavailable</Text>
          <Text style={styles.noticeBody}>
            The accelerometer is not accessible on this platform/device. In simulators or desktop web browsers, sensor hardware is restricted.
          </Text>
          <TouchableOpacity
            style={styles.simBtn}
            onPress={handleSimulateReading}
            activeOpacity={0.7}
          >
            <Text style={styles.simBtnText}>🧪 Test / Simulate Motion Event</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conditional State: Error */}
      {activeError && !activeLoading && (
        <View style={[styles.stateNotice, styles.noticeError]}>
          <Text style={styles.noticeTitleError}>🚨 Sensor Error</Text>
          <Text style={styles.noticeBodyError}>{activeError}</Text>
        </View>
      )}

      {/* Sensor Controls & Telemetry Status */}
      {activeAvailable !== false && !activeError && (
        <View style={styles.footerRow}>
          <View style={styles.telemetryTag}>
            <Text style={styles.telemetryTagText}>
              Status: {internalStatus}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.controlBtn,
              isMonitoring ? styles.controlBtnStop : styles.controlBtnStart,
            ]}
            onPress={handleToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.controlBtnText}>
              {isMonitoring ? 'Pause Sensor' : 'Resume Sensor'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    borderLeftWidth: 5,
    borderLeftColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#581C87',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeActive: {
    backgroundColor: '#EDE9FE',
  },
  badgeImpact: {
    backgroundColor: '#FEE2E2',
  },
  badgeUnavailable: {
    backgroundColor: '#FEF3C7',
  },
  badgeError: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeTextActive: {
    color: '#7C3AED',
  },
  badgeTextImpact: {
    color: '#DC2626',
  },
  badgeTextUnavailable: {
    color: '#D97706',
  },
  badgeTextError: {
    color: '#DC2626',
  },
  contentContainer: {
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  infoRow: {
    marginVertical: 3,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B21A8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 12,
    color: '#7C3AED',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#DC2626',
  },
  unavailableText: {
    color: '#B45309',
  },
  impactText: {
    color: '#DC2626',
    fontWeight: '800',
  },
  stateNotice: {
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  noticeUnavailable: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  noticeBody: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
  },
  noticeError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  noticeTitleError: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  noticeBodyError: {
    fontSize: 11,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  stateNoticeText: {
    fontSize: 11,
    color: '#6B21A8',
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  telemetryTag: {
    flex: 1,
  },
  telemetryTagText: {
    fontSize: 11,
    color: '#6B21A8',
    fontWeight: '600',
  },
  controlBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  controlBtnStop: {
    backgroundColor: '#F3E8FF',
  },
  controlBtnStart: {
    backgroundColor: '#EDE9FE',
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  simBtn: {
    marginTop: 8,
    backgroundColor: '#D97706',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
