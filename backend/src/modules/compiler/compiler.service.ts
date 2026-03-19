import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { DesignSystemTokens } from "@resumer/shared-types";
import {
  generateColorsCss,
  generateTypographyCss,
  getFontImport,
  generateSpacingCss,
  generateRadiusCss,
  generateShadowCss,
  generateAnimationCss,
} from "./modifiers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, "base");

export interface CompiledFile {
  path: string;
  content: string;
}

export interface CompilationResult {
  success: boolean;
  files: CompiledFile[];
  errors: string[];
}

/**
 * Generates the complete globals.css file with all token CSS variables
 */
function generateGlobalsCss(tokens: DesignSystemTokens): string {
  const fontImport = getFontImport(tokens.typography.fontFamily);
  const colorsCss = generateColorsCss(tokens.colors);
  const typographyCss = generateTypographyCss(tokens.typography);
  const spacingCss = generateSpacingCss(tokens.spacing);
  const radiusCss = generateRadiusCss(tokens.borderRadius);
  const shadowCss = generateShadowCss(tokens.shadows);
  const animationCss = generateAnimationCss(tokens.animation);

  return `${fontImport}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
${colorsCss}
${typographyCss}
${spacingCss}
${radiusCss}
${shadowCss}
${animationCss}

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-sans);
  }
}
`;
}

/**
 * Reads a base component file
 */
async function readBaseComponent(filename: string): Promise<string> {
  const filePath = path.join(BASE_DIR, filename);
  return fs.readFile(filePath, "utf-8");
}

/**
 * Compiles the design system with all tokens
 */
export async function compileDesignSystem(tokens: DesignSystemTokens): Promise<CompilationResult> {
  const files: CompiledFile[] = [];
  const errors: string[] = [];

  try {
    // Generate globals.css
    const globalsCss = generateGlobalsCss(tokens);
    files.push({ path: "styles/globals.css", content: globalsCss });

    // Read and include all base components
    const componentFiles = ["button.tsx", "input.tsx", "card.tsx", "badge.tsx", "label.tsx"];

    for (const filename of componentFiles) {
      try {
        const content = await readBaseComponent(filename);
        files.push({ path: `components/ui/${filename}`, content });
      } catch (err) {
        errors.push(`Failed to read ${filename}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    // Include utils.ts
    try {
      const utilsContent = await readBaseComponent("utils.ts");
      files.push({ path: "lib/utils.ts", content: utilsContent });
    } catch (err) {
      errors.push(`Failed to read utils.ts: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    // Generate tailwind.config.ts with theme overrides
    const tailwindConfig = generateTailwindConfig(tokens);
    files.push({ path: "tailwind.config.ts", content: tailwindConfig });

    return {
      success: errors.length === 0,
      files,
      errors,
    };
  } catch (err) {
    return {
      success: false,
      files,
      errors: [...errors, err instanceof Error ? err.message : "Unknown compilation error"],
    };
  }
}

/**
 * Generates a tailwind.config.ts with custom theme values
 */
function generateTailwindConfig(_tokens: DesignSystemTokens): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
`;
}
