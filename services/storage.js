/**
 * Storage Service (services/storage.js)
 *
 * Member 3 Responsibility: Local Storage for Emergency Information
 * Community Emergency Response Assistant
 *
 * Package: @react-native-async-storage/async-storage
 *
 * Architecture:
 * emergency.jsx (UI)
 *      ↓
 * services/storage.js (Storage Service Layer)
 *      ↓
 * AsyncStorage (Device Local Storage)
 *
 * Key Responsibilities:
 * 1. Save emergency information to local device storage.
 * 2. Retrieve saved emergency information.
 * 3. Handle missing/empty data gracefully.
 * 4. Handle storage errors without crashing the app.
 * 5. Keep storage logic fully separate from the UI layer.
 *
 * Member 1 Integration — import and use like this:
 *   import { saveEmergencyInfo, getEmergencyInfo, clearEmergencyInfo } from '../services/storage';
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys — centralised so they stay consistent across the app
const KEYS = {
  EMERGENCY_INFO: '@emergency_info',
  PHOTO_URI: '@emergency_photo_uri',
};

// ============================================================
// SAVE FUNCTIONS
// ============================================================

/**
 * Saves emergency information to local device storage.
 *
 * @param {object} info - Emergency info object, e.g.:
 *   { name, contactNumber, address, bloodType, allergies, notes }
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveEmergencyInfo(info) {
  try {
    if (!info || typeof info !== 'object') {
      return { success: false, error: 'Invalid data: info must be a non-null object.' };
    }
    const json = JSON.stringify(info);
    await AsyncStorage.setItem(KEYS.EMERGENCY_INFO, json);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to save emergency information.',
    };
  }
}

/**
 * Saves the photo evidence URI to local device storage.
 *
 * @param {string|null} uri - The captured photo URI string, or null to clear.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function savePhotoUri(uri) {
  try {
    if (uri === null || uri === undefined) {
      await AsyncStorage.removeItem(KEYS.PHOTO_URI);
      return { success: true };
    }
    await AsyncStorage.setItem(KEYS.PHOTO_URI, uri);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to save photo URI.',
    };
  }
}

// ============================================================
// RETRIEVE FUNCTIONS
// ============================================================

/**
 * Retrieves the saved emergency information from local storage.
 *
 * @returns {Promise<{ success: boolean, data?: object|null, error?: string }>}
 *   data = null  →  no info has been saved yet (not an error)
 *   data = object →  the previously saved emergency info
 */
export async function getEmergencyInfo() {
  try {
    const json = await AsyncStorage.getItem(KEYS.EMERGENCY_INFO);
    if (json === null) {
      // Nothing saved yet — not an error
      return { success: true, data: null };
    }
    const data = JSON.parse(json);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error?.message || 'Failed to retrieve emergency information.',
    };
  }
}

/**
 * Retrieves the saved photo evidence URI from local storage.
 *
 * @returns {Promise<{ success: boolean, uri?: string|null, error?: string }>}
 *   uri = null  →  no photo has been saved yet
 */
export async function getPhotoUri() {
  try {
    const uri = await AsyncStorage.getItem(KEYS.PHOTO_URI);
    return { success: true, uri: uri || null };
  } catch (error) {
    return {
      success: false,
      uri: null,
      error: error?.message || 'Failed to retrieve photo URI.',
    };
  }
}

// ============================================================
// CLEAR FUNCTIONS
// ============================================================

/**
 * Removes saved emergency information from local storage.
 *
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function clearEmergencyInfo() {
  try {
    await AsyncStorage.removeItem(KEYS.EMERGENCY_INFO);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to clear emergency information.',
    };
  }
}

/**
 * Removes the saved photo evidence URI from local storage.
 *
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function clearPhotoUri() {
  try {
    await AsyncStorage.removeItem(KEYS.PHOTO_URI);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to clear photo URI.',
    };
  }
}

/**
 * Clears ALL Member 3 storage data (emergency info + photo URI).
 * Useful for a full reset or logout scenario.
 *
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function clearAllEmergencyData() {
  try {
    await AsyncStorage.multiRemove([KEYS.EMERGENCY_INFO, KEYS.PHOTO_URI]);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to clear emergency data.',
    };
  }
}
