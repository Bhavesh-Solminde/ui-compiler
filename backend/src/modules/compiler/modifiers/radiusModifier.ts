import { BorderRadiusTokens } from '@resumer/shared-types';

export function generateRadiusCss(radius: BorderRadiusTokens): string {
  return `
  --radius: ${radius.md};
  --radius-sm: ${radius.sm};
  --radius-md: ${radius.md};
  --radius-lg: ${radius.lg};
  --radius-full: ${radius.full};`;
}

export function getRadiusClass(radiusValue: string): string {
  const remValue = parseFloat(radiusValue);
  if (remValue === 0) return 'rounded-none';
  if (remValue <= 0.125) return 'rounded-sm';
  if (remValue <= 0.375) return 'rounded-md';
  if (remValue <= 0.5) return 'rounded-lg';
  if (remValue >= 9999) return 'rounded-full';
  return 'rounded-lg';
}
