import { create } from 'zustand';
import { 
  DesignSystemTokens, 
  ColorTokens, 
  TypographyTokens,
  SpacingTokens,
  BorderRadiusTokens,
  ShadowTokens,
  AnimationTokens,
  DEFAULT_TOKENS 
} from '@resumer/shared-types';
import { injectTokensAsCSS } from '../lib/injectTokens';
import axiosInstance from '../lib/axios';

interface TokenStore {
  tokens: DesignSystemTokens;
  
  // Update functions for each category
  updateColor: <K extends keyof ColorTokens>(key: K, value: ColorTokens[K]) => void;
  updateTypography: <K extends keyof TypographyTokens>(key: K, value: TypographyTokens[K]) => void;
  updateFontSize: (key: keyof TypographyTokens['fontSize'], value: string) => void;
  updateSpacing: (key: keyof SpacingTokens, value: string) => void;
  updateBorderRadius: (key: keyof BorderRadiusTokens, value: string) => void;
  updateShadow: (key: keyof ShadowTokens, value: string) => void;
  updateAnimation: <K extends keyof AnimationTokens>(key: K, value: AnimationTokens[K]) => void;
  
  // Actions
  resetToDefaults: () => void;
  exportTheme: () => Promise<void>;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: DEFAULT_TOKENS,

  updateColor: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        colors: { ...state.tokens.colors, [key]: value }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  updateTypography: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        typography: { ...state.tokens.typography, [key]: value }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  updateFontSize: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        typography: {
          ...state.tokens.typography,
          fontSize: { ...state.tokens.typography.fontSize, [key]: value }
        }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  updateSpacing: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        spacing: { ...state.tokens.spacing, [key]: value }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  updateBorderRadius: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        borderRadius: { ...state.tokens.borderRadius, [key]: value }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  updateShadow: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        shadows: { ...state.tokens.shadows, [key]: value }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  updateAnimation: (key, value) => {
    set((state) => ({
      tokens: {
        ...state.tokens,
        animation: { ...state.tokens.animation, [key]: value }
      }
    }));
    injectTokensAsCSS(get().tokens);
  },

  resetToDefaults: () => {
    set({ tokens: DEFAULT_TOKENS });
    injectTokensAsCSS(DEFAULT_TOKENS);
  },

  exportTheme: async () => {
    const { tokens } = get();
    
    const response = await axiosInstance.post('/compiler/compile', tokens, {
      responseType: 'blob'
    });

    // Handle error responses (blob might contain JSON error)
    const contentType = response.headers['content-type'];
    if (contentType?.includes('application/json')) {
      const text = await response.data.text();
      throw new Error(JSON.parse(text).message || 'Export failed');
    }

    // Trigger download
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-ui.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}));
