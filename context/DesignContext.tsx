import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DesignSettings, ThemeColors } from '../types';
import { DEFAULT_COLORS, THEMES } from '../constants/themes';
import { loadJSON, saveJSON } from '../utils/storage';

const STORAGE_KEY = 'mommy_design';

const DEFAULT_SETTINGS: DesignSettings = {
  themeId: 'rose',
  colors: DEFAULT_COLORS,
  fontFamily: 'Fredoka',
  presetId: null,
  backgroundPhoto: null,
  filter: 'none',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  headlineText: 'Meeting you in...',
};

interface DesignContextType {
  design: DesignSettings;
  colors: ThemeColors;
  setTheme: (themeId: string) => void;
  setFont: (fontFamily: string) => void;
  setPreset: (presetId: string, themeId: string, fontFamily: string, filter: string) => void;
  setBackgroundPhoto: (uri: string | null) => void;
  setFilter: (filter: string) => void;
  setHeadlineText: (text: string) => void;
  setCustomColor: (colorKey: keyof ThemeColors, color: string) => void;
  updateDesign: (updates: Partial<DesignSettings>) => void;
}

const DesignContext = createContext<DesignContextType>({
  design: DEFAULT_SETTINGS,
  colors: DEFAULT_COLORS,
  setTheme: () => {},
  setFont: () => {},
  setPreset: () => {},
  setBackgroundPhoto: () => {},
  setFilter: () => {},
  setHeadlineText: () => {},
  setCustomColor: () => {},
  updateDesign: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [design, setDesign] = useState<DesignSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadJSON<DesignSettings>(STORAGE_KEY).then((saved) => {
      if (saved) {
        setDesign({ ...DEFAULT_SETTINGS, ...saved });
      }
    });
  }, []);

  const persist = useCallback((next: DesignSettings) => {
    setDesign(next);
    saveJSON(STORAGE_KEY, next);
  }, []);

  const setTheme = useCallback((themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    persist({ ...design, themeId, colors: theme.colors, presetId: null });
  }, [design, persist]);

  const setFont = useCallback((fontFamily: string) => {
    persist({ ...design, fontFamily, presetId: null });
  }, [design, persist]);

  const setPreset = useCallback((presetId: string, themeId: string, fontFamily: string, filter: string) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    persist({ ...design, presetId, themeId, colors: theme.colors, fontFamily, filter });
  }, [design, persist]);

  const setBackgroundPhoto = useCallback((uri: string | null) => {
    persist({ ...design, backgroundPhoto: uri });
  }, [design, persist]);

  const setFilter = useCallback((filter: string) => {
    persist({ ...design, filter, presetId: null });
  }, [design, persist]);

  const updateDesign = useCallback((updates: Partial<DesignSettings>) => {
    persist({ ...design, ...updates, presetId: null });
  }, [design, persist]);

  const setHeadlineText = useCallback((text: string) => {
    persist({ ...design, headlineText: text });
  }, [design, persist]);

  const setCustomColor = useCallback((colorKey: keyof ThemeColors, color: string) => {
    const newColors = { ...design.colors, [colorKey]: color };
    persist({ ...design, colors: newColors, presetId: null });
  }, [design, persist]);

  return (
    <DesignContext.Provider value={{
      design,
      colors: design.colors,
      setTheme,
      setFont,
      setPreset,
      setBackgroundPhoto,
      setFilter,
      setHeadlineText,
      setCustomColor,
      updateDesign,
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  return useContext(DesignContext);
}
