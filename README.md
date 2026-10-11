# LOOM

**Where Fashion Meets Dimension**

> A minimalist 3D fashion platform replacing static product photos with interactive 3D garments.

---

## The Vision

**Loom** is a premium 3D digital showroom that makes bespoke fashion accessible globally. Customers can:

- **Rotate & inspect** 3D garments in a museum-style gallery
- **Get AI-powered sizing** — enter measurements to scale a 3D mannequin
- **Generate bespoke concepts** — describe your dream garment via text/image prompts (Tripo AI)
- **Checkout securely** — Multi-currency checkout (USD / NGN) powered by Flutterwave

---

## Design Language

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

## Team Role Split

- **Backend & Escrow Systems**: Kora Pay API, escrow state management, webhooks, and payment reliability.
- **Frontend & UI/UX**: React/Vite storefront, responsive customer flows, checkout experience, and visual design.
- **3D Graphics & AI**: React Three Fiber showroom, garment viewer, AI sizing, concept generation, and 3D synchronization.

## Technical Documentation

- [3D Engine Integration Spec](docs/3D_ENGINE_INTEGRATION_SPEC.md)
- [Audit and QA Report](docs/AUDIT_REPORT.md)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| 3D Engine | React Three Fiber + Drei + Three.js |
| Styling | CSS Modules / Vanilla CSS |
| Backend | Node.js + Express |
| 3D Mesh AI | Tripo AI API |
| Payments | Payaza Gateway API |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/darktune/loom.git
cd loom

# Install dependencies
npm install

# Start development server
npm run dev

# Start backend server
npm run server
```

---

*© 2026 Loom. All rights reserved.*
