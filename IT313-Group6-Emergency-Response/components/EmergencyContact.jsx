import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * EmergencyContact Component
 * 
 * Layer: Presentation Layer (Member 1)
 * Purpose: Reusable card for displaying emergency contact information,
 *          In Case of Emergency (ICE) family members, and institutional hotlines.
 * 
 * Props:
 * @param {string} name - Contact / Agency name (e.g. "Juan Dela Cruz", "911 National Dispatch")
 * @param {string} phone - Contact phone number (e.g. "0917-123-4567", "911")
 * @param {string} relationship - Relationship or agency category (e.g. "Parent / Guardian", "Police")
 * @param {string} category - Alias for relationship
 * @param {string} availability - Operational availability (e.g. "24/7 Priority", "Primary ICE")
 * @param {string} icon - Emoji / icon character (e.g. '👤', '🚨', '🚑', '🚒')
 * @param {function} onCall - Optional callback function for calling the contact
 * @param {function} onMessage - Optional callback function for messaging / alerting
 */
export default function EmergencyContact({
  name = 'Primary Emergency Contact',
  phone = '09XXXXXXXXX',
  relationship,
  category,
  availability = '24/7 Available',
  icon = '👤',
  onCall,
  onMessage,
}) {
  const displayRole = relationship || category || 'Emergency Contact';

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.roleText}>{displayRole}</Text>
          <Text style={styles.phoneText}>{phone}</Text>
          {availability ? (
            <Text style={styles.availabilityText}>• {availability}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {onCall ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionButton, styles.callButton]}
            onPress={onCall}
          >
            <Text style={styles.callButtonText}>📞 Call</Text>
          </TouchableOpacity>
        ) : null}

        {onMessage ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionButton, styles.messageButton]}
            onPress={onMessage}
          >
            <Text style={styles.messageButtonText}>💬 Alert</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconText: {
    fontSize: 20,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  phoneText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 2,
  },
  availabilityText: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '600',
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: '#16A34A',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  messageButton: {
    backgroundColor: '#0F172A',
  },
  messageButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
});
