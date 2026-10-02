/**
 * ============================================================================
 * MEMBER 4 - STORAGE SERVICE (services/storage.js)
 * ============================================================================
 * 
 * IT313 Group 6: Community Emergency Response Assistant
 * Owner: Member 4 (Sensor & Local Storage)
 * 
 * Purpose:
 * Provides offline-first persistent local storage for critical emergency data
 * (such as contact info, medical alert notes, incident reports, and dispatch logs).
 * Uses AsyncStorage to ensure data persists even when the device restarts
 * or has no cellular / internet connection.
 * 
 * Architecture Layer: Local Storage Layer (Completely decoupled from UI)
 * Expected Flow: UI -> services/storage.js -> Local Storage (AsyncStorage)
 * 
 * Oral Defense Points:
 * 1. Uses AsyncStorage (Expo compatible local key-value storage).
 * 2. 100% offline — zero dependency on cloud databases or Firebase.
 * 3. Handles missing/empty data gracefully without throwing unhandled exceptions.
 * 4. Error boundaries prevent storage read/write failures from crashing the app.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Default persistent storage key for general emergency information
 */
export const DEFAULT_STORAGE_KEY = '@emergency_information';

/**
 * Saves emergency information to local persistent storage.
 * 
 * @param {any} data - Emergency information payload (object, array, or string)
 * @param {string} [key=DEFAULT_STORAGE_KEY] - Optional custom storage key
 * @returns {Promise<{ success: boolean, message: string, data?: any, error?: string }>}
 */
export const saveEmergencyInformation = async (data, key = DEFAULT_STORAGE_KEY) => {
  try {
    if (data === undefined || data === null) {
      return {
        success: false,
        error: 'No data provided to save.',
      };
    }

    const storageKey = typeof key === 'string' && key.trim() ? key.trim() : DEFAULT_STORAGE_KEY;
    const serializedData = typeof data === 'string' ? data : JSON.stringify(data);

    await AsyncStorage.setItem(storageKey, serializedData);

    return {
      success: true,
      message: 'Emergency information saved successfully.',
      data,
    };
  } catch (error) {
    console.warn('[StorageService] Error saving emergency data:', error);
    return {
      success: false,
      error: error?.message || 'Failed to save emergency data locally.',
    };
  }
};

/**
 * Retrieves emergency information from local persistent storage.
 * Gracefully handles situations where no data has been saved yet.
 * 
 * @param {string} [key=DEFAULT_STORAGE_KEY] - Storage key to retrieve
 * @returns {Promise<{ success: boolean, data: any | null, message: string, error?: string }>}
 */
export const getEmergencyInformation = async (key = DEFAULT_STORAGE_KEY) => {
  try {
    const storageKey = typeof key === 'string' && key.trim() ? key.trim() : DEFAULT_STORAGE_KEY;
    const rawData = await AsyncStorage.getItem(storageKey);

    // Case 1: No saved data found
    if (rawData === null || rawData === undefined) {
      return {
        success: true,
        data: null,
        message: 'No saved emergency information found.',
      };
    }

    // Case 2: Data found, attempt JSON parsing with safe string fallback
    let parsedData = rawData;
    try {
      parsedData = JSON.parse(rawData);
    } catch {
      // Data was stored as raw plain string; retain as-is
      parsedData = rawData;
    }

    return {
      success: true,
      data: parsedData,
      message: 'Emergency information retrieved successfully.',
    };
  } catch (error) {
    console.warn('[StorageService] Error retrieving emergency data:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'Failed to retrieve local emergency data.',
    };
  }
};

/**
 * Clears saved emergency information from local storage for a given key.
 * 
 * @param {string} [key=DEFAULT_STORAGE_KEY] - Storage key to clear
 * @returns {Promise<{ success: boolean, message: string, error?: string }>}
 */
export const clearEmergencyInformation = async (key = DEFAULT_STORAGE_KEY) => {
  try {
    const storageKey = typeof key === 'string' && key.trim() ? key.trim() : DEFAULT_STORAGE_KEY;
    await AsyncStorage.removeItem(storageKey);

    return {
      success: true,
      message: 'Saved emergency information removed successfully.',
    };
  } catch (error) {
    console.warn('[StorageService] Error removing emergency data:', error);
    return {
      success: false,
      error: error?.message || 'Failed to clear local emergency data.',
    };
  }
};

/**
 * Quick boolean check to see if emergency information exists in local storage.
 * 
 * @param {string} [key=DEFAULT_STORAGE_KEY]
 * @returns {Promise<boolean>}
 */
export const hasSavedEmergencyInformation = async (key = DEFAULT_STORAGE_KEY) => {
  try {
    const result = await getEmergencyInformation(key);
    return result.success && result.data !== null;
  } catch {
    return false;
  }
};

// ============================================================================
// COMPATIBILITY ALIASES (Matching Member 1 placeholder signatures)
// ============================================================================

/**
 * Flexible wrapper matching Member 1 signature: `saveEmergencyData(key, value)`
 * or single argument `saveEmergencyData(data)`.
 */
export const saveEmergencyData = async (keyOrData, valueOrUndefined) => {
  let targetKey = DEFAULT_STORAGE_KEY;
  let targetData;

  if (valueOrUndefined !== undefined) {
    targetKey = typeof keyOrData === 'string' ? keyOrData : DEFAULT_STORAGE_KEY;
    targetData = valueOrUndefined;
  } else {
    targetData = keyOrData;
  }

  const result = await saveEmergencyInformation(targetData, targetKey);
  return result.success;
};

/**
 * Compatibility wrapper matching Member 1 signature: `getEmergencyData(key)`
 * Returns the raw parsed data or null when empty.
 */
export const getEmergencyData = async (key = DEFAULT_STORAGE_KEY) => {
  const result = await getEmergencyInformation(key);
  return result.data;
};

/**
 * Compatibility alias for removing stored data
 */
export const removeEmergencyData = async (key = DEFAULT_STORAGE_KEY) => {
  const result = await clearEmergencyInformation(key);
  return result.success;
};

export default {
  saveEmergencyInformation,
  getEmergencyInformation,
  clearEmergencyInformation,
  hasSavedEmergencyInformation,
  saveEmergencyData,
  getEmergencyData,
  removeEmergencyData,
  DEFAULT_STORAGE_KEY,
};
