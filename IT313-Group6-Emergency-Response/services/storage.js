/**
 * ============================================================================
 * UNIFIED STORAGE SERVICE (services/storage.js)
 * ============================================================================
 * 
 * IT313 Group 6: Community Emergency Response Assistant
 * Contributors: Member 3 (Photo Evidence Storage) & Member 4 (Offline Incident Storage)
 * 
 * Expo SDK: 57 | Packages: expo-file-system, @react-native-async-storage/async-storage
 * 
 * Features:
 * 1. Member 3: Permanent photo evidence file storage (expo-file-system) + metadata indexing (AsyncStorage)
 * 2. Member 4: Offline-first persistent emergency information & dispatch report logging (AsyncStorage)
 */

import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ── AsyncStorage keys ──────────────────────────────────────────
export const DEFAULT_STORAGE_KEY = '@emergency_information';

const KEYS = {
  EVIDENCE_LIST: '@evidence_list',
  EMERGENCY_INFO: '@emergency_information',
};

// ── Persistent directory for image files ───────────────────────
// documentDirectory is preserved across restarts (never cleared by OS).
const EVIDENCE_DIR =
  Platform.OS !== 'web' && FileSystem && FileSystem.documentDirectory
    ? `${FileSystem.documentDirectory}evidence/`
    : null;

// ── Unique ID generator ────────────────────────────────────────
function generateId() {
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================
// DIRECTORY SETUP (MEMBER 3)
// ============================================================

/**
 * Ensures the evidence directory exists in persistent document storage.
 * Creates it if it does not exist.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function ensureEvidenceDirectory() {
  if (!EVIDENCE_DIR) return { success: true }; // web — skip
  try {
    const info = await FileSystem.getInfoAsync(EVIDENCE_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(EVIDENCE_DIR, { intermediates: true });
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to create evidence directory.',
    };
  }
}

// ============================================================
// EVIDENCE — SAVE IMAGE + METADATA (MEMBER 3)
// ============================================================

/**
 * Copies a temporary image URI (from camera or gallery) into the app's
 * persistent document storage directory, then saves its metadata to AsyncStorage.
 *
 * @param {string} tempUri    - The temporary URI returned by the camera or gallery.
 * @param {string} [description] - Optional text description for this evidence item.
 * @returns {Promise<{
 *   success: boolean,
 *   evidence?: {
 *     id: string,
 *     permanentUri: string,
 *     description: string,
 *     savedAt: string
 *   },
 *   error?: string
 * }>}
 */
export async function saveEvidenceImage(tempUri, description = '') {
  try {
    if (!tempUri) {
      return { success: false, error: 'No image URI provided.' };
    }

    // ── WEB fallback: cannot use FileSystem; store data URL directly ──
    if (Platform.OS === 'web') {
      const id = generateId();
      const evidence = {
        id,
        permanentUri: tempUri,
        description: description || '',
        savedAt: new Date().toISOString(),
        platform: 'web',
      };
      const saveResult = await _appendEvidenceMetadata(evidence);
      if (!saveResult.success) return saveResult;
      return { success: true, evidence };
    }

    // ── MOBILE: Copy file to persistent document directory ──────────
    const dirResult = await ensureEvidenceDirectory();
    if (!dirResult.success) return dirResult;

    const id = generateId();
    const extension = tempUri.split('.').pop()?.split('?')[0] || 'jpg';
    const filename = `${id}.${extension}`;
    const permanentUri = `${EVIDENCE_DIR}${filename}`;

    // Copy from temporary location to permanent document directory
    await FileSystem.copyAsync({ from: tempUri, to: permanentUri });

    // Verify the file was copied successfully
    const fileInfo = await FileSystem.getInfoAsync(permanentUri);
    if (!fileInfo.exists) {
      return {
        success: false,
        error: 'Failed to verify saved evidence file in document storage.',
      };
    }

    // Save metadata entry to AsyncStorage
    const evidence = {
      id,
      permanentUri,
      description: description || '',
      savedAt: new Date().toISOString(),
      fileSize: fileInfo.size,
      platform: Platform.OS,
    };

    const saveResult = await _appendEvidenceMetadata(evidence);
    if (!saveResult.success) {
      // Rollback: remove the copied file if metadata save fails
      await FileSystem.deleteAsync(permanentUri, { idempotent: true });
      return saveResult;
    }

    return { success: true, evidence };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to save evidence image.',
    };
  }
}

// ── Internal: append one evidence item to the AsyncStorage list ──
async function _appendEvidenceMetadata(evidence) {
  try {
    const existing = await _loadEvidenceList();
    if (!existing.success) return existing;
    const list = existing.data;
    list.push(evidence);
    await AsyncStorage.setItem(KEYS.EVIDENCE_LIST, JSON.stringify(list));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to save evidence metadata.',
    };
  }
}

// ── Internal: load raw evidence list from AsyncStorage ──────────
async function _loadEvidenceList() {
  try {
    const json = await AsyncStorage.getItem(KEYS.EVIDENCE_LIST);
    if (!json) return { success: true, data: [] };
    const data = JSON.parse(json);
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error?.message || 'Failed to load evidence list.',
    };
  }
}

// ============================================================
// EVIDENCE — RETRIEVE (MEMBER 3)
// ============================================================

export async function getAllEvidence() {
  try {
    const result = await _loadEvidenceList();
    if (!result.success) return result;

    if (Platform.OS !== 'web') {
      const verified = [];
      for (const item of result.data) {
        try {
          const info = await FileSystem.getInfoAsync(item.permanentUri);
          if (info.exists) verified.push(item);
        } catch {
          // Skip items that can't be verified
        }
      }
      verified.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      return { success: true, data: verified };
    }

    const sorted = [...result.data].sort(
      (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
    );
    return { success: true, data: sorted };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error?.message || 'Failed to retrieve evidence.',
    };
  }
}

export async function getEvidenceById(id) {
  try {
    const result = await _loadEvidenceList();
    if (!result.success) return result;
    const found = result.data.find((item) => item.id === id);
    if (!found) {
      return { success: false, error: `No evidence found with ID: ${id}` };
    }
    return { success: true, evidence: found };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to retrieve evidence by ID.',
    };
  }
}

// ============================================================
// EVIDENCE — DELETE (MEMBER 3)
// ============================================================

export async function deleteEvidence(id) {
  try {
    const result = await _loadEvidenceList();
    if (!result.success) return result;

    const item = result.data.find((e) => e.id === id);
    if (!item) {
      return { success: false, error: `Evidence with ID "${id}" not found.` };
    }

    if (Platform.OS !== 'web' && item.permanentUri) {
      try {
        await FileSystem.deleteAsync(item.permanentUri, { idempotent: true });
      } catch {}
    }

    const updated = result.data.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEYS.EVIDENCE_LIST, JSON.stringify(updated));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to delete evidence.',
    };
  }
}

export async function deleteEvidenceByUri(uri) {
  try {
    if (!uri) return { success: true };
    const result = await _loadEvidenceList();
    if (result.success && Array.isArray(result.data)) {
      const item = result.data.find((e) => e.permanentUri === uri);
      if (item) {
        return await deleteEvidence(item.id);
      }
    }

    if (Platform.OS !== 'web' && typeof uri === 'string' && uri.startsWith('file://')) {
      try {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }
      } catch {}
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to delete evidence by URI.',
    };
  }
}

export async function clearAllEvidence() {
  try {
    if (Platform.OS !== 'web' && EVIDENCE_DIR) {
      try {
        const dirInfo = await FileSystem.getInfoAsync(EVIDENCE_DIR);
        if (dirInfo.exists) {
          await FileSystem.deleteAsync(EVIDENCE_DIR, { idempotent: true });
        }
      } catch {}
    }
    await AsyncStorage.removeItem(KEYS.EVIDENCE_LIST);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to clear all evidence.',
    };
  }
}

// ============================================================
// EMERGENCY INFORMATION STORAGE (MEMBER 4 & MEMBER 3)
// ============================================================

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
      error: error?.message || 'Failed to save emergency information.',
    };
  }
};

/**
 * Retrieves emergency information from local persistent storage.
 * 
 * @param {string} [key=DEFAULT_STORAGE_KEY] - Optional custom storage key
 * @returns {Promise<{ success: boolean, data?: any, rawValue?: string, error?: string }>}
 */
export const getEmergencyInformation = async (key = DEFAULT_STORAGE_KEY) => {
  try {
    const storageKey = typeof key === 'string' && key.trim() ? key.trim() : DEFAULT_STORAGE_KEY;
    const rawValue = await AsyncStorage.getItem(storageKey);

    if (!rawValue) {
      return {
        success: true,
        data: null,
        rawValue: null,
      };
    }

    try {
      const parsedData = JSON.parse(rawValue);
      return {
        success: true,
        data: parsedData,
        rawValue,
      };
    } catch {
      return {
        success: true,
        data: rawValue,
        rawValue,
      };
    }
  } catch (error) {
    console.warn('[StorageService] Error reading emergency data:', error);
    return {
      success: false,
      error: error?.message || 'Failed to retrieve emergency information.',
    };
  }
};

/**
 * Clears emergency information from local persistent storage.
 * 
 * @param {string} [key=DEFAULT_STORAGE_KEY] - Optional custom storage key
 * @returns {Promise<{ success: boolean, message: string, error?: string }>}
 */
export const clearEmergencyInformation = async (key = DEFAULT_STORAGE_KEY) => {
  try {
    const storageKey = typeof key === 'string' && key.trim() ? key.trim() : DEFAULT_STORAGE_KEY;
    await AsyncStorage.removeItem(storageKey);

    return {
      success: true,
      message: 'Emergency information cleared successfully.',
    };
  } catch (error) {
    console.warn('[StorageService] Error clearing emergency data:', error);
    return {
      success: false,
      error: error?.message || 'Failed to clear emergency information.',
    };
  }
};

/**
 * Checks if emergency information exists in local persistent storage.
 * 
 * @param {string} [key=DEFAULT_STORAGE_KEY] - Optional custom storage key
 * @returns {Promise<boolean>}
 */
export const hasSavedEmergencyInformation = async (key = DEFAULT_STORAGE_KEY) => {
  try {
    const res = await getEmergencyInformation(key);
    return res.success && res.data !== null;
  } catch {
    return false;
  }
};

// Aliases for Member 3 function names
export const saveEmergencyInfo = async (info) => {
  const res = await saveEmergencyInformation(info, KEYS.EMERGENCY_INFO);
  return { success: res.success, error: res.error, data: res.data };
};

export const getEmergencyInfo = async () => {
  const res = await getEmergencyInformation(KEYS.EMERGENCY_INFO);
  return { success: res.success, data: res.data, error: res.error };
};

export const clearEmergencyInfo = async () => {
  const res = await clearEmergencyInformation(KEYS.EMERGENCY_INFO);
  return { success: res.success, error: res.error };
};

export const saveEmergencyData = saveEmergencyInformation;
export const getEmergencyData = getEmergencyInformation;
export const removeEmergencyData = clearEmergencyInformation;

export default {
  saveEvidenceImage,
  getAllEvidence,
  getEvidenceById,
  deleteEvidence,
  deleteEvidenceByUri,
  clearAllEvidence,
  saveEmergencyInformation,
  getEmergencyInformation,
  clearEmergencyInformation,
  hasSavedEmergencyInformation,
  saveEmergencyInfo,
  getEmergencyInfo,
  clearEmergencyInfo,
  saveEmergencyData,
  getEmergencyData,
  removeEmergencyData,
  DEFAULT_STORAGE_KEY,
};
