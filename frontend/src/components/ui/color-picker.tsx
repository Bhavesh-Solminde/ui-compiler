import * as React from "react";
import { cn } from "@/lib/utils";
import { hslToHex, hexToHsl, isValidHex } from "@/lib/colorConvert";

export interface ColorPickerProps {
  /** HSL value in format "h s% l%" (e.g., "220 90% 56%") */
  value: string;
  /** Callback when color changes, receives HSL string */
  onChange: (hsl: string) => void;
  /** Label for the color picker */
  label: string;
  /** Additional class name */
  className?: string;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value, onChange, label, className }, ref) => {
    const [hexValue, setHexValue] = React.useState(() => hslToHex(value));
    const [isValid, setIsValid] = React.useState(true);
    const colorInputRef = React.useRef<HTMLInputElement>(null);

    // Update hex display when HSL value changes externally
    React.useEffect(() => {
      const newHex = hslToHex(value);
      setHexValue(newHex);
      setIsValid(true);
    }, [value]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value;
      
      // Add # if not present
      if (input && !input.startsWith("#")) {
        input = "#" + input;
      }
      
      setHexValue(input);

      if (isValidHex(input)) {
        setIsValid(true);
        const hsl = hexToHsl(input);
        onChange(hsl);
      } else {
        setIsValid(input === "" || input === "#");
      }
    };

    const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      setHexValue(hex);
      setIsValid(true);
      const hsl = hexToHsl(hex);
      onChange(hsl);
    };

    const handleSwatchClick = () => {
      colorInputRef.current?.click();
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {/* Color swatch preview */}
          <button
            type="button"
            onClick={handleSwatchClick}
            className={cn(
              "h-9 w-9 shrink-0 rounded-md border border-input shadow-sm",
              "transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "cursor-pointer"
            )}
            style={{ backgroundColor: isValid ? hexValue : "#ffffff" }}
            aria-label={`Select color for ${label}`}
          />
          
          {/* Hidden native color input */}
          <input
            ref={colorInputRef}
            type="color"
            value={isValid && hexValue ? hexValue : "#000000"}
            onChange={handleColorInputChange}
            className="sr-only"
            tabIndex={-1}
          />

          {/* Hex input field */}
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            placeholder="#000000"
            className={cn(
              "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50 font-mono",
              isValid ? "border-input" : "border-destructive"
            )}
            maxLength={7}
          />
        </div>
        {!isValid && hexValue.length > 1 && (
          <p className="text-xs text-destructive">Invalid hex color</p>
        )}
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
