/**
 * ============================================================================
 * MEMBER 3 - CAMERA & PHOTO EVIDENCE SERVICE (services/camera.js)
 * ============================================================================
 * 
 * Owner: Member 3
 * Feature: Camera Hardware Access & Photo Evidence Capture
 * 
 * Instructions for Member 3:
 * 1. Install/use `expo-camera` or `expo-image-picker` if needed.
 * 2. Implement camera permissions: `requestCameraPermissions()`
 * 3. Implement capture logic: `capturePhotoEvidence()`
 * 4. Export functions to be consumed by `components/EvidenceCard.jsx`
 * 
 * Architecture Layer: Native Device Features / Business Logic
 */

export const requestCameraPermissions = async () => {
  // Member 3 will implement camera permissions here
  return { granted: true };
};

export const capturePhotoEvidence = async () => {
  // Member 3 will implement photo capture here
  return {
    uri: null,
    cancelled: true,
  };
};
