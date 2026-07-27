'use client';

import React, { createContext, useContext, useMemo } from 'react';

/**
 * Interface defining the design tokens (colors) for the application.
 * This ensures consistency and type safety across the entire project.
 */
export interface ThemeTokens {
  // Layout
  sidebar: string;
  sidebarBorder: string;
  sidebarHover: string;

  // Brand primary
  primary: string;
  primaryHover: string;
  primaryLight: string;

  // Destructive / Error
  destructive: string;
  destructiveHover: string;
  destructiveLight: string;

  // Accent (indigo-purple gradient alt, used for stat cards and progress bars)
  accent: string;
  accentHover: string;
  accentLight: string;

  // Semantic feedback
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;

  // Surfaces
  card: string;
  muted: string;
  mutedBorder: string;

  // Typography
  textPrimary: string;
  textMuted: string;
}

/**
 * Central design tokens object.
 * Adjusting these values here will automatically update the UI theme across the app.
 */
const tokens: ThemeTokens = {
  // Layout
  sidebar: '#04241d',
  sidebarBorder: '#0b3b30',
  sidebarHover: '#d61640',

  // Brand primary (Deep Green)
  primary: '#10b981',
  primaryHover: '#059669',
  primaryLight: '#ecfdf5',

  // Destructive / Error
  destructive: '#ef4444',
  destructiveHover: '#dc2626',
  destructiveLight: '#1c1152',

  // Accent
  accent: '#5c4fe5',
  accentHover: '#4c3ce0',
  accentLight: '#eef2ff',

  // Semantic feedback
  success: '#059669',
  successLight: '#ecfdf5',
  warning: '#d97706',
  warningLight: '#fffbeb',

  // Surfaces
  card: '#ffffff',
  muted: '#f1f5f9',
  mutedBorder: '#e2e8f0',

  // Typography
  textPrimary: '#1e293b',
  textMuted: '#94a3b8',
};

// Create the Context to hold the theme tokens
const ThemeContext = createContext<ThemeTokens | null>(null);

/**
 * Provider component that makes the theme tokens available to the component tree.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useMemo ensures the tokens object is memoized for better performance
  const value = useMemo(() => tokens, []);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to easily consume the theme tokens in any component.
 */
export function useTheme(): ThemeTokens {
  const ctx = useContext(ThemeContext);

  // Check if used outside of provider to prevent errors
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return ctx;
}