import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * EmergencyButton Component
 * 
 * Role (Member 1 - Presentation Layer):
 * Reusable high-priority button component tailored for emergency triggers
 * and rapid response actions.
 * 
 * Props:
 * @param {string} title - Main button label (e.g., "TRIGGER SOS")
 * @param {string} subtitle - Optional explanatory text under the title
 * @param {string} variant - 'sos' | 'danger' | 'warning' | 'secondary' | 'success'
 * @param {string} icon - Emoji or icon character to display alongside title
 * @param {function} onPress - Callback function when pressed
 * @param {boolean} disabled - Whether interaction is disabled
 * @param {string} size - 'small' | 'medium' | 'large'
 */
export default function EmergencyButton({
  title = 'EMERGENCY ALERT',
  subtitle,
  variant = 'sos',
  icon = '🚨',
  onPress,
  disabled = false,
  size = 'large',
}) {
  // Determine background and border colors based on variant prop
  const getVariantStyles = () => {
    switch (variant) {
      case 'sos':
        return {
          container: styles.sosContainer,
          title: styles.sosTitle,
          subtitle: styles.sosSubtitle,
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          title: styles.dangerTitle,
          subtitle: styles.lightSubtitle,
        };
      case 'warning':
        return {
          container: styles.warningContainer,
          title: styles.warningTitle,
          subtitle: styles.darkSubtitle,
        };
      case 'success':
        return {
          container: styles.successContainer,
          title: styles.successTitle,
          subtitle: styles.lightSubtitle,
        };
      case 'secondary':
      default:
        return {
          container: styles.secondaryContainer,
          title: styles.secondaryTitle,
          subtitle: styles.secondarySubtitle,
        };
    }
  };

  // Determine sizing styles based on size prop
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.sizeSmall;
      case 'medium':
        return styles.sizeMedium;
      case 'large':
      default:
        return styles.sizeLarge;
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.baseButton,
        variantStyle.container,
        sizeStyle,
        disabled && styles.disabledButton,
      ]}
    >
      <View style={styles.contentRow}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <View style={styles.textContainer}>
          <Text style={[styles.baseTitle, variantStyle.title]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.baseSubtitle, variantStyle.subtitle]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginVertical: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseTitle: {
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  baseSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },

  // Sizing
  sizeSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sizeMedium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  sizeLarge: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 70,
  },

  // SOS Variant (High-impact Red Pulse)
  sosContainer: {
    backgroundColor: '#DC2626', // High-alert Red
    borderWidth: 2,
    borderColor: '#F87171',
  },
  sosTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  sosSubtitle: {
    color: '#FEE2E2',
  },

  // Danger Variant
  dangerContainer: {
    backgroundColor: '#B91C1C',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  dangerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  // Warning Variant
  warningContainer: {
    backgroundColor: '#F59E0B',
    borderColor: '#FBBF24',
    borderWidth: 1,
  },
  warningTitle: {
    color: '#1E293B',
    fontSize: 16,
  },

  // Success Variant
  successContainer: {
    backgroundColor: '#16A34A',
    borderColor: '#4ADE80',
    borderWidth: 1,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  // Secondary Variant
  secondaryContainer: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  secondaryTitle: {
    color: '#F8FAFC',
    fontSize: 15,
  },
  secondarySubtitle: {
    color: '#94A3B8',
  },

  // Subtitle colors
  lightSubtitle: {
    color: '#F8FAFC',
  },
  darkSubtitle: {
    color: '#334155',
  },

  disabledButton: {
    opacity: 0.5,
  },
});
