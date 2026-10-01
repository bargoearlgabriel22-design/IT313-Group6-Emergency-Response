import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * StatusCard Component
 * 
 * Layer: Presentation Layer (Member 1)
 * Purpose: Reusable metric and status display card for system readiness,
 *          emergency condition levels, and device telemetry previews.
 * 
 * Props:
 * @param {string} title - Card header label / metric title (alias: label)
 * @param {string} label - Alias for title
 * @param {string} value - Main status value to display (alias: status)
 * @param {string} status - Alias for value
 * @param {string} statusType - Theme: 'safe' | 'warning' | 'danger' | 'info'
 * @param {string} icon - Emoji / icon symbol (e.g. '🛡️', '📍', '🔋', '⚠️')
 * @param {string} description - Optional explanatory text or secondary notes
 * @param {string} badge - Optional small pill badge tag (e.g. 'LIVE', 'STANDBY')
 * @param {function} onPress - Optional tap callback if interactive
 */
export default function StatusCard({
  title,
  label,
  value,
  status,
  statusType = 'safe',
  icon = '🛡️',
  description,
  badge,
  onPress,
}) {
  const displayTitle = title || label || 'Status';
  const displayValue = value || status || 'Normal';

  // Map statusType to color themes
  const getStatusTheme = () => {
    switch (statusType) {
      case 'danger':
        return {
          accentColor: '#DC2626',
          badgeBg: '#FEE2E2',
          badgeText: '#991B1B',
          borderColor: '#FECACA',
          cardBg: '#FFFFFF',
        };
      case 'warning':
        return {
          accentColor: '#D97706',
          badgeBg: '#FEF3C7',
          badgeText: '#92400E',
          borderColor: '#FDE68A',
          cardBg: '#FFFFFF',
        };
      case 'info':
        return {
          accentColor: '#2563EB',
          badgeBg: '#DBEAFE',
          badgeText: '#1E40AF',
          borderColor: '#BFDBFE',
          cardBg: '#FFFFFF',
        };
      case 'safe':
      default:
        return {
          accentColor: '#16A34A',
          badgeBg: '#DCFCE7',
          badgeText: '#166534',
          borderColor: '#BBF7D0',
          cardBg: '#FFFFFF',
        };
    }
  };

  const theme = getStatusTheme();
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        { borderLeftColor: theme.accentColor, backgroundColor: theme.cardBg },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={styles.title}>{displayTitle}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.value, { color: theme.accentColor }]}>
        {displayValue}
      </Text>

      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
    fontSize: 12,
    fontWeight: '700',
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
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
