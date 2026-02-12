import { AppTheme, ThemeColors } from '../types';

export const DEFAULT_COLORS: ThemeColors = {
  primary: '#E91E8C',
  secondary: '#FF6FB7',
  background: '#FFF0F5',
  surface: '#FFFFFF',
  text: '#2D2D2D',
  textSecondary: '#888888',
  accent: '#FFB6D9',
};

export const THEMES: AppTheme[] = [
  {
    id: 'rose',
    name: 'Rose',
    colors: DEFAULT_COLORS,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: {
      primary: '#7C4DFF',
      secondary: '#B388FF',
      background: '#F3F0FF',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#D1C4E9',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0288D1',
      secondary: '#4FC3F7',
      background: '#E8F5FE',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#B3E5FC',
    },
  },
  {
    id: 'sage',
    name: 'Sage',
    colors: {
      primary: '#388E3C',
      secondary: '#81C784',
      background: '#F1F8E9',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#C8E6C9',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#FF6D00',
      secondary: '#FFAB40',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#FFE0B2',
    },
  },
];
