/**
 * Camera Service (services/camera.js)
 * 
 * Member 3 Responsibility: Camera & Photo Evidence Feature
 * Community Emergency Response Assistant
 * 
 * Architecture Flow:
 * EvidenceCard (UI Component)
 *      ↓
 * services/camera.js (Camera Service Layer)
 *      ↓
 * Expo Camera API (expo-image-picker / Device Hardware)
 *      ↓
 * Device Camera
 * 
 * Key Responsibilities:
 * 1. Check camera permission without crashing.
 * 2. Request camera permission when needed.
 * 3. Handle granted permissions seamlessly.
 * 4. Handle denied permissions gracefully (returns user-friendly error).
 * 5. Trigger device camera to capture photo evidence.
 * 6. Return captured photo URI to UI.
 * 7. Provide fallback image library selection for testing/emulators.
 */

import * as ImagePicker from 'expo-image-picker';

/**
 * Checks the device's current camera permission status.
 * Does not prompt the user.
 * 
 * @returns {Promise<{ granted: boolean, status: string, canAskAgain: boolean, error?: string }>}
 */
export async function checkCameraPermission() {
  try {
    const response = await ImagePicker.getCameraPermissionsAsync();
    return {
      granted: response.granted,
      status: response.status,
      canAskAgain: response.canAskAgain,
    };
  } catch (error) {
    return {
      granted: false,
      status: 'denied',
      canAskAgain: false,
      error: error?.message || 'Unable to check camera permission.',
    };
  }
}

/**
 * Requests camera permission from the device/user.
 * 
 * @returns {Promise<{ granted: boolean, status: string, canAskAgain: boolean, error?: string }>}
 */
export async function requestCameraPermission() {
  try {
    const response = await ImagePicker.requestCameraPermissionsAsync();
    return {
      granted: response.granted,
      status: response.status,
      canAskAgain: response.canAskAgain,
    };
  } catch (error) {
    return {
      granted: false,
      status: 'denied',
      canAskAgain: false,
      error: error?.message || 'Unable to request camera permission.',
    };
  }
}

/**
 * Captures photo evidence using the device camera.
 * 
 * Flow:
 * 1. Check camera permission.
 * 2. Request permission if not already granted.
 * 3. If denied, return a graceful error response (never throw/crash).
 * 4. If granted, launch the device camera.
 * 5. Return the captured photo URI to the UI layer.
 * 
 * @param {object} customOptions - Optional custom ImagePicker configuration options
 * @returns {Promise<{ success: boolean, uri?: string, asset?: object, canceled?: boolean, permissionDenied?: boolean, error?: string }>}
 */
export async function capturePhoto(customOptions = {}) {
  try {
    // Step 1: Check existing camera permission
    let permission = await checkCameraPermission();

    // Step 2: Request permission if not granted yet
    if (!permission.granted) {
      permission = await requestCameraPermission();
    }

    // Step 3: Handle denied permission gracefully
    if (!permission.granted) {
      return {
        success: false,
        canceled: false,
        permissionDenied: true,
        error:
          'Camera permission was denied. Please allow camera access in your device settings to attach photo evidence.',
      };
    }

    // Step 4: Permission granted - Launch device camera
    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      ...customOptions,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    // Step 5: Handle user cancellation (dismissed camera UI without capturing)
    if (result.canceled) {
      return {
        success: false,
        canceled: true,
        uri: null,
      };
    }

    // Step 6: Extract and return the captured photo URI
    const capturedUri =
      result.assets && result.assets.length > 0 ? result.assets[0].uri : null;

    if (!capturedUri) {
      return {
        success: false,
        canceled: false,
        error: 'No image URI returned from camera.',
      };
    }

    return {
      success: true,
      canceled: false,
      uri: capturedUri,
      asset: result.assets[0],
    };
  } catch (error) {
    // Fail-safe: Always catch errors to prevent application crashes
    return {
      success: false,
      canceled: false,
      error:
        error?.message ||
        'An unexpected error occurred while launching the camera.',
    };
  }
}

/**
 * Selects an existing photo from the device image library.
 * Provides a reliable fallback for testing environments and emulators
 * that lack active camera hardware.
 * 
 * @param {object} customOptions - Optional custom ImagePicker configuration options
 * @returns {Promise<{ success: boolean, uri?: string, asset?: object, canceled?: boolean, permissionDenied?: boolean, error?: string }>}
 */
export async function pickImageFromLibrary(customOptions = {}) {
  try {
    const permissionResponse =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResponse.granted) {
      return {
        success: false,
        canceled: false,
        permissionDenied: true,
        error:
          'Media library permission was denied. Please allow photo access in device settings.',
      };
    }

    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      ...customOptions,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) {
      return {
        success: false,
        canceled: true,
        uri: null,
      };
    }

    const selectedUri =
      result.assets && result.assets.length > 0 ? result.assets[0].uri : null;

    return {
      success: true,
      canceled: false,
      uri: selectedUri,
      asset: result.assets[0],
    };
  } catch (error) {
    return {
      success: false,
      canceled: false,
      error:
        error?.message ||
        'An unexpected error occurred while accessing the photo library.',
    };
  }
}
