import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTokenStore } from "@/store/useTokenStore";

export default function BuilderPage() {
  const { radius, primaryColor, updateToken, exportTheme } = useTokenStore();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radius}rem`);
    document.documentElement.style.setProperty("--primary", primaryColor);
  }, [radius, primaryColor]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportTheme();
    } catch (error) {
      console.error("Failed to export theme", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground antialiased font-sans">
      {/* Left Sidebar - Controls */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-muted/20 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold tracking-tight">Design System</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your visual tokens</p>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Radius Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="radius-slider" className="text-sm font-medium">Border Radius</Label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{radius}rem</span>
            </div>
            <Slider
              id="radius-slider"
              min={0}
              max={2}
              step={0.1}
              value={[radius]}
              onValueChange={(val) => updateToken("radius", val[0])}
              className="py-2"
            />
            <p className="text-xs text-muted-foreground">Adjust the roundness of UI elements.</p>
          </div>

          {/* Primary Color Control */}
          <div className="space-y-4">
            <Label htmlFor="primary-color" className="text-sm font-medium">Primary Color (HSL)</Label>
            <Input
              id="primary-color"
              value={primaryColor}
              onChange={(e) => updateToken("primaryColor", e.target.value)}
              placeholder="e.g. 222.2 47.4% 11.2%"
              className="font-mono text-sm"
            />
            <div 
              className="w-full h-10 rounded-md border border-border mt-2 shadow-inner" 
              style={{ backgroundColor: `hsl(${primaryColor})` }}
              aria-label="Primary color preview"
            />
            <p className="text-xs text-muted-foreground">Define the primary brand color in HSL format.</p>
          </div>
        </div>

        <div className="p-6 border-t border-border mt-auto bg-background/50 backdrop-blur-sm">
          <Button 
            className="w-full font-medium shadow-sm transition-all" 
            size="lg"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export Design System"}
          </Button>
        </div>
      </aside>

      {/* Right Main Canvas - Live Preview */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto bg-background/50 dot-pattern">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Live Preview</h2>
            <p className="text-muted-foreground">See your design tokens applied to real components instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interactive Card Example */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" placeholder="John Doe" defaultValue="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <Button className="w-full mt-2">Save Changes</Button>
              </CardContent>
            </Card>

            {/* Component Showcase */}
            <div className="space-y-8">
              <section className="space-y-4 p-6 rounded-xl border border-border/50 bg-card shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </section>

              <section className="space-y-4 p-6 rounded-xl border border-border/50 bg-card shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inputs & Controls</h3>
                <div className="space-y-4">
                  <Input placeholder="Standard input..." />
                  <Input disabled placeholder="Disabled input..." />
                  <div className="pt-2">
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </div>
              </section>
            </div>
          </div>
          
        </div>
      </main>
      
      {/* Optional: Add a subtle dot pattern via inline styles for the background if not defined in CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .dot-pattern {
          background-image: radial-gradient(hsl(var(--muted-foreground)/0.2) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />
    </div>
  );
}
