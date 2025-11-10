/**
 * PRIME MEDIA Color Palette
 * Extracted from the brand image
 * 
 * Usage:
 * - Use these colors for consistent theming across the application
 * - Gradient combinations create the signature PRIME look
 */

export const primeColors = {
  // Dark Base Colors
  dark: '#0a0a1f',      // Deep space blue-black
  navy: '#1a1a3e',      // Rich navy blue
  purple: '#2d1b4e',    // Deep purple

  // Accent Colors
  cyan: '#00d9ff',      // Bright cyan
  blue: '#4169e1',      // Royal blue
  magenta: '#ff00ff',   // Vivid magenta
  pink: '#ff1493',      // Deep pink

  // Neutral Colors
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
} as const;

/**
 * Gradient Combinations
 */
export const primeGradients = {
  // Primary Gradients
  cyanBlue: `linear-gradient(135deg, ${primeColors.cyan}, ${primeColors.blue})`,
  bluePurple: `linear-gradient(135deg, ${primeColors.blue}, ${primeColors.purple})`,
  cyanMagenta: `linear-gradient(135deg, ${primeColors.cyan}, ${primeColors.magenta})`,
  magentaPink: `linear-gradient(135deg, ${primeColors.magenta}, ${primeColors.pink})`,

  // Background Gradients
  darkBase: `linear-gradient(135deg, ${primeColors.dark}, ${primeColors.navy}, ${primeColors.purple})`,
  heroBg: `linear-gradient(to bottom right, ${primeColors.dark} 0%, ${primeColors.navy} 50%, ${primeColors.purple} 100%)`,

  // Overlay Gradients (with transparency)
  cyanOverlay: `linear-gradient(135deg, ${primeColors.cyan}33, transparent)`,
  magentaOverlay: `linear-gradient(135deg, ${primeColors.magenta}33, transparent)`,
  blueOverlay: `linear-gradient(135deg, ${primeColors.blue}1a, transparent)`,
} as const;

/**
 * Tailwind Color Classes
 */
export const primeTailwind = {
  // Background classes
  bg: {
    dark: 'bg-[#0a0a1f]',
    navy: 'bg-[#1a1a3e]',
    purple: 'bg-[#2d1b4e]',
    cyan: 'bg-[#00d9ff]',
    blue: 'bg-[#4169e1]',
    magenta: 'bg-[#ff00ff]',
  },

  // Text classes
  text: {
    cyan: 'text-[#00d9ff]',
    blue: 'text-[#4169e1]',
    magenta: 'text-[#ff00ff]',
    pink: 'text-[#ff1493]',
  },

  // Border classes
  border: {
    cyan: 'border-[#00d9ff]',
    blue: 'border-[#4169e1]',
    magenta: 'border-[#ff00ff]',
  },

  // Gradient classes
  gradient: {
    cyanBlue: 'bg-linear-to-r from-[#00d9ff] to-[#4169e1]',
    bluePurple: 'bg-linear-to-r from-[#4169e1] to-[#2d1b4e]',
    cyanMagenta: 'bg-linear-to-r from-[#00d9ff] to-[#ff00ff]',
    darkBase: 'bg-linear-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#2d1b4e]',
  }
} as const;

/**
 * Color Utilities
 */
export const colorUtils = {
  /**
   * Convert hex to RGB
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Get color with opacity
   */
  withOpacity: (hex: string, opacity: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },
};

export default primeColors;
