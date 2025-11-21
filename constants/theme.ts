/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const primaryColor = '#007AFF'; // Digital Blue - Trust, Clarity, Technology, Focus
const secondaryColor = '#FF3B30'; // Vibrant Coral - Urgency, Energy, Action, Motivation
const backgroundColor = '#FFFFFF'; // Pure White - Cleanliness, Simplicity, Max Contrast
const accentColor = '#34C759'; // Success Green - Progress, Completion, Achievement
const textDarkColor = '#1C1C1E'; // Near-Black - Sharpness, High Contrast

export const Colors = {
  light: {
    text: textDarkColor,
    background: backgroundColor,
    tint: primaryColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F0F0F', // Dark background for contrast
    tint: primaryColor,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
