import { DesignPreset } from '../types';

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Reset to default – neutral warm white, original app style',
    themeId: 'basic',
    fontFamily: 'Fredoka',
    filter: 'none',
    premium: false,
    hideGenderLabel: true,
  },
  {
    id: 'boy',
    name: 'Boy',
    description: 'Soft blue, clean modern sans-serif, light minimal',
    themeId: 'boy',
    fontFamily: 'Poppins',
    filter: 'none',
    premium: false,
    hideGenderLabel: false,
  },
  {
    id: 'girl',
    name: 'Girl',
    description: 'Soft rose, rounded sans-serif, soft pastel',
    themeId: 'girl',
    fontFamily: 'Quicksand',
    filter: 'soft',
    premium: false,
    hideGenderLabel: false,
  },
  {
    id: 'surprise',
    name: 'Surprise',
    description: 'Warm sand, elegant serif, minimal timeless',
    themeId: 'surprise',
    fontFamily: 'Lora',
    filter: 'neutral',
    premium: false,
    hideGenderLabel: false,
  },
  {
    id: 'bloom',
    name: 'Bloom',
    description: 'Warm blush, dreamy script, soft pastel glow',
    themeId: 'girl',
    fontFamily: 'Dancing Script',
    filter: 'soft',
    premium: true,
    hideGenderLabel: false,
  },
  {
    id: 'moon',
    name: 'Moon',
    description: 'Midnight blue, silver text, celestial calm',
    themeId: 'boy',
    fontFamily: 'Cormorant Garamond',
    filter: 'neutral',
    premium: true,
    hideGenderLabel: false,
  },
  {
    id: 'luxe',
    name: 'Luxe',
    description: 'Deep plum, bold editorial, timeless elegance',
    themeId: 'surprise',
    fontFamily: 'Playfair Display',
    filter: 'warm',
    premium: true,
    hideGenderLabel: false,
  },
];

export const PRIMARY_FONTS = [
  { name: 'Fredoka', premium: false },
  { name: 'Poppins', premium: false },
  { name: 'Quicksand', premium: false },
  { name: 'Montserrat', premium: false },
  { name: 'Nunito', premium: false },
  { name: 'Inter', premium: false },
];

export const SCRIPT_FONTS = [
  { name: 'Dancing Script', premium: true },
  { name: 'Pacifico', premium: true },
  { name: 'Satisfy', premium: true },
  { name: 'Caveat', premium: true },
  { name: 'Sacramento', premium: true },
];

export const ELEGANT_FONTS = [
  { name: 'Playfair Display', premium: true },
  { name: 'Cormorant', premium: true },
  { name: 'Cormorant Garamond', premium: true },
  { name: 'DM Serif Display', premium: true },
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
