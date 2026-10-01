/**
 * ============================================================================
 * MEMBER 2 - LOCATION SERVICE (services/location.js)
 * ============================================================================
 * 
 * Project: Community Emergency Response Assistant (IT313)
 * Owner: Member 2 (GPS / Location + Location Permission Handling)
 * Architecture Layer: Native Device Hardware & Business Logic Service
 * 
 * Flow:
 * LocationCard -> services/location.js -> expo-location -> Device GPS
 * 
 * Responsibilities:
 * 1. Check current foreground location permission.
 * 2. Request permission if permission is not yet granted.
 * 3. Handle granted permission by fetching current GPS coordinates.
 * 4. Handle denied permission gracefully with descriptive messages.
 * 5. Catch errors (GPS disabled, timeout, native exceptions) without crashing.
 * 6. Expose a simple, clean API for Member 1 and presentation components.
 */

import * as Location from 'expo-location';

/**
 * Checks the device's current foreground location permission status.
 * 
 * @returns {Promise<string>} 'granted' | 'denied' | 'undetermined'
 */
export async function checkLocationPermission() {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status;
  } catch (error) {
    console.warn('[LocationService] Error checking permission:', error);
    return 'undetermined';
  }
}

/**
 * Requests foreground location permission from the user.
 * 
 * @returns {Promise<string>} 'granted' | 'denied'
 */
export async function requestLocationPermission() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status;
  } catch (error) {
    console.warn('[LocationService] Error requesting permission:', error);
    return 'denied';
  }
}

// Alias for backwards/plural compatibility
export const requestLocationPermissions = requestLocationPermission;

/**
 * Retrieves the device's current GPS coordinates.
 * 
 * Steps:
 * 1. Check if location permission is already granted.
 * 2. If not granted, request permission from user.
 * 3. If denied, return a graceful error object without throwing or crashing.
 * 4. If granted, fetch current latitude and longitude with high accuracy.
 * 5. Handle any hardware/timeout errors gracefully.
 * 
 * @returns {Promise<{
 *   success: boolean,
 *   latitude: number | null,
 *   longitude: number | null,
 *   accuracy?: number | null,
 *   timestamp?: number | null,
 *   error: string | null
 * }>}
 */
export async function getCurrentLocation() {
  try {
    // Step 1: Check existing permission
    let status = await checkLocationPermission();

    // Step 2: Request permission if not yet granted
    if (status !== 'granted') {
      status = await requestLocationPermission();
    }

    // Step 3: Handle denied permission gracefully
    if (status !== 'granted') {
      return {
        success: false,
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: 'Location permission was denied. Please enable location permissions in your device settings.',
      };
    }

    // Step 4: Permission granted - fetch current GPS position
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (!position || !position.coords) {
      return {
        success: false,
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: 'Location cannot be obtained. Please check your GPS signal.',
      };
    }

    // Step 5: Return successful coordinate payload
    return {
      success: true,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
      error: null,
    };
  } catch (error) {
    // Catch errors without crashing the application
    console.warn('[LocationService] Error getting current location:', error);
    return {
      success: false,
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null,
      error: error?.message || 'Location cannot be obtained. Please ensure GPS is enabled.',
    };
  }
}

export default {
  checkLocationPermission,
  requestLocationPermission,
  requestLocationPermissions,
  getCurrentLocation,
};
