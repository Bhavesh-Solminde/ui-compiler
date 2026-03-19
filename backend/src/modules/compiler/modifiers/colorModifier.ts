import { ColorTokens } from '@resumer/shared-types';

export function generateColorsCss(colors: ColorTokens): string {
  return `:root {
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  
  --card: ${colors.card};
  --card-foreground: ${colors.cardForeground};
  
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground};
  
  --secondary: ${colors.secondary};
  --secondary-foreground: ${colors.secondaryForeground};
  
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
  
  --accent: ${colors.accent};
  --accent-foreground: ${colors.accentForeground};
  
  --destructive: ${colors.destructive};
  --destructive-foreground: ${colors.destructiveForeground};
  
  --border: ${colors.border};
  --input: ${colors.input};
  --ring: ${colors.ring};
}`;
}
