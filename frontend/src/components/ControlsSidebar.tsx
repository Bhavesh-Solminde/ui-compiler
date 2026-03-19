"use client";

import * as React from "react";
import { useTokenStore } from "@/store/useTokenStore";
import { ColorPicker } from "@/components/ui/color-picker";
import { Section } from "@/components/ui/section";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { ColorTokens, TypographyTokens } from "@resumer/shared-types";
import { RotateCcw, Download } from "lucide-react";

/**
 * Converts camelCase to Title Case
 * e.g., "primaryForeground" → "Primary Foreground"
 */
function camelToTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

/**
 * Parses rem string value to number
 * e.g., "0.875rem" → 0.875
 */
function parseRemValue(value: string): number {
  return parseFloat(value.replace("rem", ""));
}

/**
 * Formats number to rem string
 * e.g., 0.875 → "0.875rem"
 */
function formatRemValue(value: number): string {
  return `${value}rem`;
}

// Color keys in the order we want to display them
const COLOR_KEYS: (keyof ColorTokens)[] = [
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

// Font family options
const FONT_FAMILY_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Geist", label: "Geist" },
  { value: "Poppins", label: "Poppins" },
  { value: "DM Sans", label: "DM Sans" },
];

// Slider configurations for font sizes
const FONT_SIZE_CONFIG = {
  sm: { min: 0.75, max: 1, step: 0.025 },
  md: { min: 0.875, max: 1.25, step: 0.025 },
  lg: { min: 1, max: 1.5, step: 0.025 },
  xl: { min: 1.125, max: 2, step: 0.025 },
} as const;

// Slider configurations for spacing
const SPACING_CONFIG = {
  xs: { min: 0.125, max: 0.5, step: 0.025 },
  sm: { min: 0.25, max: 1, step: 0.025 },
  md: { min: 0.5, max: 2, step: 0.05 },
  lg: { min: 1, max: 3, step: 0.05 },
  xl: { min: 1.5, max: 4, step: 0.1 },
} as const;

// Slider configurations for border radius
const BORDER_RADIUS_CONFIG = {
  sm: { min: 0, max: 0.5, step: 0.025 },
  md: { min: 0, max: 1, step: 0.025 },
  lg: { min: 0, max: 1.5, step: 0.05 },
} as const;

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "rem",
}: SliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {value.toFixed(3).replace(/\.?0+$/, "")}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

export function ControlsSidebar() {
  const {
    tokens,
    updateColor,
    updateTypography,
    updateFontSize,
    updateSpacing,
    updateBorderRadius,
    updateAnimation,
    resetToDefaults,
    exportTheme,
  } = useTokenStore();

  const { toast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportTheme();
      toast("Theme exported successfully!", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to export theme";
      toast(message, "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    toast("Design system reset to defaults", "default");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-80 flex-col border-r border-border bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border px-4 py-5">
        <h1 className="text-lg font-semibold text-foreground">Design System</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize your component library
        </p>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Colors Section */}
        <Section title="Colors" defaultOpen>
          <div className="space-y-4">
            {COLOR_KEYS.map((colorKey) => (
              <ColorPicker
                key={colorKey}
                label={camelToTitleCase(colorKey)}
                value={tokens.colors[colorKey]}
                onChange={(value) => updateColor(colorKey, value)}
              />
            ))}
          </div>
        </Section>

        {/* Typography Section */}
        <Section title="Typography" defaultOpen={false}>
          <div className="space-y-5">
            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Font Family
              </label>
              <Select
                value={tokens.typography.fontFamily}
                onValueChange={(value) =>
                  updateTypography(
                    "fontFamily",
                    value as TypographyTokens["fontFamily"]
                  )
                }
                options={FONT_FAMILY_OPTIONS}
                placeholder="Select font..."
              />
            </div>

            {/* Font Sizes */}
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Font Sizes
              </p>
              {(
                Object.keys(FONT_SIZE_CONFIG) as Array<
                  keyof typeof FONT_SIZE_CONFIG
                >
              ).map((sizeKey) => {
                const config = FONT_SIZE_CONFIG[sizeKey];
                return (
                  <SliderControl
                    key={sizeKey}
                    label={sizeKey.toUpperCase()}
                    value={parseRemValue(tokens.typography.fontSize[sizeKey])}
                    onChange={(value) =>
                      updateFontSize(sizeKey, formatRemValue(value))
                    }
                    min={config.min}
                    max={config.max}
                    step={config.step}
                  />
                );
              })}
            </div>
          </div>
        </Section>

        {/* Spacing Section */}
        <Section title="Spacing" defaultOpen={false}>
          <div className="space-y-4">
            {(
              Object.keys(SPACING_CONFIG) as Array<keyof typeof SPACING_CONFIG>
            ).map((spacingKey) => {
              const config = SPACING_CONFIG[spacingKey];
              return (
                <SliderControl
                  key={spacingKey}
                  label={spacingKey.toUpperCase()}
                  value={parseRemValue(tokens.spacing[spacingKey])}
                  onChange={(value) =>
                    updateSpacing(spacingKey, formatRemValue(value))
                  }
                  min={config.min}
                  max={config.max}
                  step={config.step}
                />
              );
            })}
          </div>
        </Section>

        {/* Border Radius Section */}
        <Section title="Border Radius" defaultOpen={false}>
          <div className="space-y-4">
            {(
              Object.keys(BORDER_RADIUS_CONFIG) as Array<
                keyof typeof BORDER_RADIUS_CONFIG
              >
            ).map((radiusKey) => {
              const config = BORDER_RADIUS_CONFIG[radiusKey];
              return (
                <SliderControl
                  key={radiusKey}
                  label={radiusKey.toUpperCase()}
                  value={parseRemValue(tokens.borderRadius[radiusKey])}
                  onChange={(value) =>
                    updateBorderRadius(radiusKey, formatRemValue(value))
                  }
                  min={config.min}
                  max={config.max}
                  step={config.step}
                />
              );
            })}
          </div>
        </Section>

        {/* Effects Section */}
        <Section title="Effects" defaultOpen={false}>
          <div className="space-y-4">
            <SliderControl
              label="Animation Duration"
              value={tokens.animation.duration}
              onChange={(value) => updateAnimation("duration", value)}
              min={50}
              max={500}
              step={10}
              unit="ms"
            />
          </div>
        </Section>
      </div>

      {/* Footer Actions */}
      <footer className="shrink-0 border-t border-border p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Spinner size="sm" className="text-primary-foreground" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Theme
            </>
          )}
        </Button>
      </footer>
    </aside>
  );
}

export default ControlsSidebar;
