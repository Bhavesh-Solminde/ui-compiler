import { Request, Response, NextFunction } from "express";
import archiver from "archiver";
import type { DesignSystemTokens } from "@resumer/shared-types";
import { compileDesignSystem as compileDesignSystemService } from "./compiler.service.js";
import { AppError } from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

/**
 * Validates the design system tokens
 */
function validateTokens(tokens: unknown): tokens is DesignSystemTokens {
  if (!tokens || typeof tokens !== "object") return false;

  const t = tokens as Record<string, unknown>;

  // Check required top-level properties
  const required = ["colors", "typography", "spacing", "borderRadius", "shadows", "animation"];
  for (const key of required) {
    if (!(key in t)) return false;
  }

  // Validate colors
  const colors = t.colors as Record<string, unknown>;
  const colorKeys = [
    "primary",
    "primaryForeground",
    "secondary",
    "secondaryForeground",
    "accent",
    "accentForeground",
    "background",
    "foreground",
    "muted",
    "mutedForeground",
    "destructive",
    "destructiveForeground",
    "card",
    "cardForeground",
    "border",
    "input",
    "ring",
  ];
  for (const key of colorKeys) {
    if (typeof colors[key] !== "string") return false;
  }

  // Validate typography
  const typography = t.typography as Record<string, unknown>;
  if (typeof typography.fontFamily !== "string") return false;
  if (!typography.fontSize || typeof typography.fontSize !== "object") return false;
  if (!typography.fontWeight || typeof typography.fontWeight !== "object") return false;
  if (!typography.lineHeight || typeof typography.lineHeight !== "object") return false;

  // Validate spacing
  const spacing = t.spacing as Record<string, unknown>;
  const spacingKeys = ["xs", "sm", "md", "lg", "xl"];
  for (const key of spacingKeys) {
    if (typeof spacing[key] !== "string") return false;
  }

  // Validate borderRadius
  const borderRadius = t.borderRadius as Record<string, unknown>;
  const radiusKeys = ["none", "sm", "md", "lg", "full"];
  for (const key of radiusKeys) {
    if (typeof borderRadius[key] !== "string") return false;
  }

  // Validate shadows
  const shadows = t.shadows as Record<string, unknown>;
  const shadowKeys = ["sm", "md", "lg"];
  for (const key of shadowKeys) {
    if (typeof shadows[key] !== "string") return false;
  }

  // Validate animation
  const animation = t.animation as Record<string, unknown>;
  if (typeof animation.duration !== "number") return false;
  if (typeof animation.easing !== "string") return false;

  return true;
}

/**
 * POST /api/compiler/compile
 * Compiles design tokens into a downloadable zip file
 */
export const compileDesignSystemHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const tokens = req.body;

    // Validate tokens
    if (!validateTokens(tokens)) {
      throw new AppError("Invalid design tokens format", 400);
    }

    // Compile the design system
    const result = await compileDesignSystemService(tokens);

    if (!result.success) {
      throw new AppError(`Compilation failed: ${result.errors.join(", ")}`, 500);
    }

    // Create zip archive
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Set response headers
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=custom-ui.zip");

    // Handle archive errors
    archive.on("error", (err) => {
      throw new AppError(`Archive error: ${err.message}`, 500);
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add files to archive
    for (const file of result.files) {
      archive.append(file.content, { name: file.path });
    }

    // Add a README
    const readme = `# Custom UI Components

Generated with UI Compiler.

## Installation

1. Copy the \`components/\` folder to your project's \`src/components/\`
2. Copy \`lib/utils.ts\` to your project's \`src/lib/\`
3. Copy \`styles/globals.css\` to your project's \`src/\` or \`app/\`
4. Update your \`tailwind.config.ts\` with the provided configuration

## Dependencies

Make sure you have these dependencies installed:
\`\`\`bash
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
\`\`\`

## Usage

Import components from your local components folder:
\`\`\`tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
\`\`\`
`;
    archive.append(readme, { name: "README.md" });

    // Finalize archive
    await archive.finalize();
  }
);

// Backward-compatible export used by compiler.routes.ts
export const compileDesignSystem = compileDesignSystemHandler;
