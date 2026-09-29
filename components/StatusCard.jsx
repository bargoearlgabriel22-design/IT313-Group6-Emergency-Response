import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * StatusCard Component
 * 
 * Role (Member 1 - Presentation Layer):
 * Reusable metric and status monitoring card. Displays system readiness,
 * simulated sensor/location indicators, and community alert statuses.
 * 
 * Props:
 * @param {string} title - Card header label (e.g., "System Readiness")
 * @param {string} value - Main status display text (e.g., "Safe - Standby")
 * @param {string} statusType - 'safe' | 'warning' | 'danger' | 'info'
 * @param {string} icon - Emoji/Icon symbol representing the status metric
 * @param {string} description - Optional contextual description or note
 * @param {string} badge - Optional small pill badge text (e.g., "SIMULATED", "ACTIVE")
 * @param {function} onPress - Optional tap callback if the card is interactive
 */
export default function StatusCard({
  title = 'System Status',
  value = 'Normal',
  statusType = 'safe',
  icon = '🛡️',
  description,
  badge,
  onPress,
}) {
  // Map statusType to accent colors and background tints
  const getStatusTheme = () => {
    switch (statusType) {
      case 'danger':
        return {
          accentColor: '#DC2626',
          badgeBg: '#FEE2E2',
          badgeText: '#991B1B',
          borderColor: '#FECACA',
        };
      case 'warning':
        return {
          accentColor: '#D97706',
          badgeBg: '#FEF3C7',
          badgeText: '#92400E',
          borderColor: '#FDE68A',
        };
      case 'info':
        return {
          accentColor: '#2563EB',
          badgeBg: '#DBEAFE',
          badgeText: '#1E40AF',
          borderColor: '#BFDBFE',
        };
      case 'safe':
      default:
        return {
          accentColor: '#16A34A',
          badgeBg: '#DCFCE7',
          badgeText: '#166534',
          borderColor: '#BBF7D0',
        };
    }
  };

  const theme = getStatusTheme();
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: theme.accentColor }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.value, { color: theme.accentColor }]}>{value}</Text>

      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
