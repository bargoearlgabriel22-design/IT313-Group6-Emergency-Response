import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Reusable Presentation Components (Member 1)
import EmergencyButton from '../components/EmergencyButton';

/**
 * Profile Screen (app/profile.jsx)
 * 
 * Role (Member 1 - Presentation Layer & Main Navigation):
 * Displays user identity and emergency contact (ICE) information.
 * Uses local state to support editing and presentation demonstrations.
 */
export default function ProfileScreen() {
  // ----------------------------------------------------
  // Local State (Member 1 UI Presentation)
  // ----------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);

  // User Profile State (Placeholder values)
  const [name, setName] = useState('Juan Dela Cruz');
  const [studentId, setStudentId] = useState('2023-01234');
  const [course, setCourse] = useState('BS Information Technology');
  const [yearLevel, setYearLevel] = useState('3rd Year');

  // Emergency Contact State (Placeholder values)
  const [contactName, setContactName] = useState('Maria Dela Cruz');
  const [contactPhone, setContactPhone] = useState('0917-123-4567');
  const [relationship, setRelationship] = useState('Parent / Guardian');

  const handleSaveOrEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      Alert.alert(
        'Profile Updated',
        'Profile changes saved in temporary state.\n(Persistent storage handled by Member 4).'
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
          <Text style={styles.headerTitle}>Profile & ICE Info</Text>
          <Text style={styles.headerSubtitle}>
            Personal and In Case of Emergency Details
          </Text>
        </View>

        {/* User Avatar & Basic Info Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userNameText}>{name}</Text>
            <Text style={styles.userRoleText}>{course} • {yearLevel}</Text>
            <Text style={styles.userStudentIdText}>ID: {studentId}</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* User Information Section                                      */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>User Information</Text>
          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                />
              ) : (
                <Text style={styles.fieldValue}>{name}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Student ID</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Enter student ID"
                />
              ) : (
                <Text style={styles.fieldValue}>{studentId}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Course</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={course}
                  onChangeText={setCourse}
                  placeholder="Enter course"
                />
              ) : (
                <Text style={styles.fieldValue}>{course}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Year Level</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={yearLevel}
                  onChangeText={setYearLevel}
                  placeholder="Enter year level"
                />
              ) : (
                <Text style={styles.fieldValue}>{yearLevel}</Text>
              )}
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* Emergency Contact (ICE) Section                               */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Emergency Contact (ICE)</Text>
          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Contact Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={contactName}
                  onChangeText={setContactName}
                  placeholder="Enter contact name"
                />
              ) : (
                <Text style={styles.fieldValue}>{contactName}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={[styles.fieldValue, styles.phoneValue]}>
                  {contactPhone}
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Relationship</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
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

        {/* Edit / Save Profile Action Button */}
        <View style={styles.actionSection}>
          <EmergencyButton
            title={isEditing ? 'SAVE PROFILE CHANGES' : 'EDIT PROFILE'}
            subtitle={
              isEditing
                ? 'Save modifications to current session state'
                : 'Modify personal and emergency contact information'
            }
            variant={isEditing ? 'success' : 'secondary'}
            icon={isEditing ? '💾' : '✏️'}
            size="medium"
            onPress={handleSaveOrEdit}
          />
        </View>

        {/* Defense Note Card */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>💡 Member 1 Presentation Note</Text>
          <Text style={styles.noteText}>
            Profile data is currently handled in React State for UI demonstration.
            Persistent storage (AsyncStorage/SecureStore) is reserved for Member 4.
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
    paddingBottom: 28,
  },
  header: {
    backgroundColor: '#0F172A',
    marginHorizontal: -16,
    marginTop: -14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  avatarInfo: {
    flex: 1,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRoleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  userStudentIdText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
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
    paddingVertical: 8,
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
  phoneValue: {
    color: '#DC2626',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
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
  noteText: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 16,
  },
});
