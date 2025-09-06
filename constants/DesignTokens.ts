/**
 * Modern Design System Tokens based on travel app inspiration
 * Clean, modern design tokens with enhanced shadows and spacing
 */

export const DesignTokens = {
  // Modern Spacing Scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Modern Border Radius Scale
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    pill: 25,
    circular: 50,
    extraLarge: 24,
  },
  
  // Modern Typography Scale
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    overlayText: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
  },
  
  // Enhanced Shadow System for modern depth
  shadows: {
    small: {
      color: 'rgba(0,0,0,0.06)',
      offset: { x: 0, y: 2 },
      blur: 8,
      spread: 0,
    },
    medium: {
      color: 'rgba(0,0,0,0.08)',
      offset: { x: 0, y: 4 },
      blur: 16,
      spread: 0,
    },
    large: {
      color: 'rgba(0,0,0,0.12)',
      offset: { x: 0, y: 8 },
      blur: 24,
      spread: 0,
    },
    button: {
      color: 'rgba(0,122,255,0.25)',
      offset: { x: 0, y: 4 },
      blur: 16,
      spread: 0,
    },
    card: {
      color: 'rgba(0,0,0,0.04)',
      offset: { x: 0, y: 2 },
      blur: 12,
      spread: 0,
    },
  },
  
  // Animation Durations
  animations: {
    buttonPress: 150,
    cardAppear: 300,
    slideTransition: 250,
    fadeIn: 200,
  },
  
  // Modern Icon Sizes
  iconSizes: {
    navigation: 24,
    actionPrimary: 24,
    actionSecondary: 20,
    cardIcon: 20,
    mapPin: 24,
    small: 16,
    medium: 20,
    large: 24,
  },
  
  // Touch Targets
  accessibility: {
    minTouchTarget: 44,
    cardPadding: 20,
  },
};
