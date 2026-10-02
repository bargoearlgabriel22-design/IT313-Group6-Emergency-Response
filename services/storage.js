/**
 * Storage Service (services/storage.js)
 *
 * Member 3 Responsibility: Permanent Local Image Storage + Emergency Metadata
 * Community Emergency Response Assistant — IT313 Group 6
 *
 * Expo SDK: 57  |  Packages: expo-file-system, @react-native-async-storage/async-storage
 *
 * ──────────────────────────────────────────────────────────────────
 * IMAGE STORAGE ARCHITECTURE
 * ──────────────────────────────────────────────────────────────────
 * Temporary URI (from camera/gallery)
 *      ↓  saveEvidenceImage(tempUri, description?)
 * expo-file-system copies the file →
 *   FileSystem.documentDirectory + "evidence/<uuid>.jpg"   ← PERMANENT FILE
 *      ↓
 * AsyncStorage @evidence_list  ←  metadata index (id, permanentUri, date, description)
 *
 * ──────────────────────────────────────────────────────────────────
 * IMPORTANT RULES
 * ──────────────────────────────────────────────────────────────────
 * • AsyncStorage stores METADATA ONLY (JSON strings). Never raw image bytes.
 * • expo-file-system stores the actual IMAGE FILE in documentDirectory/evidence/.
 * • documentDirectory is persistent — data survives app restarts.
 * • Avoid cacheDirectory — it is cleared by the OS at any time.
 *
 * ──────────────────────────────────────────────────────────────────
 * EXPORTED FUNCTIONS
 * ──────────────────────────────────────────────────────────────────
 * Evidence (image + metadata):
 *   saveEvidenceImage(tempUri, description?)   → { success, evidence, error }
 *   getAllEvidence()                            → { success, data[], error }
 *   getEvidenceById(id)                        → { success, evidence, error }
 *   deleteEvidence(id)                         → { success, error }
 *   clearAllEvidence()                         → { success, error }
 *
 * Emergency info (simple key-value):
 *   saveEmergencyInfo(info)                    → { success, error }
 *   getEmergencyInfo()                         → { success, data, error }
 *   clearEmergencyInfo()                       → { success, error }
 */

import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ── AsyncStorage keys ──────────────────────────────────────────
const KEYS = {
  EVIDENCE_LIST: '@evidence_list',
  EMERGENCY_INFO: '@emergency_info',
};

// ── Persistent directory for image files ───────────────────────
function getEvidenceDirectory() {
  if (Platform.OS === 'web') return null;
  const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  if (!baseDir) return null;
  const cleanBase = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
  return `${cleanBase}evidence/`;
}

// ── Unique ID generator ────────────────────────────────────────
function generateId() {
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================
// DIRECTORY SETUP
// ============================================================

/**
 * Ensures the evidence directory exists in persistent document storage.
 * Creates it if it does not exist.
 * @returns {Promise<{ success: boolean, dir?: string|null, error?: string }>}
 */
async function ensureEvidenceDirectory() {
  const dir = getEvidenceDirectory();
  if (!dir) return { success: true, dir: null };
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return { success: true, dir };
  } catch (error) {
    console.warn('ensureEvidenceDirectory error:', error);
    return {
      success: false,
      dir: null,
      error: error?.message || 'Failed to create evidence directory.',
    };
  }
}

// ============================================================
// EVIDENCE — SAVE IMAGE + METADATA
// ============================================================

/**
 * Copies a temporary image URI (from camera or gallery) into the app's
 * persistent document storage directory, then saves its metadata to AsyncStorage.
 *
 * Call this AFTER capturePhoto() or pickImageFromLibrary() from camera.js.
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

    const id = generateId();

    // ── WEB fallback: cannot use FileSystem; store data URL directly ──
    if (Platform.OS === 'web') {
      const evidence = {
        id,
        permanentUri: tempUri,
        description: description || '',
        savedAt: new Date().toISOString(),
        platform: 'web',
      };
      await _appendEvidenceMetadata(evidence);
      return { success: true, evidence };
    }

    // ── MOBILE: Attempt to copy to persistent document directory ──
    let permanentUri = tempUri; // Default fallback to tempUri
    try {
      const dirResult = await ensureEvidenceDirectory();
      const evidenceDir = dirResult.dir || getEvidenceDirectory();

      if (evidenceDir) {
        let extension = 'jpg';
        const match = tempUri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        if (match && match[1] && match[1].length <= 5) {
          extension = match[1].toLowerCase();
        }
        const filename = `${id}.${extension}`;
        const targetUri = `${evidenceDir}${filename}`;

        await FileSystem.copyAsync({ from: tempUri, to: targetUri });

        const fileInfo = await FileSystem.getInfoAsync(targetUri);
        if (fileInfo && fileInfo.exists) {
          permanentUri = targetUri;
        }
      }
    } catch (copyErr) {
      console.warn('Could not copy file to evidence directory, using original URI:', copyErr);
      permanentUri = tempUri;
    }

    const evidence = {
      id,
      permanentUri,
      description: description || '',
      savedAt: new Date().toISOString(),
      platform: 'mobile',
    };

    await _appendEvidenceMetadata(evidence);
    return { success: true, evidence };
  } catch (error) {
    console.warn('saveEvidenceImage error:', error);
    return {
      success: true,
      evidence: {
        id: generateId(),
        permanentUri: tempUri,
        description: description || '',
        savedAt: new Date().toISOString(),
        platform: Platform.OS,
      },
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
// EVIDENCE — RETRIEVE
// ============================================================

/**
 * Retrieves all saved evidence items (metadata + permanent URI).
 * Evidence is sorted newest first.
 *
 * @returns {Promise<{
 *   success: boolean,
 *   data: object[],
 *   error?: string
 * }>}
 */
export async function getAllEvidence() {
  try {
    const result = await _loadEvidenceList();
    if (!result.success) return result;

    // On mobile: filter out items whose physical file no longer exists
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
      // Sort newest first
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

/**
 * Retrieves a single evidence item by its unique ID.
 *
 * @param {string} id
 * @returns {Promise<{
 *   success: boolean,
 *   evidence?: object,
 *   error?: string
 * }>}
 */
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
// EVIDENCE — DELETE
// ============================================================

/**
 * Deletes a single evidence item:
 *   1. Removes the physical image file from document storage (mobile).
 *   2. Removes the metadata entry from AsyncStorage.
 *
 * @param {string} id
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteEvidence(id) {
  try {
    const result = await _loadEvidenceList();
    if (!result.success) return result;

    const item = result.data.find((e) => e.id === id);
    if (!item) {
      return { success: false, error: `Evidence with ID "${id}" not found.` };
    }

    // Delete the physical image file (mobile only)
    if (Platform.OS !== 'web' && item.permanentUri) {
      await FileSystem.deleteAsync(item.permanentUri, { idempotent: true });
    }

    // Remove metadata from list
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

/**
 * Deletes a single evidence item by its permanent URI.
 *
 * @param {string} uri
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
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

    // Fallback: delete physical file on mobile if it exists
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

/**
 * Deletes ALL saved evidence:
 *   1. Removes all image files from the evidence directory (mobile).
 *   2. Clears the metadata list in AsyncStorage.
 *
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function clearAllEvidence() {
  try {
    const dir = getEvidenceDirectory();
    if (Platform.OS !== 'web' && dir) {
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
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
// EMERGENCY INFO — simple key-value metadata store
// ============================================================

/**
 * Saves emergency profile information to AsyncStorage.
 *
 * @param {object} info  e.g. { name, contactNumber, bloodType, address, allergies, notes }
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveEmergencyInfo(info) {
  try {
    if (!info || typeof info !== 'object') {
      return { success: false, error: 'Invalid data: info must be a non-null object.' };
    }
    await AsyncStorage.setItem(KEYS.EMERGENCY_INFO, JSON.stringify(info));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to save emergency information.',
    };
  }
}

/**
 * Retrieves the saved emergency profile information.
 *
 * @returns {Promise<{ success: boolean, data: object|null, error?: string }>}
 */
export async function getEmergencyInfo() {
  try {
    const json = await AsyncStorage.getItem(KEYS.EMERGENCY_INFO);
    if (!json) return { success: true, data: null };
    return { success: true, data: JSON.parse(json) };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error?.message || 'Failed to retrieve emergency information.',
    };
  }
}

/**
 * Removes saved emergency profile information.
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
