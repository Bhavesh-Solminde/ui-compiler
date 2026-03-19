Read the entire codebase — every file in frontend/src/, backend/src/, 
and packages/shared-types/. Then audit what is actually implemented 
vs what only exists as a placeholder or stub.

After reading, do the following in order without stopping:

## 1. EXPAND THE DESIGN TOKEN SYSTEM
The current DesignSystemTokens only has radius and primaryColor.
Expand it to include:
- colors: primary, secondary, accent, background, foreground, 
  muted, destructive (all HSL strings)
- typography: fontFamily, fontSize (sm/md/lg/xl), fontWeight, 
  lineHeight
- spacing: xs, sm, md, lg, xl (rem values)
- borderRadius: none, sm, md, lg, full (rem values)  
- shadows: sm, md, lg
- animation: duration (ms), easing (string)

Update packages/shared-types/ first, then update the Zustand store, 
then update the backend compiler to handle all new tokens.

## 2. BUILD COMPLETE CONTROLS SIDEBAR
Build a fully functional sidebar with:
- Color pickers for every color token (hex input + color swatch)
- Sliders for spacing, radius, font size
- Dropdown for font family (Inter, Geist, Poppins, DM Sans)
- Live token values shown next to each control
- Section headers: Colors / Typography / Spacing / Effects
- Reset to defaults button
- All changes must update Zustand + inject CSS variables instantly

## 3. BUILD COMPLETE PREVIEW CANVAS  
Build a preview canvas that shows all these components live:
- Button (all variants: default, secondary, destructive, outline, ghost)
- Input with label and placeholder
- Card with header, content, footer
- Badge (all variants)
- A form combining Input + Button
- All components must reflect token changes with zero latency
- Wrap canvas in an isolated scope to prevent style bleed

## 4. COMPLETE THE COMPILER BACKEND
The ts-morph compiler must handle ALL tokens, not just radius and color:
- Create separate modifier files for each token category
- Each modifier targets cva() arguments specifically — no regex, 
  no string.replace()
- Add dry-run validation before zipping
- Stream the zip response using archiver
- Handle errors gracefully with proper status codes

## 5. WIRE THE EXPORT BUTTON
- Export button POSTs full token state to /api/compiler/compile
- Show loading spinner during compilation  
- Trigger browser download of custom-ui.zip on success
- Show error toast on failure
- The zip must contain working, production-ready component files

## 6. RUN AND FIX EVERYTHING
- Run npm run dev and fix all TypeScript errors
- Fix all import issues and missing dependencies
- Verify live preview updates instantly on every token change
- Verify the export downloads a valid zip with real component code
- No any types anywhere

Do all of this fully. If you need to make decisions, make them 
following the existing patterns in the codebase. Do not stop 
and ask — just build.