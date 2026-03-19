export interface ColorTokens {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface TypographyTokens {
  fontFamily: 'Inter' | 'Geist' | 'Poppins' | 'DM Sans';
  fontSize: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface BorderRadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
}

export interface AnimationTokens {
  duration: number;
  easing: string;
}

export interface DesignSystemTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  animation: AnimationTokens;
}
