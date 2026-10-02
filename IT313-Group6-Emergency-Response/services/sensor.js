/**
 * ============================================================================
 * MEMBER 4 - SENSOR SERVICE (services/sensor.js)
 * ============================================================================
 * 
 * IT313 Group 6: Community Emergency Response Assistant
 * Owner: Member 4 (Sensor & Local Storage)
 * 
 * Purpose:
 * Provides hardware sensor telemetry for emergency situations using Expo Sensors.
 * Detects device movement, physical impacts, and sudden falls via the 3-axis
 * Accelerometer.
 * 
 * Flow:
 * SensorDisplay (UI) -> services/sensor.js -> Expo Sensors API -> Device Hardware
 * 
 * Oral Defense Points:
 * 1. Uses the Expo Accelerometer sensor to capture 3D acceleration (X, Y, Z).
 * 2. Calculates overall G-force magnitude to detect sudden falls or impacts.
 * 3. Handles hardware availability gracefully (e.g. web, simulator, or unsupported devices).
 * 4. Provides a clean subscription and unsubscribe mechanism to prevent battery drain.
 */

// Direct subpath import avoids expo-sensors/index.js loading Pedometer,
// which crashes the Metro web bundler in Expo 52 (ExponentPedometer native module).
// expo-sensors/build/Accelerometer works correctly on mobile and web.
import Accelerometer from 'expo-sensors/build/Accelerometer';

/**
 * Default sensor update interval in milliseconds (500ms provides smooth UI without CPU overload)
 */
export const DEFAULT_SENSOR_INTERVAL_MS = 500;

/**
 * Human-readable sensor name for presentation
 */
export const SENSOR_TYPE_NAME = 'Accelerometer (Motion & Fall Detection)';

/**
 * Checks whether the accelerometer hardware sensor is available on the current device.
 * Gracefully handles simulators, web previews, and devices without accelerometer support.
 * 
 * @returns {Promise<{ available: boolean, error?: string }>}
 */
export const checkSensorAvailability = async () => {
  try {
    if (!Accelerometer || typeof Accelerometer.isAvailableAsync !== 'function') {
      return { available: false, error: 'Accelerometer API is not supported on this platform.' };
    }
    const isAvailable = await Accelerometer.isAvailableAsync();
    return { available: Boolean(isAvailable) };
  } catch (error) {
    return {
      available: false,
      error: error?.message || 'Failed to query sensor availability.',
    };
  }
};

/**
 * Formats 3-axis accelerometer readings into a clear, human-readable display string.
 * 
 * @param {{ x?: number, y?: number, z?: number, magnitude?: number } | null} data
 * @returns {string} Formatted display string
 */
export const formatSensorValue = (data) => {
  if (!data || typeof data.x !== 'number') {
    return 'Waiting for sensor telemetry...';
  }
  const x = Number(data.x).toFixed(2);
  const y = Number(data.y).toFixed(2);
  const z = Number(data.z).toFixed(2);
  const magnitude = typeof data.magnitude === 'number'
    ? data.magnitude.toFixed(2)
    : Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2).toFixed(2);

  return `X: ${x} | Y: ${y} | Z: ${z} (${magnitude} G)`;
};

/**
 * Analyzes raw accelerometer vector components (in G-forces) to detect emergency states.
 * Baseline Earth gravity is approximately 1.0 G.
 * 
 * @param {number} x - X axis acceleration
 * @param {number} y - Y axis acceleration
 * @param {number} z - Z axis acceleration
 * @returns {{ magnitude: number, status: string, isImpact: boolean }}
 */
export const analyzeSensorReading = (x = 0, y = 0, z = 0) => {
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  let status = 'Stationary / Normal';
  let isImpact = false;

  if (magnitude > 2.2) {
    status = '🚨 High Impact / Fall Detected';
    isImpact = true;
  } else if (magnitude > 1.4) {
    status = '⚡ Active Movement Detected';
  } else if (magnitude < 0.3) {
    status = '⚠️ Freefall Condition Detected';
    isImpact = true;
  }

  return { magnitude, status, isImpact };
};

/**
 * Subscribes to device accelerometer updates.
 * Safely checks hardware availability before attaching the listener.
 * 
 * @param {Function} onData - Callback receiving sensor data object:
 *   { x, y, z, magnitude, status, isImpact, formattedValue, timestamp }
 * @param {Function} [onError] - Callback receiving error object if sensor fails
 * @param {number} [intervalMs=DEFAULT_SENSOR_INTERVAL_MS] - Polling interval in ms
 * @returns {() => void} Unsubscribe cleanup function
 */
export const subscribeToSensor = (onData, onError, intervalMs = DEFAULT_SENSOR_INTERVAL_MS) => {
  let subscription = null;
  let isActive = true;

  (async () => {
    try {
      const { available, error } = await checkSensorAvailability();

      if (!isActive) return;

      if (!available) {
        if (onError) {
          onError(new Error(error || 'Accelerometer is unavailable on this device.'));
        }
        return;
      }

      // Configure update frequency
      Accelerometer.setUpdateInterval(intervalMs);

      // Attach listener
      subscription = Accelerometer.addListener((reading) => {
        if (!isActive) return;

        try {
          const { x = 0, y = 0, z = 0 } = reading;
          const { magnitude, status, isImpact } = analyzeSensorReading(x, y, z);
          const formattedValue = formatSensorValue({ x, y, z, magnitude });

          if (onData) {
            onData({
              x,
              y,
              z,
              magnitude,
              status,
              isImpact,
              formattedValue,
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        } catch (err) {
          console.warn('[SensorService] Data parsing error:', err);
        }
      });
    } catch (err) {
      if (onError) {
        onError(err);
      }
    }
  })();

  // Return unsubscribe cleanup function
  return () => {
    isActive = false;
    try {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    } catch (err) {
      console.warn('[SensorService] Error during unsubscribe:', err);
    }
  };
};

/**
 * Compatibility alias matching Member 1 placeholder interface
 */
export const startSensorTracking = (callback) => {
  return subscribeToSensor(callback);
};

export const getSensorReading = async () => {
  const { available } = await checkSensorAvailability();
  if (!available) {
    return { x: 0, y: 0, z: 0, magnitude: 0, status: 'Unavailable', isImpact: false };
  }
  return { x: 0, y: 0, z: 1, magnitude: 1.0, status: 'Stationary / Normal', isImpact: false };
};

export default {
  checkSensorAvailability,
  formatSensorValue,
  analyzeSensorReading,
  subscribeToSensor,
  startSensorTracking,
  getSensorReading,
  SENSOR_TYPE_NAME,
  DEFAULT_SENSOR_INTERVAL_MS,
};
