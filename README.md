# 🧵 LOOM

**Where Fashion Meets Dimension**

> A minimalist 3D fashion e-commerce platform that replaces static product photos with interactive 3D garments. Built for the Kora Hackathon.

![Status](https://img.shields.io/badge/Status-In%20Development-800020)
![Hackathon](https://img.shields.io/badge/Kora%20Hackathon-June%202026-C9A96E)

---

## 🎯 The Vision

**Loom** is a premium 3D digital showroom that makes local fashion accessible globally. Customers can:

- 🧊 **Rotate & inspect** 3D garments in a museum-style gallery
- 📏 **Get AI-powered sizing** — enter measurements to scale a 3D mannequin
- 🎨 **Generate bespoke concepts** — describe your dream garment via text/image prompts
- 💳 **Checkout securely** — Kora Pay integration with Bespoke Escrow for international trust
- 💱 **Dynamic currency** — seamless USD/NGN switching

### Flagship Brand: Abraham's Collection

---

## 🎨 Design Language

| Color | Hex | Role |
|-------|-----|------|
| Burgundy Wine | `#5B0F18` | Primary brand |
| Cherry Burgundy | `#800020` | CTAs & buttons |
| Maroon | `#630000` | Hover states |
| Ivory Cream | `#FFFAEF` | Light backgrounds |
| Soft Cream | `#F8F1E7` | Card surfaces |
| Noir Black | `#1B1717` | Deep backgrounds |
| Gold Foil | `#C9A96E` | Premium accents |

**Typography**: Playfair Display (serif headings) + Inter (body text)

**Aesthetic**: Glassmorphism • Editorial • Museum-Gallery • Minimal • Dark Mode

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| 3D Engine | React Three Fiber + Drei + Three.js |
| Animation | GSAP |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Payments | Kora Pay API |
| Real-Time | Socket.io |

---

## 📋 Phased Development

### Phase 1 — Foundation
- 3D Environment (museum lighting, .glb loader, raycaster hotspots)
- Kora Pay Integration (checkout, dynamic pricing, webhooks)

### Phase 2 — Core UI/UX
- Glassmorphism design system (white & burgundy)
- Ghost buttons, slide-in checkout drawer
- Responsive design

### Phase 3 — Advanced Features
- AI Sizing Wizard (measurement → mannequin scaling)
- AI Concept Generator (text/image → garment preview)
- Real-Time Tailor Collaboration (WebSocket-synced 3D canvas)

---

## 📂 Project Structure

```
loom/
├── docs/                    # Planning documents & reference images
│   ├── references/          # Design moodboard & color palettes
│   └── *.docx               # Project planning documents
├── IMPLEMENTATION_PLAN.md   # Technical implementation plan
├── STITCH_UI_PROMPT.md      # UI design prompt for Stitch
├── PROJECT_ANALYSIS.md      # Full analysis of planning docs
└── README.md
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/abraham-DT/loom.git
cd loom

# (Coming soon) Install dependencies
npm install

# (Coming soon) Start development server
npm run dev
```

---

## 📄 Documentation

- [**Project Analysis**](./PROJECT_ANALYSIS.md) — Full breakdown of the 7 planning documents
- [**Implementation Plan**](./IMPLEMENTATION_PLAN.md) — Technical architecture & build roadmap
- [**Stitch UI Prompt**](./STITCH_UI_PROMPT.md) — Complete UI design prompt with color palette

---

## 🏆 Hackathon

**Kora Hackathon** | Deadline: June 5, 2026

- ✅ Team formed
- ✅ Project concept & planning complete
- ✅ Color palette & design system defined
- 🔲 UI design in Stitch/Figma
- 🔲 Frontend scaffolding
- 🔲 Kora API integration
- 🔲 3D garment models
- 🔲 Deployment

---

## 👥 Team

Built with ❤️ for the Kora Hackathon.

---

*© 2026 Loom — Abraham's Collection*
