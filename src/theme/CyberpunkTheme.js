// Cyberpunk Theme Configuration
export const CyberpunkTheme = {
  colors: {
    // Primary cyberpunk colors
    primary: '#00FFFF', // Cyan/Electric Blue
    primaryVariant: '#0099CC',
    secondary: '#FF00FF', // Magenta/Hot Pink
    secondaryVariant: '#CC0099',
    
    // Neon accent colors
    neonGreen: '#00FF00',
    neonOrange: '#FF6600',
    neonPink: '#FF69B4',
    neonPurple: '#9966FF',
    neonYellow: '#FFFF00',
    
    // Background colors
    background: '#0A0A0A', // Deep black
    surface: '#1A1A1A', // Dark gray
    surfaceVariant: '#2A2A2A', // Lighter dark
    
    // Text colors
    onBackground: '#FFFFFF',
    onSurface: '#E0E0E0',
    onPrimary: '#000000',
    onSecondary: '#000000',
    
    // Status colors
    success: '#00FF88',
    warning: '#FFB300',
    error: '#FF3366',
    info: '#33AAFF',
    
    // Glass morphism effects
    glassBackground: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    
    // Card backgrounds with transparency
    cardBackground: 'rgba(26, 26, 26, 0.8)',
    overlayBackground: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Typography with futuristic fonts
  fonts: {
    displayLarge: {
      fontFamily: 'System',
      fontSize: 48,
      fontWeight: '300',
      letterSpacing: 2,
    },
    displayMedium: {
      fontFamily: 'System',
      fontSize: 36,
      fontWeight: '400',
      letterSpacing: 1.5,
    },
    headlineLarge: {
      fontFamily: 'System',
      fontSize: 28,
      fontWeight: '600',
      letterSpacing: 1,
    },
    titleLarge: {
      fontFamily: 'System',
      fontSize: 24,
      fontWeight: '500',
      letterSpacing: 0.5,
    },
    bodyLarge: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0.25,
    },
    bodyMedium: {
      fontFamily: 'System',
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.25,
    },
    labelLarge: {
      fontFamily: 'System',
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  },
  
  // Border radius and spacing
  roundness: 8,
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Animation configurations
  animations: {
    scale: 1.02,
    duration: 200,
    easing: 'ease-in-out',
  },
  
  // Shadow effects
  shadows: {
    neon: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// Light theme fallback (for users who prefer it)
export const LightTheme = {
  colors: {
    primary: '#2196F3',
    primaryVariant: '#1976D2',
    secondary: '#FF5722',
    secondaryVariant: '#E64A19',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#EEEEEE',
    onBackground: '#212121',
    onSurface: '#424242',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    cardBackground: '#FFFFFF',
    overlayBackground: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: CyberpunkTheme.fonts,
  roundness: 8,
  spacing: CyberpunkTheme.spacing,
  animations: CyberpunkTheme.animations,
};