import { TypographyTokens } from '@resumer/shared-types';

const fontFamilyMap: Record<string, string> = {
  'Inter': '"Inter", ui-sans-serif, system-ui, sans-serif',
  'Geist': '"Geist", ui-sans-serif, system-ui, sans-serif',
  'Poppins': '"Poppins", ui-sans-serif, system-ui, sans-serif',
  'DM Sans': '"DM Sans", ui-sans-serif, system-ui, sans-serif',
};

export function generateTypographyCss(typography: TypographyTokens): string {
  const fontStack = fontFamilyMap[typography.fontFamily] || fontFamilyMap['Inter'];
  
  return `
  --font-sans: ${fontStack};
  
  --font-size-sm: ${typography.fontSize.sm};
  --font-size-base: ${typography.fontSize.md};
  --font-size-lg: ${typography.fontSize.lg};
  --font-size-xl: ${typography.fontSize.xl};
  
  --font-weight-normal: ${typography.fontWeight.normal};
  --font-weight-medium: ${typography.fontWeight.medium};
  --font-weight-semibold: ${typography.fontWeight.semibold};
  --font-weight-bold: ${typography.fontWeight.bold};
  
  --line-height-tight: ${typography.lineHeight.tight};
  --line-height-normal: ${typography.lineHeight.normal};
  --line-height-relaxed: ${typography.lineHeight.relaxed};`;
}

export function getFontImport(fontFamily: TypographyTokens['fontFamily']): string {
  const imports: Record<string, string> = {
    'Inter': '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");',
    'Poppins': '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");',
    'DM Sans': '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap");',
    'Geist': '/* Geist font - self-hosted or use Vercel CDN */',
  };
  return imports[fontFamily] || imports['Inter'];
}
