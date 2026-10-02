/**
 * Camera Service (services/camera.js)
 *
 * Member 3 Responsibility: Camera & Photo Evidence Feature
 * Community Emergency Response Assistant — IT313 Group 6
 *
 * Expo SDK: 57  |  Package: expo-image-picker, expo-file-system
 *
 * Architecture:
 * EvidenceCard (UI)
 *      ↓
 * services/camera.js       — capture or pick image, return temp URI
 *      ↓
 * services/storage.js      — copy file to persistent storage, save metadata
 *      ↓
 * FileSystem.documentDirectory/evidence/   — permanent on-device image files
 * AsyncStorage @evidence_list              — evidence metadata index
 *
 * Exported Functions:
 *   checkCameraPermission()          → { granted, status, canAskAgain }
 *   requestCameraPermission()        → { granted, status, canAskAgain }
 *   capturePhoto(options?)           → { success, uri, canceled, permissionDenied, error }
 *   pickImageFromLibrary(options?)   → { success, uri, canceled, permissionDenied, error }
 *   startWebCameraStream()           → { success, stream, permissionDenied, error }  [web only]
 *   captureFrameFromVideo(videoEl)   → { success, uri, error }                       [web only]
 *   stopWebCameraStream(stream)      → void                                           [web only]
 */

import * as ImagePicker from 'expo-image-picker';

// ============================================================
// MOBILE — PERMISSION HELPERS
// ============================================================

/**
 * Checks the current camera permission status (mobile).
 * Does not prompt the user.
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
 * Asks the user for camera permission (mobile).
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

// ============================================================
// MOBILE — CAPTURE PHOTO (native camera)
// ============================================================

/**
 * Opens the device's native camera to take a photo.
 * Returns a TEMPORARY URI from the camera roll/cache.
 * Pass this URI to storage.saveEvidenceImage() for permanent storage.
 *
 * @param {object} customOptions  Optional ImagePicker options override
 * @returns {Promise<{
 *   success: boolean,
 *   uri?: string,
 *   asset?: object,
 *   canceled?: boolean,
 *   permissionDenied?: boolean,
 *   error?: string
 * }>}
 */
export async function capturePhoto(customOptions = {}) {
  try {
    // Check then request permission if needed
    let permission = await checkCameraPermission();
    if (!permission.granted) {
      permission = await requestCameraPermission();
    }
    if (!permission.granted) {
      return {
        success: false,
        canceled: false,
        permissionDenied: true,
        error:
          'Camera permission was denied. Please allow camera access in your device settings.',
      };
    }

    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
      ...customOptions,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    if (result.canceled) {
      return { success: false, canceled: true, uri: null };
    }

    const asset = result.assets && result.assets.length > 0 ? result.assets[0] : null;
    const uri = asset?.uri || asset?.path || result.uri || result.path || null;

    if (!uri) {
      return { success: false, error: 'Camera returned no image URI.' };
    }

    return { success: true, canceled: false, uri, asset: asset || result };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'An error occurred while accessing the camera.',
    };
  }
}

// ============================================================
// MOBILE — PICK FROM GALLERY
// ============================================================

/**
 * Opens the device's photo gallery.
 * Returns a TEMPORARY URI from the gallery.
 * Pass this URI to storage.saveEvidenceImage() for permanent storage.
 *
 * @param {object} customOptions  Optional ImagePicker options override
 * @returns {Promise<{
 *   success: boolean,
 *   uri?: string,
 *   asset?: object,
 *   canceled?: boolean,
 *   permissionDenied?: boolean,
 *   error?: string
 * }>}
 */
export async function pickImageFromLibrary(customOptions = {}) {
  try {
    const permissionResponse =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResponse.granted) {
      return {
        success: false,
        permissionDenied: true,
        error:
          'Photo library permission was denied. Please allow access in device settings.',
      };
    }

    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
      ...customOptions,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) {
      return { success: false, canceled: true, uri: null };
    }

    const asset = result.assets && result.assets.length > 0 ? result.assets[0] : null;
    const uri = asset?.uri || asset?.path || result.uri || result.path || null;

    if (!uri) {
      return { success: false, error: 'Gallery returned no image URI.' };
    }

    return { success: true, canceled: false, uri, asset: asset || result };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'An error occurred while accessing the gallery.',
    };
  }
}

// ============================================================
// WEB — getUserMedia WEBCAM (browser only)
// ============================================================

/**
 * Starts the webcam stream in a browser using the MediaDevices API.
 * This is the correct web alternative to launchCameraAsync —
 * it opens the actual live camera, not a file-folder browser.
 *
 * @returns {Promise<{
 *   success: boolean,
 *   stream?: MediaStream,
 *   permissionDenied?: boolean,
 *   error?: string
 * }>}
 */
export async function startWebCameraStream() {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    return {
      success: false,
      error: 'Camera API is not available in this browser. Try Chrome or Firefox.',
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    return { success: true, stream };
  } catch (error) {
    if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
      return {
        success: false,
        permissionDenied: true,
        error:
          'Camera permission was denied by the browser. Click the camera icon in your address bar to allow access.',
      };
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return { success: false, error: 'No camera was found on this device.' };
    }
    return { success: false, error: error.message || 'Failed to access camera.' };
  }
}

/**
 * Captures a still photo from a live <video> element using an HTML canvas.
 * Returns a base64 data URL (web-only; used as the temp URI before file saving).
 *
 * @param {HTMLVideoElement} videoElement
 * @returns {{ success: boolean, uri?: string, error?: string }}
 */
export function captureFrameFromVideo(videoElement) {
  try {
    if (!videoElement) {
      return { success: false, error: 'No video element to capture from.' };
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const uri = canvas.toDataURL('image/jpeg', 0.85);
    return { success: true, uri };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Failed to capture frame from camera.',
    };
  }
}

/**
 * Stops all tracks in a MediaStream, releasing the webcam.
 * @param {MediaStream} stream
 */
export function stopWebCameraStream(stream) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}
