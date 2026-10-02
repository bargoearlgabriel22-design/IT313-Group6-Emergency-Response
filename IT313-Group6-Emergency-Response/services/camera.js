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
 * Mobile:  expo-image-picker → launchCameraAsync → Device Native Camera
 * Web:     Browser MediaDevices API → getUserMedia → Webcam Feed → Canvas Capture
 */

import * as ImagePicker from 'expo-image-picker';

// ============================================================
// MOBILE CAMERA FUNCTIONS (Android / iOS — Expo Go)
// ============================================================

/**
 * Checks the current camera permission status on mobile.
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
 * Requests camera permission from the device user on mobile.
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
 * Captures photo on MOBILE using the native camera.
 * Checks → requests → launches camera → returns URI.
 */
export async function capturePhoto(customOptions = {}) {
  try {
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
          'Camera permission was denied. Please allow camera access in your device settings to attach photo evidence.',
      };
    }

    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      ...customOptions,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    if (result.canceled) {
      return { success: false, canceled: true, uri: null };
    }

    const capturedUri =
      result.assets && result.assets.length > 0 ? result.assets[0].uri : null;

    if (!capturedUri) {
      return { success: false, canceled: false, error: 'No image URI returned from camera.' };
    }

    return {
      success: true,
      canceled: false,
      uri: capturedUri,
      asset: result.assets[0],
    };
  } catch (error) {
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
 * Selects a photo from the mobile device's image library (gallery fallback).
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
      return { success: false, canceled: true, uri: null };
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

// ============================================================
// WEB CAMERA FUNCTIONS (Desktop / Mobile Browser via getUserMedia)
// ============================================================

/**
 * Starts the webcam using the browser's MediaDevices API.
 * This is the correct method for web — opens actual live camera,
 * not a file folder browser.
 *
 * @returns {Promise<{ success: boolean, stream?: MediaStream, error?: string, permissionDenied?: boolean }>}
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
        facingMode: { ideal: 'environment' }, // prefer rear camera on phones
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
          'Camera permission was denied by the browser. Click the camera icon in your address bar to allow access, then try again.',
      };
    }
    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError'
    ) {
      return {
        success: false,
        error: 'No camera was found on this device.',
      };
    }
    return {
      success: false,
      error: error.message || 'Failed to access the camera.',
    };
  }
}

/**
 * Captures a still photo from a live <video> element using an HTML canvas.
 *
 * @param {HTMLVideoElement} videoElement
 * @returns {{ success: boolean, uri?: string, error?: string }}
 */
export function captureFrameFromVideo(videoElement) {
  try {
    if (!videoElement) {
      return { success: false, error: 'No video element available to capture.' };
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
      error: error?.message || 'Failed to capture photo from camera feed.',
    };
  }
}

/**
 * Stops all tracks in a MediaStream, releasing the camera hardware.
 *
 * @param {MediaStream} stream
 */
export function stopWebCameraStream(stream) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}
