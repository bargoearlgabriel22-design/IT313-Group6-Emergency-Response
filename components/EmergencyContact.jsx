import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * EmergencyContact Component
 * 
 * Role (Member 1 - Presentation Layer):
 * Reusable contact card for quick-dialing and alerting emergency hotlines,
 * local responders, and family ICE (In Case of Emergency) contacts.
 * 
 * Props:
 * @param {string} name - Contact / Agency name (e.g., "Barangay Command Center")
 * @param {string} category - Service category (e.g., "Medical & Rescue", "Police")
 * @param {string} phone - Hotline or contact number (e.g., "911", "(032) 255-0000")
 * @param {string} availability - Operational status (e.g., "24/7 Active")
 * @param {string} icon - Category icon (e.g., "🚑", "🚒", "👮", "📞")
 * @param {function} onCall - Callback when call action is tapped
 * @param {function} onMessage - Callback when message/alert action is tapped
 */
export default function EmergencyContact({
  name = 'Emergency Hotline',
  category = 'General Response',
  phone = '911',
  availability = '24/7 Available',
  icon = '📞',
  onCall,
  onMessage,
}) {
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
          <Text style={styles.categoryText}>{category}</Text>
          <Text style={styles.phoneText}>{phone}</Text>
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
  categoryText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  phoneText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
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
