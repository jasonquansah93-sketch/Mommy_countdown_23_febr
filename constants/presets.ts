import { DesignPreset } from '../types';

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'soft-baby',
    name: 'Soft Baby Announcement',
    description: 'Gentle and tender',
    themeId: 'rose',
    fontFamily: 'Fredoka',
    filter: 'soft',
    premium: true,
  },
  {
    id: 'dreamy-pastel',
    name: 'Dreamy Pastel',
    description: 'Light and whimsical',
    themeId: 'lavender',
    fontFamily: 'Quicksand',
    filter: 'pastel',
    premium: true,
  },
  {
    id: 'minimal-neutral',
    name: 'Minimal Neutral',
    description: 'Clean and timeless',
    themeId: 'sage',
    fontFamily: 'Poppins',
    filter: 'neutral',
    premium: true,
  },
  {
    id: 'warm-memories',
    name: 'Warm Memories',
    description: 'Cozy and inviting',
    themeId: 'sunset',
    fontFamily: 'Fredoka',
    filter: 'warm',
    premium: true,
  },
  {
    id: 'modern-keepsake',
    name: 'Modern Keepsake',
    description: 'Sophisticated and special',
    themeId: 'ocean',
    fontFamily: 'Poppins',
    filter: 'bright',
    premium: true,
  },
];

export const PRIMARY_FONTS = [
  { name: 'Fredoka', premium: false },
  { name: 'Poppins', premium: false },
  { name: 'Quicksand', premium: false },
];

export const SCRIPT_FONTS = [
  { name: 'Dancing Script', premium: true },
  { name: 'Pacifico', premium: true },
  { name: 'Satisfy', premium: true },
  { name: 'Caveat', premium: true },
];

export const ELEGANT_FONTS = [
  { name: 'Playfair', premium: true },
  { name: 'Cormorant', premium: true },
  { name: 'Lora', premium: true },
  { name: 'Merriweather', premium: true },
];

export const FILTERS = [
  { id: 'none', name: 'None' },
  { id: 'warm', name: 'Warm' },
  { id: 'soft', name: 'Soft' },
  { id: 'pastel', name: 'Pastel' },
  { id: 'bright', name: 'Bright' },
  { id: 'neutral', name: 'Neutral' },
];
