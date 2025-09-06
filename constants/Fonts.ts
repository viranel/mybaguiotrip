/**
 * Font system for My Baguio Trip app
 * Using Nexa font family as preferred by user
 */

export const Fonts = {
  // Primary font family (Nexa - only using available fonts)
  primary: {
    light: 'Nexa-ExtraLight',
    regular: 'Nexa-ExtraLight', // Using ExtraLight as regular since it's available
    medium: 'Nexa-ExtraLight', // Using ExtraLight as medium
    semiBold: 'Nexa-Heavy', // Using Heavy as semiBold
    bold: 'Nexa-Heavy',
    heavy: 'Nexa-Heavy',
  },
  
  // Display font family (for headings)
  display: {
    light: 'Nexa-ExtraLight',
    regular: 'Nexa-ExtraLight',
    medium: 'Nexa-ExtraLight',
    semiBold: 'Nexa-Heavy',
    bold: 'Nexa-Heavy',
    heavy: 'Nexa-Heavy',
  },
  
  // Fallback fonts
  fallback: {
    primary: 'System',
    display: 'System',
  },
};
