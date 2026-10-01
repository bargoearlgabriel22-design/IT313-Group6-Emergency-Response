import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Reusable Presentation Components (Member 1)
import EmergencyButton from '../components/EmergencyButton';
import EmergencyContact from '../components/EmergencyContact';
import StatusCard from '../components/StatusCard';

/**
 * ============================================================================
 * PROFILE SCREEN (app/profile.jsx)
 * ============================================================================
 * 
 * Layer: Presentation Layer & Profile UI (Member 1)
 * Purpose: Displays user identity and primary In Case of Emergency (ICE) details.
 * 
 * Key Features:
 * 1. User Name & Identity Header
 * 2. User Basic Information (Course, Student ID, Contact, Blood Type)
 * 3. Emergency Contact Information (ICE Contact Name, Phone, Relationship)
 * 4. Interactive Edit/Save state for oral defense demonstration
 * 5. Reusable UI components (EmergencyButton, EmergencyContact, StatusCard)
 * 
 * Oral Defense Explanation:
 * - Data is held in local React state for demonstration.
 * - No complex backend authentication or cloud databases are used.
 * - Member 4 will later integrate persistent storage via services/storage.js.
 */
export default function ProfileScreen() {
  // ----------------------------------------------------
  // Local State Management (Member 1 UI Presentation)
  // ----------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);

  // User Profile Info
  const [name, setName] = useState('Juan Dela Cruz');
  const [studentId, setStudentId] = useState('2023-01234');
  const [course, setCourse] = useState('BS Information Technology');
  const [yearLevel, setYearLevel] = useState('3rd Year');
  const [bloodType, setBloodType] = useState('O+');
  const [homeAddress, setHomeAddress] = useState('Sector 4, Barangay Central');

  // ICE Emergency Contact Info
  const [contactName, setContactName] = useState('Maria Dela Cruz');
  const [contactPhone, setContactPhone] = useState('0917-123-4567');
  const [relationship, setRelationship] = useState('Parent / Guardian');

  // ----------------------------------------------------
  // UI Event Handlers
  // ----------------------------------------------------
  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      Alert.alert(
        'Profile Saved',
        'Profile details successfully updated in session state.\n(Persistent storage handled by Member 4 in services/storage.js).'
      );
    } else {
      setIsEditing(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Profile & ICE Info</Text>
          <Text style={styles.headerSubtitle}>
            Personal identity and emergency contact registry
          </Text>
        </View>

        {/* User Avatar Summary Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userSub}>{course} • {yearLevel}</Text>
            <Text style={styles.userId}>ID: {studentId} • Blood: {bloodType}</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* USER INFORMATION SECTION                                      */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.card}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                />
              ) : (
                <Text style={styles.fieldValue}>{name}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Student ID */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Student / Citizen ID</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Enter student ID"
                />
              ) : (
                <Text style={styles.fieldValue}>{studentId}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Course / Program */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Course / Program</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={course}
                  onChangeText={setCourse}
                  placeholder="Enter course"
                />
              ) : (
                <Text style={styles.fieldValue}>{course}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Year Level */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Year Level</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={yearLevel}
                  onChangeText={setYearLevel}
                  placeholder="Enter year level"
                />
              ) : (
                <Text style={styles.fieldValue}>{yearLevel}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Blood Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Blood Type</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={bloodType}
                  onChangeText={setBloodType}
                  placeholder="Enter blood type"
                />
              ) : (
                <Text style={styles.fieldValue}>{bloodType}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Home Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Community Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={homeAddress}
                  onChangeText={setHomeAddress}
                  placeholder="Enter address"
                />
              ) : (
                <Text style={styles.fieldValue}>{homeAddress}</Text>
              )}
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* EMERGENCY CONTACT INFORMATION (ICE) SECTION                   */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact Information (ICE)</Text>
          <View style={styles.card}>
            {/* Contact Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Emergency Contact Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={contactName}
                  onChangeText={setContactName}
                  placeholder="Enter ICE contact name"
                />
              ) : (
                <Text style={styles.fieldValue}>{contactName}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Phone Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Emergency Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  placeholder="Enter emergency phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={[styles.fieldValue, styles.phoneHighlight]}>
                  {contactPhone}
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Relationship */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Relationship</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={relationship}
                  onChangeText={setRelationship}
                  placeholder="Enter relationship"
                />
              ) : (
                <Text style={styles.fieldValue}>{relationship}</Text>
              )}
            </View>
          </View>
        </View>

        {/* ICE Quick Contact Preview Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ICE Contact Preview</Text>
          <EmergencyContact
            name={contactName}
            relationship={relationship}
            phone={contactPhone}
            availability="Primary In Case of Emergency (ICE)"
            icon="👤"
            onCall={() =>
              Alert.alert('Call ICE', `Calling ${contactName} at ${contactPhone}...`)
            }
            onMessage={() =>
              Alert.alert('Alert ICE', `Sending emergency SMS alert to ${contactName}...`)
            }
          />
        </View>

        {/* Edit / Save Action Button */}
        <View style={styles.actionSection}>
          <EmergencyButton
            title={isEditing ? 'SAVE PROFILE CHANGES' : 'EDIT PROFILE DETAILS'}
            subtitle={
              isEditing
                ? 'Save modifications to active React state'
                : 'Tap to edit personal and emergency contact information'
            }
            variant={isEditing ? 'success' : 'secondary'}
            icon={isEditing ? '💾' : '✏️'}
            size="medium"
            onPress={handleToggleEdit}
          />
        </View>

        {/* Member 1 Presentation Note Card */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>💡 Member 1 Presentation Note</Text>
          <Text style={styles.noteBody}>
            Profile data is maintained via local React state for demonstration.
            Member 4 will integrate offline persistence using AsyncStorage/SecureStore
            in services/storage.js.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  userSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  userId: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  fieldGroup: {
    paddingVertical: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  phoneHighlight: {
    color: '#DC2626',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  actionSection: {
    marginVertical: 10,
  },
  noteCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 12,
    marginTop: 4,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  noteBody: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 16,
  },
});
