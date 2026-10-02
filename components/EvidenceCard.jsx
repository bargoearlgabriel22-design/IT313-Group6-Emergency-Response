// components/EvidenceCard.jsx
// Member 3 — Camera & Permanent Image Storage Feature
// Community Emergency Response Assistant — IT313 Group 6
//
// Platform-aware evidence card:
//   Mobile (Expo Go): native camera → expo-file-system → persistent documentDirectory
//   Web (browser):    getUserMedia webcam → canvas frame → base64 URI stored in state
//
// Props:
//   imageUri      {string|null}   — controlled URI from parent (null = no photo yet)
//   onCapture     {function}      — called with permanent URI after a successful save
//   onSelectImage {function}      — called with permanent URI after gallery selection
//   onDelete      {function}      — called when evidence is deleted
//   description   {string}        — optional label shown under the preview
//   disabled      {boolean}       — disable all interactions

import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  capturePhoto,
  captureFrameFromVideo,
  pickImageFromLibrary,
  requestCameraPermission,
  startWebCameraStream,
  stopWebCameraStream,
} from '../services/camera';

import { saveEvidenceImage, deleteEvidenceByUri } from '../services/storage';

// ────────────────────────────────────────────────────────────────────
// EvidenceCard
// ────────────────────────────────────────────────────────────────────
export default function EvidenceCard({
  imageUri = null,
  onCapture,
  onSelectImage,
  onDelete,
  onRemove,
  description = '',
  disabled = false,
  title = 'Photo Evidence',
  subtitle = '',
}) {
  // ── Internal state ──────────────────────────────────────────────
  const [internalUri, setInternalUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Working…');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [descriptionText, setDescriptionText] = useState(description);

  // Web-camera states
  const [showWebCam, setShowWebCam] = useState(false);
  const [webStream, setWebStream] = useState(null);
  const webCamContainerRef = useRef(null);
  const videoElementRef = useRef(null);

  // Use prop URI if provided (controlled), otherwise internal
  const currentPhotoUri =
    imageUri !== undefined && imageUri !== null ? imageUri : internalUri;

  // ── Web: inject live video into container div ───────────────────
  useEffect(() => {
    if (
      Platform.OS === 'web' &&
      showWebCam &&
      webStream &&
      webCamContainerRef.current
    ) {
      const video = document.createElement('video');
      video.srcObject = webStream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.style.cssText =
        'width:100%;height:100%;object-fit:cover;border-radius:10px;display:block;background:#000;';
      const container = webCamContainerRef.current;
      while (container.firstChild) container.removeChild(container.firstChild);
      container.appendChild(video);
      videoElementRef.current = video;
    }
  }, [showWebCam, webStream]);

  // ── Cleanup webcam on unmount ───────────────────────────────────
  useEffect(() => {
    return () => {
      if (webStream) stopWebCameraStream(webStream);
    };
  }, [webStream]);

  // ── Core: persist image to permanent storage ────────────────────
  async function _persistImage(tempUri) {
    setLoadingMessage('Saving image permanently…');
    const saveResult = await saveEvidenceImage(tempUri, descriptionText);
    if (!saveResult.success) {
      setErrorMessage(saveResult.error || 'Failed to save image to device storage.');
      return null;
    }
    return saveResult.evidence.permanentUri;
  }

  // ── TAKE PHOTO ──────────────────────────────────────────────────
  const handleTakePhoto = () => {
    if (disabled || loading) return;
    if (Platform.OS === 'web') {
      _openWebCam();
    } else {
      _takePhotoMobile();
    }
  };

  async function _takePhotoMobile() {
    setLoading(true);
    setLoadingMessage('Opening camera…');
    setPermissionDenied(false);
    setErrorMessage(null);

    const result = await capturePhoto();
    if (result.permissionDenied) {
      setLoading(false);
      setPermissionDenied(true);
      setErrorMessage(result.error);
      return;
    }
    if (result.canceled || !result.success) {
      setLoading(false);
      if (!result.canceled) setErrorMessage(result.error || 'Camera capture failed.');
      return;
    }

    // Permanently save the captured file
    const permanentUri = await _persistImage(result.uri);
    setLoading(false);
    if (!permanentUri) return;

    setInternalUri(permanentUri);
    if (typeof onCapture === 'function') onCapture(permanentUri);
  }

  // ── PICK FROM GALLERY ───────────────────────────────────────────
  const handlePickFromGallery = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setLoadingMessage('Opening gallery…');
    setPermissionDenied(false);
    setErrorMessage(null);

    const result = await pickImageFromLibrary();
    if (result.permissionDenied) {
      setLoading(false);
      setPermissionDenied(true);
      setErrorMessage(result.error);
      return;
    }
    if (result.canceled || !result.success) {
      setLoading(false);
      if (!result.canceled) setErrorMessage(result.error || 'Gallery selection failed.');
      return;
    }

    const permanentUri = await _persistImage(result.uri);
    setLoading(false);
    if (!permanentUri) return;

    setInternalUri(permanentUri);
    if (typeof onSelectImage === 'function') onSelectImage(permanentUri);
    else if (typeof onCapture === 'function') onCapture(permanentUri);
  };

  // ── WEB CAMERA ─────────────────────────────────────────────────
  async function _openWebCam() {
    setLoading(true);
    setLoadingMessage('Requesting camera access…');
    setPermissionDenied(false);
    setErrorMessage(null);

    const result = await startWebCameraStream();
    setLoading(false);

    if (result.permissionDenied) {
      setPermissionDenied(true);
      setErrorMessage(result.error);
      return;
    }
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to start webcam.');
      return;
    }
    setWebStream(result.stream);
    setShowWebCam(true);
  }

  const handleWebCapture = async () => {
    const captured = captureFrameFromVideo(videoElementRef.current);
    if (!captured.success) {
      setErrorMessage(captured.error);
      return;
    }
    stopWebCameraStream(webStream);
    setWebStream(null);
    setShowWebCam(false);

    setLoading(true);
    const permanentUri = await _persistImage(captured.uri);
    setLoading(false);
    if (!permanentUri) return;

    setInternalUri(permanentUri);
    if (typeof onCapture === 'function') onCapture(permanentUri);
  };

  const handleWebCamClose = () => {
    stopWebCameraStream(webStream);
    setWebStream(null);
    setShowWebCam(false);
  };

  // ── RETRY PERMISSION ────────────────────────────────────────────
  const handleRetryPermission = async () => {
    setLoading(true);
    setLoadingMessage('Requesting permission…');
    setErrorMessage(null);

    if (Platform.OS === 'web') {
      const result = await startWebCameraStream();
      setLoading(false);
      if (result.success) {
        setPermissionDenied(false);
        setWebStream(result.stream);
        setShowWebCam(true);
      } else {
        setErrorMessage(result.error);
      }
      return;
    }

    const perm = await requestCameraPermission();
    setLoading(false);
    if (perm.granted) {
      setPermissionDenied(false);
      _takePhotoMobile();
    } else {
      setErrorMessage(
        'Permission still denied. Enable camera access in your device settings.'
      );
    }
  };

  // ── DELETE PHOTO ────────────────────────────────────────────────
  const executeDelete = async () => {
    const uriToDelete = currentPhotoUri;
    setInternalUri(null);
    setErrorMessage(null);
    setDescriptionText('');

    if (uriToDelete) {
      try {
        await deleteEvidenceByUri(uriToDelete);
      } catch (err) {
        console.warn('Error deleting evidence from storage:', err);
      }
    }

    if (typeof onDelete === 'function') onDelete();
    if (typeof onRemove === 'function') onRemove();
    if (typeof onCapture === 'function') onCapture(null);
  };

  const handleDeletePhoto = () => {
    if (disabled || loading) return;

    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && typeof window.confirm === 'function'
          ? window.confirm(
              'Remove this photo from evidence? The file will also be deleted from device storage.'
            )
          : true;
      if (confirmed) {
        executeDelete();
      }
    } else {
      Alert.alert(
        '🗑️ Delete Evidence',
        'Remove this photo from evidence? The file will also be deleted from device storage.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: executeDelete,
          },
        ]
      );
    }
  };

  // ── RENDER ──────────────────────────────────────────────────────
  return (
    <View style={styles.card}>

      {/* ── Web Webcam Modal ── */}
      {Platform.OS === 'web' ? (
        <Modal
          visible={showWebCam}
          transparent
          animationType="fade"
          onRequestClose={handleWebCamClose}
        >
          <View style={styles.webCamOverlay}>
            <View style={styles.webCamContainer}>
              <View style={styles.webCamHeader}>
                <Text style={styles.webCamTitle}>📷 Camera — Evidence Capture</Text>
                <TouchableOpacity onPress={handleWebCamClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.webCamCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View ref={webCamContainerRef} style={styles.webCamVideoBox} />
              <Text style={styles.webCamHint}>
                Position the incident scene, then tap Capture.
              </Text>
              <TouchableOpacity
                style={styles.webCamCaptureBtn}
                onPress={handleWebCapture}
                activeOpacity={0.85}
              >
                <Text style={styles.webCamCaptureBtnText}>📸 Capture Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.webCamCancelBtn} onPress={handleWebCamClose}>
                <Text style={styles.webCamCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* ── Card Header ── */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📷</Text>
          <View>
            <Text style={styles.headerTitle}>Photo Evidence</Text>
            <Text style={styles.headerSubtitle}>
              {currentPhotoUri
                ? 'Image saved to device storage'
                : 'Capture or select incident photo'}
            </Text>
          </View>
        </View>
        <View style={currentPhotoUri ? styles.badgeGreen : styles.badgeGray}>
          <Text style={currentPhotoUri ? styles.badgeTextGreen : styles.badgeTextGray}>
            {currentPhotoUri ? 'SAVED' : 'EMPTY'}
          </Text>
        </View>
      </View>

      {/* ── STATE: Loading ── */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
          <Text style={styles.loadingHint}>
            {Platform.OS === 'web'
              ? 'Allow camera in the browser permission prompt.'
              : 'Please wait…'}
          </Text>
        </View>
      ) : null}

      {/* ── STATE: Permission Denied ── */}
      {!loading && permissionDenied ? (
        <View style={styles.deniedBox}>
          <Text style={styles.deniedIcon}>⚠️</Text>
          <Text style={styles.deniedTitle}>Camera Permission Required</Text>
          <Text style={styles.deniedDesc}>
            {errorMessage || 'Camera access is required to capture photo evidence.'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetryPermission}>
            <Text style={styles.retryBtnText}>🔄 Grant Permission & Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ── Error Banner ── */}
      {!loading && !permissionDenied && errorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText} numberOfLines={2}>⚠️ {errorMessage}</Text>
          <TouchableOpacity onPress={() => setErrorMessage(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.errorDismiss}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ── STATE: Photo Captured — show preview ── */}
      {!loading && !permissionDenied && currentPhotoUri ? (
        <View>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: currentPhotoUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>✓ EVIDENCE CAPTURED</Text>
            </View>
          </View>

          {/* Description field */}
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add a description (optional)…"
            placeholderTextColor="#94A3B8"
            value={descriptionText}
            onChangeText={setDescriptionText}
            multiline
            numberOfLines={2}
            editable={!disabled}
          />

          <Text style={styles.storageNote}>
            📂 File saved permanently in device document storage.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.retakeBtn]}
              onPress={handleTakePhoto}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={styles.retakeBtnText}>🔄 Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.galleryBtn]}
              onPress={handlePickFromGallery}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={styles.galleryBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDeletePhoto}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* ── STATE: No Photo Yet ── */}
      {!loading && !permissionDenied && !currentPhotoUri ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyTitle}>No Photo Evidence Yet</Text>
          <Text style={styles.emptyNote}>
            Attach a photo of the incident scene to assist emergency responders.
            Images are saved permanently to your device.
          </Text>

          <TouchableOpacity
            style={styles.captureBtn}
            onPress={handleTakePhoto}
            disabled={disabled}
            activeOpacity={0.85}
          >
            <Text style={styles.captureBtnText}>📷 Take Photo Evidence</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryPickBtn}
            onPress={handlePickFromGallery}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={styles.galleryPickBtnText}>🖼️ Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────────────
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

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerIcon: { fontSize: 22, marginRight: 10 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 11, color: '#64748B', marginTop: 1 },
  badgeGreen: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeTextGreen: { color: '#166534', fontSize: 10, fontWeight: '800' },
  badgeGray: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeTextGray: { color: '#64748B', fontSize: 10, fontWeight: '600' },

  // Loading
  loadingBox: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingText: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginTop: 12 },
  loadingHint: { fontSize: 11, color: '#64748B', marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },

  // Permission denied
  deniedBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  deniedIcon: { fontSize: 28, marginBottom: 6 },
  deniedTitle: { fontSize: 14, fontWeight: '700', color: '#991B1B', marginBottom: 4 },
  deniedDesc: { fontSize: 12, color: '#7F1D1D', textAlign: 'center', lineHeight: 17, marginBottom: 14 },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Error banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  errorText: { fontSize: 11, color: '#92400E', flex: 1 },
  errorDismiss: { fontSize: 14, color: '#92400E', fontWeight: '700', paddingLeft: 8 },

  // Photo preview
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    marginBottom: 10,
  },
  previewImage: { width: '100%', height: 220, borderRadius: 12 },
  imageBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imageBadgeText: { color: '#4ADE80', fontSize: 11, fontWeight: '700' },
  storageNote: { fontSize: 11, color: '#166534', marginBottom: 10 },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  retakeBtn: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1' },
  retakeBtnText: { color: '#0F172A', fontSize: 12, fontWeight: '600' },
  galleryBtn: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
  galleryBtnText: { color: '#1E40AF', fontSize: 12, fontWeight: '600' },
  deleteBtn: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  deleteBtnText: { color: '#DC2626', fontSize: 12, fontWeight: '600' },

  // Empty state
  emptyBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  emptyNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 18,
  },
  captureBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  captureBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  galleryPickBtn: { paddingVertical: 8, alignItems: 'center' },
  galleryPickBtnText: { color: '#475569', fontSize: 12, fontWeight: '600' },

  // Web Webcam Modal
  webCamOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webCamContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 520,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  webCamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  webCamTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  webCamCloseText: { color: '#94A3B8', fontSize: 20, fontWeight: '700' },
  webCamVideoBox: {
    width: '100%',
    height: 300,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  webCamHint: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
  },
  webCamCaptureBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  webCamCaptureBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  webCamCancelBtn: { paddingVertical: 8, alignItems: 'center' },
  webCamCancelText: { color: '#64748B', fontSize: 12 },
});
