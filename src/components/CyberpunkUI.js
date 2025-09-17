import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { CyberpunkTheme } from '../theme/CyberpunkTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Cross-platform shadow helper that fixes React Native Web warnings
const createShadow = (color, offset = { width: 0, height: 0 }, opacity = 0.3, radius = 10) => {
  if (Platform.OS === 'web') {
    // Use boxShadow for web to avoid deprecated shadow* warnings
    const rgbColor = hexToRgb(color);
    return {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px rgba(${rgbColor}, ${opacity})`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius / 2,
  };
};

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// Cross-platform text shadow helper
const createTextShadow = (color, opacity = 0.8, blur = 10) => {
  if (Platform.OS === 'web') {
    const rgbColor = hexToRgb(color);
    return {
      textShadow: `0 0 ${blur}px rgba(${rgbColor}, ${opacity})`,
    };
  }
  return {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: blur,
  };
};

// Accessible Neon Button Component
export const NeonButton = ({ 
  title, 
  onPress, 
  style, 
  disabled = false, 
  variant = 'primary',
  children,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const colors = CyberpunkTheme.colors;
  const buttonColors = {
    primary: [colors.neonCyan, colors.primary],
    secondary: [colors.neonPink, colors.secondary],
    success: [colors.neonGreen, colors.success],
    warning: [colors.neonOrange, colors.warning],
    error: [colors.error, '#E60033'],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.buttonContainer, 
        createShadow(buttonColors[variant][0], { width: 0, height: 2 }, 0.4, 8),
        {
          borderColor: buttonColors[variant][0] + '60',
        },
        style
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
    >
      <LinearGradient
        colors={disabled ? ['#666666', '#444444'] : buttonColors[variant]}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {children || (
          <Text style={[styles.buttonText, { opacity: disabled ? 0.5 : 1 }]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Accessible Neon Card Component
export const NeonCard = ({ 
  children, 
  style, 
  glowColor = CyberpunkTheme.colors.neonCyan,
  glowIntensity = 0.3,
  onPress,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  testID,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      style={[
        styles.card,
        createShadow(glowColor, { width: 0, height: 0 }, glowIntensity, 15),
        {
          borderColor: glowColor + '40',
        },
        style
      ]}
    >
      <CardComponent
        onPress={onPress}
        activeOpacity={onPress ? 0.9 : 1}
        accessible={accessible && !!onPress}
        accessibilityRole={onPress ? accessibilityRole : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
        style={styles.cardContent}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
          style={styles.cardGradient}
        >
          {children}
        </LinearGradient>
      </CardComponent>
    </Animatable.View>
  );
};

// Accessible CyberText Component
export const CyberText = ({ 
  children, 
  variant = 'body', 
  style, 
  glow = false,
  glowIntensity = 0.6,
  glowColor = CyberpunkTheme.colors.neonCyan,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = "text",
  testID,
  ...props 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'headline':
        return styles.headlineText;
      case 'title':
        return styles.titleText;
      case 'subtitle':
        return styles.subtitleText;
      case 'body':
        return styles.bodyText;
      case 'caption':
        return styles.captionText;
      case 'button':
        return styles.buttonText;
      default:
        return styles.bodyText;
    }
  };

  const glowStyle = glow ? createTextShadow(glowColor, glowIntensity, 10) : {};

  return (
    <Text
      style={[
        getVariantStyle(),
        { color: CyberpunkTheme.colors.textPrimary },
        glowStyle,
        style
      ]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}
      {...props}
    >
      {children}
    </Text>
  );
};

// Accessible CyberButton Component
export const CyberButton = ({ 
  children, 
  onPress, 
  style, 
  disabled = false, 
  variant = 'primary',
  glowIntensity = 0.5,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  testID,
  title, // Add title prop for backward compatibility
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return [CyberpunkTheme.colors.neonCyan, CyberpunkTheme.colors.primary];
      case 'secondary':
        return [CyberpunkTheme.colors.neonPink, CyberpunkTheme.colors.secondary];
      case 'accent':
        return [CyberpunkTheme.colors.accent, CyberpunkTheme.colors.neonGreen];
      default:
        return [CyberpunkTheme.colors.surface, CyberpunkTheme.colors.background];
    }
  };

  // Properly handle text children to avoid View text node errors
  const renderContent = () => {
    if (children) {
      // If children is a string, wrap it in a Text component
      if (typeof children === 'string') {
        return (
          <Text style={styles.cyberButtonText}>
            {children}
          </Text>
        );
      }
      return children;
    }
    if (title) {
      return (
        <Text style={styles.cyberButtonText}>
          {title}
        </Text>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.cyberButton,
        createShadow(getVariantColors()[0], { width: 0, height: 2 }, glowIntensity, 8),
        {
          borderColor: getVariantColors()[0] + '60',
        },
        style
      ]}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <LinearGradient
        colors={disabled ? ['#333333', '#222222'] : getVariantColors()}
        style={styles.cyberButtonGradient}
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Accessible CyberInput Component
export const CyberInput = ({
  style,
  placeholder,
  value,
  onChangeText,
  glowIntensity = 0.3,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  return (
    <View style={[
      styles.cyberInputContainer,
      createShadow(CyberpunkTheme.colors.neonCyan, { width: 0, height: 0 }, glowIntensity, 8),
      {
        borderColor: CyberpunkTheme.colors.neonCyan + '40',
      },
      style
    ]}>
      <TextInput
        style={styles.cyberInput}
        placeholder={placeholder}
        placeholderTextColor={CyberpunkTheme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel || placeholder}
        accessibilityHint={accessibilityHint}
        testID={testID}
        {...props}
      />
    </View>
  );
};

// Accessible CyberIcon Component
export const CyberIcon = ({
  name,
  size = 24,
  color = CyberpunkTheme.colors.textPrimary,
  style,
  accessible = true,
  accessibilityLabel,
  testID,
}) => {
  return (
    <Icon
      name={name}
      size={size}
      color={color}
      style={style}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
};

// HoloDivider Component
export const HoloDivider = ({ 
  style, 
  glowColor = CyberpunkTheme.colors.neonCyan,
  accessible = false 
}) => {
  return (
    <View 
      style={[styles.holoDivider, style]} 
      accessible={accessible}
      accessibilityRole="none"
    >
      <LinearGradient
        colors={[
          'transparent',
          glowColor + '60',
          glowColor,
          glowColor + '60',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.holoDividerGradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: CyberpunkTheme.spacing.md,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CyberpunkTheme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    borderRadius: CyberpunkTheme.borderRadius.lg,
    borderWidth: 1,
    backgroundColor: CyberpunkTheme.colors.surface,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    padding: CyberpunkTheme.spacing.md,
  },
  cyberButton: {
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 48, // Accessibility minimum touch target
  },
  cyberButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: CyberpunkTheme.spacing.md,
    paddingHorizontal: CyberpunkTheme.spacing.lg,
  },
  cyberButtonText: {
    color: CyberpunkTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    textAlign: 'center',
    letterSpacing: 1,
  },
  cyberInputContainer: {
    borderRadius: CyberpunkTheme.borderRadius.md,
    borderWidth: 1,
    backgroundColor: CyberpunkTheme.colors.surface,
    paddingHorizontal: CyberpunkTheme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? CyberpunkTheme.spacing.md : CyberpunkTheme.spacing.sm,
    minHeight: 48, // Accessibility minimum touch target
  },
  cyberInput: {
    color: CyberpunkTheme.colors.textPrimary,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    ...Platform.select({
      web: {
        outlineWidth: 0, // Remove default web outline - proper web style
        outlineStyle: 'none',
        border: 'none', // Also remove border to prevent focus rings
      },
    }),
  },
  headlineText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    lineHeight: 24,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 0.4,
    opacity: 0.8,
  },
  holoDivider: {
    height: 2,
    width: '100%',
    marginVertical: CyberpunkTheme.spacing.md,
  },
  holoDividerGradient: {
    flex: 1,
    height: '100%',
  },
});

export default {
  NeonButton,
  NeonCard,
  CyberText,
  CyberButton,
  CyberInput,
  CyberIcon,
  HoloDivider,
};