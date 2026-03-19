import { DesignSystemTokens } from '@resumer/shared-types';

/**
 * Injects all design tokens as CSS custom properties on the document root.
 * Called whenever any token changes to update the live preview.
 */
export function injectTokensAsCSS(tokens: DesignSystemTokens): void {
  const root = document.documentElement;

  // Colors
  const colorMap: Record<string, string> = {
    '--primary': tokens.colors.primary,
    '--primary-foreground': tokens.colors.primaryForeground,
    '--secondary': tokens.colors.secondary,
    '--secondary-foreground': tokens.colors.secondaryForeground,
    '--accent': tokens.colors.accent,
    '--accent-foreground': tokens.colors.accentForeground,
    '--background': tokens.colors.background,
    '--foreground': tokens.colors.foreground,
    '--muted': tokens.colors.muted,
    '--muted-foreground': tokens.colors.mutedForeground,
    '--destructive': tokens.colors.destructive,
    '--destructive-foreground': tokens.colors.destructiveForeground,
    '--card': tokens.colors.card,
    '--card-foreground': tokens.colors.cardForeground,
    '--border': tokens.colors.border,
    '--input': tokens.colors.input,
    '--ring': tokens.colors.ring,
  };

  // Typography
  const typographyMap: Record<string, string> = {
    '--font-family': tokens.typography.fontFamily,
    '--font-size-sm': tokens.typography.fontSize.sm,
    '--font-size-md': tokens.typography.fontSize.md,
    '--font-size-lg': tokens.typography.fontSize.lg,
    '--font-size-xl': tokens.typography.fontSize.xl,
    '--font-weight-normal': String(tokens.typography.fontWeight.normal),
    '--font-weight-medium': String(tokens.typography.fontWeight.medium),
    '--font-weight-semibold': String(tokens.typography.fontWeight.semibold),
    '--font-weight-bold': String(tokens.typography.fontWeight.bold),
    '--line-height-tight': tokens.typography.lineHeight.tight,
    '--line-height-normal': tokens.typography.lineHeight.normal,
    '--line-height-relaxed': tokens.typography.lineHeight.relaxed,
  };

  // Spacing
  const spacingMap: Record<string, string> = {
    '--spacing-xs': tokens.spacing.xs,
    '--spacing-sm': tokens.spacing.sm,
    '--spacing-md': tokens.spacing.md,
    '--spacing-lg': tokens.spacing.lg,
    '--spacing-xl': tokens.spacing.xl,
  };

  // Border Radius
  const radiusMap: Record<string, string> = {
    '--radius-none': tokens.borderRadius.none,
    '--radius-sm': tokens.borderRadius.sm,
    '--radius-md': tokens.borderRadius.md,
    '--radius-lg': tokens.borderRadius.lg,
    '--radius-full': tokens.borderRadius.full,
    '--radius': tokens.borderRadius.md, // Default radius for components
  };

  // Shadows
  const shadowMap: Record<string, string> = {
    '--shadow-sm': tokens.shadows.sm,
    '--shadow-md': tokens.shadows.md,
    '--shadow-lg': tokens.shadows.lg,
  };

  // Animation
  const animationMap: Record<string, string> = {
    '--animation-duration': `${tokens.animation.duration}ms`,
    '--animation-easing': tokens.animation.easing,
  };

  // Apply all CSS variables
  const allVariables = {
    ...colorMap,
    ...typographyMap,
    ...spacingMap,
    ...radiusMap,
    ...shadowMap,
    ...animationMap,
  };

  for (const [property, value] of Object.entries(allVariables)) {
    root.style.setProperty(property, value);
  }
}
