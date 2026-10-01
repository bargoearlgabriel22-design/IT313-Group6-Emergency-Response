import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * EmergencyButton Component
 * 
 * Layer: Presentation Layer (Member 1)
 * Purpose: Reusable high-visibility button component for emergency actions,
 *          SOS dispatch triggers, and key interface operations.
 * 
 * Props:
 * @param {string} title - Main button label text (e.g. "TRIGGER SOS", "CALL 911")
 * @param {string} subtitle - Optional secondary explanatory text
 * @param {string} variant - Visual style: 'sos' | 'danger' | 'warning' | 'success' | 'secondary' | 'outline'
 * @param {string} icon - Optional icon / emoji prefix (e.g. '🚨', '📞', '💾')
 * @param {function} onPress - Callback function triggered on press
 * @param {boolean} disabled - Disables interaction and reduces opacity
 * @param {string} size - Button sizing: 'small' | 'medium' | 'large'
 */
export default function EmergencyButton({
  title = 'EMERGENCY ACTION',
  subtitle,
  variant = 'sos',
  icon = '🚨',
  onPress,
  disabled = false,
  size = 'large',
}) {
  // Determine variant styling based on props
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
      case 'outline':
        return {
          container: styles.outlineContainer,
          title: styles.outlineTitle,
          subtitle: styles.outlineSubtitle,
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

  // Determine size styling based on props
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
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 6,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 22,
    marginRight: 8,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseTitle: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  baseSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },

  // Sizing variants
  sizeSmall: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  sizeMedium: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 54,
  },
  sizeLarge: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    minHeight: 68,
  },

  // Style Variants
  sosContainer: {
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  sosTitle: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  sosSubtitle: {
    color: '#FEE2E2',
  },

  dangerContainer: {
    backgroundColor: '#B91C1C',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  dangerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  warningContainer: {
    backgroundColor: '#F59E0B',
    borderColor: '#FBBF24',
    borderWidth: 1,
  },
  warningTitle: {
    color: '#1E293B',
    fontSize: 15,
  },

  successContainer: {
    backgroundColor: '#16A34A',
    borderColor: '#4ADE80',
    borderWidth: 1,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  secondaryContainer: {
    backgroundColor: '#0F172A',
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

  outlineContainer: {
    backgroundColor: 'transparent',
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
  },
  outlineTitle: {
    color: '#334155',
    fontSize: 15,
  },
  outlineSubtitle: {
    color: '#64748B',
  },

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
