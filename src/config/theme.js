/**
 * Theme Configuration
 * Centralized theme variables for consistent styling across the application
 * Supports both light and dark modes
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#3B78BD',      // Primary blue
    light: '#5A92D4',
    dark: '#2B5A8F',
    contrast: '#FFFFFF',
  },

  // Secondary Brand Colors
  secondary: {
    main: '#F0B652',      // Yellow/Gold
    light: '#F5C976',
    dark: '#D89D3A',
    contrast: '#000000',
  },

  // Accent Colors
  accent: {
    green: '#2b7d54',     // Success green
    greenLight: '#3A9D6B',
    greenDark: '#1F5A3C',
    red: '#f06752',       // Error/Warning red
    redLight: '#F5857A',
    redDark: '#D84E3A',
  },

  // Neutral Colors - Light Mode
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focus: '#3B78BD',
    },
    hover: {
      primary: '#F3F4F6',
      secondary: '#E5E7EB',
    },
  },

  // Neutral Colors - Dark Mode
  dark: {
    background: {
      primary: '#111827',
      secondary: '#1F2937',
      tertiary: '#374151',
    },
    surface: {
      primary: '#1F2937',
      secondary: '#374151',
      elevated: '#4B5563',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
      disabled: '#6B7280',
    },
    border: {
      primary: '#374151',
      secondary: '#4B5563',
      focus: '#F0B652',
    },
    hover: {
      primary: '#374151',
      secondary: '#4B5563',
    },
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};

// Tailwind class generators for theme colors
export const getThemeClasses = (isDark = false) => {
  const mode = isDark ? 'dark' : 'light';

  return {
    // Background classes
    bg: {
      primary: isDark ? 'bg-gray-900' : 'bg-white',
      secondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
      surface: isDark ? 'bg-gray-800' : 'bg-white',
      elevated: isDark ? 'bg-gray-700' : 'bg-white',
    },

    // Text classes
    text: {
      primary: isDark ? 'text-gray-100' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      tertiary: isDark ? 'text-gray-400' : 'text-gray-500',
      disabled: isDark ? 'text-gray-600' : 'text-gray-400',
    },

    // Border classes
    border: {
      primary: isDark ? 'border-gray-700' : 'border-gray-200',
      secondary: isDark ? 'border-gray-600' : 'border-gray-300',
      focus: isDark ? 'border-[#F0B652]' : 'border-[#3B78BD]',
    },

    // Hover classes
    hover: {
      bg: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      text: isDark ? 'hover:text-[#F0B652]' : 'hover:text-[#3B78BD]',
    },

    // Brand classes
    brand: {
      primary: isDark ? 'text-[#F0B652]' : 'text-[#3B78BD]',
      primaryBg: isDark ? 'bg-[#F0B652]' : 'bg-[#3B78BD]',
      secondary: isDark ? 'text-[#3B78BD]' : 'text-[#F0B652]',
      secondaryBg: isDark ? 'bg-[#3B78BD]' : 'bg-[#F0B652]',
    },
  };
};

// Common component styles
export const componentStyles = {
  card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300',
  button: {
    primary: 'bg-[#3B78BD] dark:bg-[#F0B652] text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 font-medium',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium',
    outline: 'border-2 border-[#3B78BD] dark:border-[#F0B652] text-[#3B78BD] dark:text-[#F0B652] px-4 py-2 rounded-lg hover:bg-[#3B78BD] hover:text-white dark:hover:bg-[#F0B652] dark:hover:text-gray-900 transition-all duration-300 font-medium',
    danger: 'bg-[#f06752] text-white px-4 py-2 rounded-lg hover:bg-[#D84E3A] transition-all duration-300 font-medium',
    success: 'bg-[#2b7d54] text-white px-4 py-2 rounded-lg hover:bg-[#1F5A3C] transition-all duration-300 font-medium',
  },
  input: 'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-colors duration-300',
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
  badge: {
    primary: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#3B78BD] dark:bg-[#F0B652] text-white dark:text-gray-900',
    success: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    warning: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    danger: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    info: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
  },
  table: {
    container: 'overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700',
    table: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
    thead: 'bg-gray-50 dark:bg-gray-700',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
    tbody: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  transitions,
  getThemeClasses,
  componentStyles,
};
