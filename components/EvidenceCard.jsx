// components/EvidenceCard.jsx
// Member 3 - Camera & Photo Evidence Feature
// Community Emergency Response Assistant
//
// Reusable presentation card that provides a clear photo evidence area.
// Handles all UI states: No photo yet, Camera loading, Permission denied, and Photo captured.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  capturePhoto,
  pickImageFromLibrary,
  requestCameraPermission,
} from '../services/camera';

/**
 * EvidenceCard Component
 *
 * Role (Member 3 - Camera & Photo Evidence):
 * Reusable component designed for emergency incident documentation.
 * Communicates with services/camera.js to interact with device camera hardware.
 *
 * Props:
 * @param {string|null} imageUri - Current photo evidence URI (supports controlled state)
 * @param {function} onCapture - Callback function triggered when photo is captured: (uri) => void
 * @param {string} title - Optional custom card title (Default: "Photo Evidence")
 * @param {string} subtitle - Optional descriptive subtitle
 * @param {function} onRemove - Optional callback when user removes the photo: () => void
 * @param {boolean} allowLibrary - Whether to provide gallery picker fallback (Default: true)
 * @param {boolean} disabled - Whether interactions are disabled
 */
export default function EvidenceCard({
  imageUri = null,
  onCapture,
  title = 'Photo Evidence',
  subtitle = 'Visual incident documentation for responders',
  onRemove,
  allowLibrary = true,
  disabled = false,
}) {
  // Local state for uncontrolled usage or intermediate loading/error states
  const [internalUri, setInternalUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Opening Camera…');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Active photo URI (prefers prop if passed, otherwise falls back to internal state)
  const currentPhotoUri = imageUri !== undefined && imageUri !== null ? imageUri : internalUri;

  /**
   * Triggers device camera capture via services/camera.js
   */
  const handleTakePhoto = async () => {
    if (disabled || loading) return;

    setLoading(true);
    setLoadingMessage('Opening Camera…');
    setPermissionDenied(false);
    setErrorMessage(null);

    const result = await capturePhoto();

    setLoading(false);

    if (result.permissionDenied) {
      setPermissionDenied(true);
      setErrorMessage(result.error);
      return;
    }

    if (result.canceled) {
      // User closed the camera without capturing - no error needed
      return;
    }

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to capture photo.');
      return;
    }

    if (result.uri) {
      setInternalUri(result.uri);
      if (typeof onCapture === 'function') {
        onCapture(result.uri);
      }
    }
  };

  /**
   * Fallback: Allows selecting photo from library (e.g. for emulators/testing)
   */
  const handlePickFromLibrary = async () => {
    if (disabled || loading) return;

    setLoading(true);
    setLoadingMessage('Opening Photo Library…');
    setPermissionDenied(false);
    setErrorMessage(null);

    const result = await pickImageFromLibrary();

    setLoading(false);

    if (result.permissionDenied) {
      setPermissionDenied(true);
      setErrorMessage(result.error);
      return;
    }

    if (result.canceled) {
      return;
    }

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to select photo.');
      return;
    }

    if (result.uri) {
      setInternalUri(result.uri);
      if (typeof onCapture === 'function') {
        onCapture(result.uri);
      }
    }
  };

  /**
   * Handles re-requesting permission if previously denied
   */
  const handleRetryPermission = async () => {
    setLoading(true);
    setLoadingMessage('Requesting Camera Permission…');
    setErrorMessage(null);

    const permission = await requestCameraPermission();
    setLoading(false);

    if (permission.granted) {
      setPermissionDenied(false);
      // Immediately open camera once granted
      handleTakePhoto();
    } else {
      setPermissionDenied(true);
      setErrorMessage(
        'Camera permission is still denied. Please enable camera access in your device settings.'
      );
    }
  };

  /**
   * Clears/removes the current photo evidence
   */
  const handleRemovePhoto = () => {
    setInternalUri(null);
    setErrorMessage(null);

    if (typeof onRemove === 'function') {
      onRemove();
    } else if (typeof onCapture === 'function') {
      onCapture(null);
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerIcon}>📷</Text>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {/* Status Badge */}
        {currentPhotoUri ? (
          <View style={styles.badgeSuccess}>
            <Text style={styles.badgeTextSuccess}>ATTACHED</Text>
          </View>
        ) : (
          <View style={styles.badgeNeutral}>
            <Text style={styles.badgeTextNeutral}>OPTIONAL</Text>
          </View>
        )}
      </View>

      {/* ============================================================ */}
      {/* STATE 1: CAMERA LOADING                                      */}
      {/* ============================================================ */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
          <Text style={styles.loadingSubtext}>Please wait while device hardware responds</Text>
        </View>
      ) : null}

      {/* ============================================================ */}
      {/* STATE 2: CAMERA PERMISSION DENIED                            */}
      {/* ============================================================ */}
      {!loading && permissionDenied ? (
        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>Camera Permission Required</Text>
          <Text style={styles.warningDescription}>
            {errorMessage ||
              'Camera permission was denied. Access is required to capture live incident photos.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetryPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>🔄 Grant Permission & Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Generic Error Notice (Non-permission errors) */}
      {!loading && !permissionDenied && errorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          <TouchableOpacity
            onPress={() => setErrorMessage(null)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ============================================================ */}
      {/* STATE 3: PHOTO SUCCESSFULLY CAPTURED                         */}
      {/* ============================================================ */}
      {!loading && !permissionDenied && currentPhotoUri ? (
        <View style={styles.evidenceArea}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: currentPhotoUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlayBadge}>
              <Text style={styles.imageOverlayBadgeText}>✓ EVIDENCE CAPTURED</Text>
            </View>
          </View>

          <Text style={styles.evidenceNote}>
            Visual documentation attached to current incident dispatch.
          </Text>

          {/* Action Buttons for Captured Photo */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <Text style={styles.retakeButtonText}>🔄 Retake Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemovePhoto}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <Text style={styles.removeButtonText}>🗑️ Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* ============================================================ */}
      {/* STATE 4: NO PHOTO YET                                        */}
      {/* ============================================================ */}
      {!loading && !permissionDenied && !currentPhotoUri ? (
        <View style={styles.placeholderContainer}>
          <View style={styles.dashedBox}>
            <Text style={styles.cameraPlaceholderIcon}>📸</Text>
            <Text style={styles.placeholderHeading}>No Photo Evidence Yet</Text>
            <Text style={styles.placeholderSub}>
              Attach a photo of the incident scene to assist arriving emergency units.
            </Text>

            {/* Primary Action: Take Photo */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleTakePhoto}
              activeOpacity={0.8}
              disabled={disabled}
            >
              <Text style={styles.captureButtonText}>📷 Take Photo Evidence</Text>
            </TouchableOpacity>

            {/* Secondary Action: Choose from Library (Optional Fallback) */}
            {allowLibrary ? (
              <TouchableOpacity
                style={styles.libraryButton}
                onPress={handlePickFromLibrary}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <Text style={styles.libraryButtonText}>🖼️ Choose from Gallery</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeTextSuccess: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeNeutral: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeTextNeutral: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Loading State
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  // Permission Denied State
  warningContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 13,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  dismissText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '700',
    paddingLeft: 8,
  },

  // Placeholder State (No Photo Yet)
  placeholderContainer: {
    marginTop: 4,
  },
  dashedBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cameraPlaceholderIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  placeholderHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  placeholderSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  captureButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  libraryButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  libraryButtonText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },

  // Captured Photo State
  evidenceArea: {
    marginTop: 4,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageOverlayBadgeText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  evidenceNote: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  retakeButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
});
