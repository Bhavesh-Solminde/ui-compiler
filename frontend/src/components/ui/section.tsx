import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  /** Section title displayed in the header */
  title: string;
  /** Whether the section is expanded by default */
  defaultOpen?: boolean;
  /** Content to display when expanded */
  children: React.ReactNode;
  /** Additional class name */
  className?: string;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ title, defaultOpen = true, children, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
      <CollapsiblePrimitive.Root
        ref={ref}
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("border-b border-border", className)}
      >
        <CollapsiblePrimitive.Trigger
          className={cn(
            "flex w-full items-center justify-between py-3 px-1 text-sm font-medium transition-all",
            "hover:bg-accent/50 rounded-sm",
            "[&[data-state=open]>svg]:rotate-90"
          )}
        >
          <span>{title}</span>
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
            )}
          />
        </CollapsiblePrimitive.Trigger>

        <CollapsiblePrimitive.Content
          className={cn(
            "overflow-hidden",
            "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
          )}
        >
          <div className="pb-4 pt-1 px-1">{children}</div>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    );
  }
);
Section.displayName = "Section";

// Export primitives for advanced usage
const SectionRoot = CollapsiblePrimitive.Root;
const SectionTrigger = CollapsiblePrimitive.Trigger;
const SectionContent = CollapsiblePrimitive.Content;

export { Section, SectionRoot, SectionTrigger, SectionContent };
