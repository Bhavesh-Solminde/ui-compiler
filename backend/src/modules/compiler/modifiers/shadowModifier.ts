import { ShadowTokens } from '@resumer/shared-types';

export function generateShadowCss(shadows: ShadowTokens): string {
  return `
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};`;
}
