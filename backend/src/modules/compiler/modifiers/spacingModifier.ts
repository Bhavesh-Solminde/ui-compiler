import { SpacingTokens } from '@resumer/shared-types';

export function generateSpacingCss(spacing: SpacingTokens): string {
  return `
  --spacing-xs: ${spacing.xs};
  --spacing-sm: ${spacing.sm};
  --spacing-md: ${spacing.md};
  --spacing-lg: ${spacing.lg};
  --spacing-xl: ${spacing.xl};`;
}
