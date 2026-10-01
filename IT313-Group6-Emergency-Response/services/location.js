/**
 * ============================================================================
 * MEMBER 2 - LOCATION SERVICE (services/location.js)
 * ============================================================================
 * 
 * Owner: Member 2
 * Feature: GPS Tracking & Native Device Location Permissions
 * 
 * Instructions for Member 2:
 * 1. Install/use `expo-location` if needed.
 * 2. Implement permission request logic: `requestLocationPermission()`
 * 3. Implement coordinate fetching: `getCurrentLocation()`
 * 4. Export functions to be consumed by `components/LocationCard.jsx`
 * 
 * Architecture Layer: Native Device Features / Business Logic
 */

export const requestLocationPermissions = async () => {
  // Member 2 will implement native permissions here
  return { granted: true };
};

export const getCurrentLocation = async () => {
  // Member 2 will implement native GPS fetching here
  return {
    latitude: 10.3157,
    longitude: 123.8854,
    accuracy: 3.5,
    timestamp: Date.now(),
  };
};
