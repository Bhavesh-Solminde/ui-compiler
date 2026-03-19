import { DesignSystemTokens } from './designTokens.js';

export const DEFAULT_TOKENS: DesignSystemTokens = {
  colors: {
    primary: "222.2 47.4% 11.2%",
    primaryForeground: "210 40% 98%",
    secondary: "210 40% 96.1%",
    secondaryForeground: "222.2 47.4% 11.2%",
    accent: "210 40% 96.1%",
    accentForeground: "222.2 47.4% 11.2%",
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "222.2 84% 4.9%"
  },
  typography: {
    fontFamily: "Inter",
    fontSize: {
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem"
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75"
    }
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem"
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px"
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
  },
  animation: {
    duration: 150,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
  }
};
