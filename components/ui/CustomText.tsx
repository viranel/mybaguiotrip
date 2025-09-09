import React from 'react';
import { Platform, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { Fonts } from '../../constants/Fonts';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'buttonText' | 'overlayText';
  color?: string;
  children: React.ReactNode;
}

export default function CustomText({ 
  variant = 'body', 
  color = Colors.neutrals.gray900,
  style, 
  children, 
  ...props 
}: CustomTextProps) {
  const getTypographyStyle = (): TextStyle => {
    switch (variant) {
      case 'h1': return DesignTokens.typography.h1 as TextStyle;
      case 'h2': return DesignTokens.typography.h2 as TextStyle;
      case 'h3': return DesignTokens.typography.h3 as TextStyle;
      case 'body': return DesignTokens.typography.body as TextStyle;
      case 'bodySmall': return DesignTokens.typography.bodySmall as TextStyle;
      case 'caption': return DesignTokens.typography.caption as TextStyle;
      case 'buttonText': return DesignTokens.typography.buttonText as TextStyle;
      case 'overlayText': return DesignTokens.typography.overlayText as TextStyle;
      default: return DesignTokens.typography.body as TextStyle;
    }
  };

  const getFontFamily = (): string => {
    // Use web-safe fonts as fallbacks
    if (Platform.OS === 'web') {
      switch (variant) {
        case 'h1': 
        case 'h2': 
          return 'Nexa-Heavy, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        case 'h3': 
        case 'buttonText': 
        case 'overlayText': 
          return 'Nexa-Heavy, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        case 'bodySmall': 
        case 'caption': 
          return 'Nexa-ExtraLight, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        default: 
          return 'SpaceMono, "Courier New", monospace';
      }
    }
    
    // Mobile uses custom fonts
    switch (variant) {
      case 'h1': 
      case 'h2': 
        return Fonts.display.bold;
      case 'h3': 
      case 'buttonText': 
      case 'overlayText': 
        return Fonts.primary.semiBold;
      case 'bodySmall': 
      case 'caption': 
        return Fonts.primary.light;
      default: 
        return Fonts.primary.regular;
    }
  };

  const typographyStyle = getTypographyStyle();

  return (
    <Text
      style={[
        styles.text,
        typographyStyle,
        { 
          fontFamily: getFontFamily(),
          color 
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    // Base text styles
  },
});
