// AgriculturalAssistant/src/utils/theme.js

export const lightTheme = {
  // Main palette with clean, modern greens
  primary: '#34c759',
  primaryLight: '#4cd964',
  primaryDark: '#28b348',
  primaryGradient: ['#34c759', '#32d74b'],
  
  // Secondary colors
  secondary: '#5ac8fa',
  secondaryDark: '#147efb',
  accent: '#af52de',
  
  // Background system
  background: '#f8f9fa',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  surface: '#ffffff',
  surfaceAlt: '#f4f4f4',
  glass: 'rgba(255, 255, 255, 0.85)',
  
  // Text colors
  text: '#1c1c1e',
  textSecondary: '#3a3a3c',
  textTertiary: '#48484a',
  textLight: '#8e8e93',
  
  // Feedback colors
  success: '#34c759',
  warning: '#ff9500',
  danger: '#ff3b30',
  info: '#5ac8fa',
  
  // Others
  border: '#d1d1d6',
  divider: '#e5e5ea',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const darkTheme = {
  // Main palette with modern, dark-friendly green hues
  primary: '#30d158',
  primaryLight: '#30d158',
  primaryDark: '#30d158',
  primaryGradient: ['#30d158', '#32d74b'],
  
  // Background system for dark mode
  background: '#1c1c1e',
  cardBg: 'rgba(44, 44, 46, 0.95)',
  surface: '#2c2c2e',
  surfaceAlt: '#3a3a3c',
  glass: 'rgba(44, 44, 46, 0.85)',
  
  // Text colors with IMPROVED CONTRAST for visibility
  text: '#ffffff',
  textSecondary: '#f0f0f5',  // Brighter for better visibility
  textTertiary: '#e0e0e5',    // Brighter for better visibility
  textLight: '#b8b8c0',      // Brighter for better visibility
  
  // Feedback colors - brighter for dark mode
  success: '#42d978',       // Brighter green
  warning: '#ffcf40',       // Brighter yellow
  danger: '#ff625a',        // Brighter red
  info: '#80daff',          // Brighter blue
  
  // Others - maintain consistent layout properties 
  border: '#48484a',         // Slightly brighter
  divider: '#48484a',        // Slightly brighter
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// For backward compatibility
export const colors = lightTheme;

// Shadow styles
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8, 
  md: 12,
  lg: 16,
  xl: 24,
  round: 100,
};