/**
 * Auri Landing Page - Theme Tokens
 * This file documents the design system used throughout the landing page
 */

export const colors = {
  slate900: '#0F1220',
  slate800: '#161A2A',
  slate700: '#1E2336',
  slate100: '#E9ECF4',
  slate050: '#F5F7FB',
  white: '#FFFFFF',
  gold: '#FFC14D',
  peach: '#FF8A65',
  blush: '#F76E8E',
  teal: '#39B6B3',
  success: '#2ECC71',
  warn: '#F5A623',
  error: '#FF5A5F',
  link: '#4D9CFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  card: 24,
  input: 16,
  chip: 12,
  avatar: 40,
  pill: 48,
};

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: 600 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: 600 },
  body: { fontSize: 16, lineHeight: 22, fontWeight: 500 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: 500 },
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.12)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.15)',
};

export const gradients = {
  warm: ['#FFC14D', '#FF8A65', '#F76E8E'],
  accent: ['#FF8A65', '#F76E8E'],
  subtle: [
    'rgba(255, 138, 101, 0.4)',
    'rgba(247, 110, 142, 0.6)',
    'rgba(15, 18, 32, 0.9)',
  ],
};

export const transitions = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
};
