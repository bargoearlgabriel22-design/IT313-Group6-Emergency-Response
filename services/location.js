// services/location.js
// Member 2 - GPS / Location & Permission Handling
// Handles all location logic OUTSIDE the UI screen.

import * as Location from 'expo-location';

/**
 * Checks the current foreground location permission status.
 * Returns the PermissionStatus string: 'granted', 'denied', or 'undetermined'.
 */
export async function checkLocationPermission() {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
}

/**
 * Requests foreground location permission from the user.
 * Returns the PermissionStatus string after the prompt.
 */
export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status;
}

/**
 * Gets the device's current GPS coordinates.
 *
 * Steps:
 * 1. Check if permission is already granted.
 * 2. If not granted, request permission.
 * 3. If still denied, return an error object.
 * 4. If granted, fetch and return latitude & longitude.
 *
 * @returns {{ latitude: number, longitude: number } | { error: string }}
 */
export async function getCurrentLocation() {
  // Step 1 – Check existing permission
  let status = await checkLocationPermission();

  // Step 2 – Request if not yet granted
  if (status !== 'granted') {
    status = await requestLocationPermission();
  }

  // Step 3 – Handle denied permission gracefully
  if (status !== 'granted') {
    return {
      error: 'Location permission was denied. Please enable it in your device settings.',
    };
  }

  // Step 4 – Permission granted: fetch current position
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
