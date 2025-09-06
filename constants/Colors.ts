/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  primary: {
    orange500: '#FB923C',
    orange600: '#F97316',
    orange700: '#EA580C',
    orange400: '#FDBA74',
    orange300: '#FED7AA',
  },
  secondary: {
    coral: '#F97316',
    coralLight: '#FB923C',
    teal: '#14B8A6',
    green: '#22C55E',
    orange: '#F59E0B',
  },
  neutrals: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },
  functional: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  semantic: {
    success: '#22C55E',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },
  gradients: {
    primary: ['#FB923C', '#F97316'] as const,
    secondary: ['#F97316', '#EA580C'] as const,
    sunset: ['#FB923C', '#F97316', '#EA580C'] as const,
  },
  appIdentity: {
    primaryBrand: '#FB923C',
    primaryBrandLight: '#FED7AA',
    accentBrand: '#F97316',
    gradient: ['#FB923C', '#F97316'] as const,
  },
  light: {
    text: '#334155',
    background: '#F8FAFC',
    tint: '#FB923C',
    tabIconDefault: '#64748B',
    tabIconSelected: '#FB923C',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: '#FB923C',
    tabIconDefault: '#64748B',
    tabIconSelected: '#FB923C',
  },
};
