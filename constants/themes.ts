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
  {
    id: 'boy',
    name: 'Boy',
    colors: {
      primary: '#64B5F6',
      secondary: '#90CAF9',
      background: '#E3F2FD',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#BBDEFB',
    },
  },
  {
    id: 'girl',
    name: 'Girl',
    colors: {
      primary: '#F48FB1',
      secondary: '#F8BBD9',
      background: '#FCE4EC',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#F8BBD9',
    },
  },
  {
    id: 'surprise',
    name: 'Surprise',
    colors: {
      primary: '#C4A77D',
      secondary: '#D4BC96',
      background: '#EADBC8',
      surface: '#FFFFFF',
      text: '#5C4A3A',
      textSecondary: '#8B7355',
      accent: '#E6D2B8',
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    colors: {
      primary: '#E91E8C',
      secondary: '#FF6FB7',
      background: '#FDFBF7',
      surface: '#FFFFFF',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#FFB6D9',
    },
  },
];
