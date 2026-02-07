# Creative Design System

### 16 Generative Tools + Visual Style Guide

A comprehensive suite of creative tools for generating visual content -- from 8-bit pixel converters and ASCII art generators to advanced sprite editors and generative visual experiments. Paired with a brand visual style guide, this system serves as both a production toolkit and a living reference for the FAW visual identity.

---

## Why This Exists

Creative teams need fast, accessible tools for visual exploration. Not every idea requires Photoshop. Sometimes you need to quickly generate an ASCII art header, convert an image to pixel art, test a sprite animation, or prototype a generative visual -- and you need to do it without leaving the browser.

This project consolidates 16 distinct creative tools into a single, navigable system. Each tool is purpose-built for a specific visual task, and together they cover the full spectrum from retro pixel aesthetics to procedural generative art. The included visual style guide ensures all output can be evaluated against a consistent brand standard.

---

## Architecture

```
creative-design-system/
  creative-tools/
    src/
      app/
        page.tsx              -- Tool hub / navigation dashboard (animated alien pixel logo)
        8bit/
          page.tsx            -- 8-bit pixel art converter
        pixel-editor/
          page.tsx            -- Sprite pixel editor
        ascii-art/
          page.tsx            -- ASCII art generator
        alien-studio/
          page.tsx            -- Alien character studio
      globals.css             -- Shared styles
      layout.tsx              -- App shell layout
  alien-studio/
    page.jsx                  -- Standalone alien character creation tool
  acsII_art.html              -- Standalone ASCII art generator (vanilla HTML/JS)
  FAW-VISUAL-STYLE-GUIDE.md   -- Brand visual identity reference document
```

---

## The 16 Tools

The tool hub presents all generators through a retro terminal-inspired interface, complete with an animated pixel alien logo. Each tool is categorized and accessible via a central navigation dashboard.

**Categories span:**
- Image-to-pixel-art conversion
- Freehand sprite editors
- ASCII and text-art generators
- Alien/character design studios
- Generative visual experiments

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Rendering | HTML5 Canvas, SVG |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Standalone Tools | Vanilla HTML5 + CSS + JavaScript |
| Language | TypeScript, JSX |

---

## Quick Start

```bash
# For the Next.js creative tools hub
cd creative-tools
npm install
npm run dev

# For standalone tools, open directly in a browser:
open acsII_art.html
```

---

## Visual Style Guide

The included `FAW-VISUAL-STYLE-GUIDE.md` documents the brand visual identity -- typography, color systems, spacing conventions, and tone guidelines -- providing a reference standard for all generated visual output.

---

## Author

**Huang Akai (Kai)**
Founder @ Universal FAW Labs | Creative Technologist | Ex-Ogilvy | 15+ years experience
