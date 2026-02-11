# Creative Design System

## About

Creative Design System 是一套瀏覽器端的創意工具箱，整合多種生成式視覺工具與復古美術工作流。適合設計師與創意團隊用於快速產出素材、建立一致的視覺風格，並加速概念設計與原型迭代。

## About (EN)

Creative Design System is a browser-based toolbox that combines multiple generative visual tools into one design workflow. It helps creative teams produce assets faster while keeping style exploration and output consistency in one place.

## 📋 Quick Summary

> 🎨 **Creative Design System** 是一套整合了 **16 種生成式視覺工具** 的創意設計系統，專為創意團隊打造的瀏覽器端工具箱。🖼️ 涵蓋 8-bit 像素轉換器、ASCII 藝術生成器、精靈圖編輯器、外星角色工作室等多元工具，從復古像素美學到程序化生成藝術一應俱全。⚡ 基於 Next.js App Router 構建，搭配 HTML5 Canvas 與 Tailwind CSS，提供流暢的終端風格介面體驗。🛸 動態像素外星人 Logo 為導航中樞增添趣味，每個工具都針對特定視覺任務精心設計。📐 內附 FAW 品牌視覺風格指南，確保所有生成產出符合一致的品牌標準。💡 適合需要快速視覺探索、原型設計、以及品牌素材生成的創意工作者，無需離開瀏覽器即可完成從構思到產出的完整流程。🚀 不再依賴重量級設計軟體，讓創意隨時隨地爆發！

### 16 Generative Tools + Visual Style Guide

A comprehensive suite of creative tools for generating visual content -- from 8-bit pixel converters and ASCII art generators to advanced sprite editors and generative visual experiments. Paired with a brand visual style guide, this system serves as both a production toolkit and a living reference for the FAW visual identity.

---

## 💡 Why This Exists

Creative teams need fast, accessible tools for visual exploration. Not every idea requires Photoshop. Sometimes you need to quickly generate an ASCII art header, convert an image to pixel art, test a sprite animation, or prototype a generative visual -- and you need to do it without leaving the browser.

This project consolidates 16 distinct creative tools into a single, navigable system. Each tool is purpose-built for a specific visual task, and together they cover the full spectrum from retro pixel aesthetics to procedural generative art. The included visual style guide ensures all output can be evaluated against a consistent brand standard.

---

## 🏗️ Architecture

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

## 🧰 The 16 Tools

The tool hub presents all generators through a retro terminal-inspired interface, complete with an animated pixel alien logo. Each tool is categorized and accessible via a central navigation dashboard.

**Categories span:**
- Image-to-pixel-art conversion
- Freehand sprite editors
- ASCII and text-art generators
- Alien/character design studios
- Generative visual experiments

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Rendering | HTML5 Canvas, SVG |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Standalone Tools | Vanilla HTML5 + CSS + JavaScript |
| Language | TypeScript, JSX |

---

## 🏁 Quick Start

```bash
# For the Next.js creative tools hub
cd creative-tools
npm install
npm run dev

# For standalone tools, open directly in a browser:
open acsII_art.html
```

---

## 🎨 Visual Style Guide

The included `FAW-VISUAL-STYLE-GUIDE.md` documents the brand visual identity -- typography, color systems, spacing conventions, and tone guidelines -- providing a reference standard for all generated visual output.

---

## ✍️ Author

**Huang Akai (Kai)**
Founder @ Universal FAW Labs | Creative Technologist | Ex-Ogilvy | 15+ years experience
