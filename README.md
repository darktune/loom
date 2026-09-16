# 🧵 LOOM — 3D Virtual Atelier & Bespoke Fashion

**Where Fashion Meets Dimension**

> A luxury 3D fashion atelier platform replacing static e-commerce lookbooks with an interactive, full-screen WebGL showroom, biometric body morphing, bespoke Native Studio configurator, tailor-patron direct quotation model, and milestone-locked Payaza Escrow.

---

## 🏛️ Project Architecture & Design Philosophy

LOOM is engineered according to high-fashion editorial minimalism and modern HCI principles:
* **The 3D Canvas is the Hero**: No bulky opaque sidebars or cluttered widgets. The 3D stage occupies 100vw × 100vh with floating glassmorphic pill docks (`backdrop-blur: 24px`).
* **Universal LOOM Identity**: Modular `<LoomLogo />` component featuring an editorial gold oval frame with an italic serif monogram and ultra-wide tracking (`tracking-[0.28em]`).
* **Tailor-Patron Direct Consultation Model**: Public off-the-rack price tags are eliminated. Pricing is quoted and negotiated directly between master tailors and patrons during digital consultations, after which funds are locked in Payaza Escrow.
* **Luxury Multi-Theme Engine**:
  * 🖤 **Obsidian Noir (`'noir'`)**: Deep near-black `#120F0D` surfaces, frosted dark glass, and gold foil accents.
  * 🍷 **Imperial Burgundy (`'burgundy'`)**: Royal wine `#22080E` and cherry velvet tones with warm ivory cream.
  * 🕊️ **Ivory Silk Gallery (`'ivory'`)**: High-fashion museum light theme (`#F7F3EB`) with deep burgundy typography and gold filigree borders.

---

## 🧭 Application Modules & Navigation

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [LOOM LOGO]    SALON  |  3D ATELIER  |  STUDIO  |  TEXTILES  |  EDITIONS    │
└──────────────────────────────────────────────────────────────────────────────┘
```

1. **SALON (`SalonHero.jsx`)**: Apple-level editorial landing page showcasing flagship couture pieces, craftsmanship provenance, and instant showroom entry.
2. **3D ATELIER (`AtelierScene.jsx`)**: Full-screen 3D showroom with 360° OrbitControls, offline 5-point studio lighting rig, raycaster hotspots, silhouette switcher (*The Sovereign Agbada, Royal Kaftan, Bespoke Tuxedo*), and anatomical Bare Mannequin mode.
3. **STUDIO (`NativeStudio.jsx`)**: 6-stage bespoke African & contemporary fashion builder (*Silhouette, Fit, Colorway, Collar Geometry, Pockets, Embroidery*).
4. **TEXTILES (`TextileArchive.jsx`)**: Interactive fabric showcase with Aso-Oke, Brocade, and Silk weaves, thread densities, and artisan provenance.
5. **EDITIONS (`ConceptGenerator.jsx`)**: AI prompt workshop for visualizing bespoke couture concepts.
6. **FITTING ROOM (`CollaborativeRoom.jsx`)**: Real-time collaborative fitting room with live chat sync between patron and master tailor.
7. **ESCROW CHECKOUT (`CheckoutDrawer.jsx`)**: Delivery details and Payaza escrow initialization based on agreed tailor quotations.

---

## ⚡ Performance & Bundle Optimization

* **Code-Splitting**: Three.js, React Three Fiber, and Drei are split into an isolated `vendor-three` chunk via `vite.config.js`.
* **Bundle Reduction**: Initial page entry bundle reduced from `1,148 kB` down to **`76 kB`** (16.8 kB gzipped) — a **93.4% reduction** in initial payload.
* **Offline Lighting Rig**: Replaced external Drei HDRI CDN downloads with an offline mathematical 5-point studio lighting rig, eliminating 503 network timeouts and WebGL context loss.

---

## 🛡️ Security Hardening

* **HTTP Security Headers (`helmet`)**: Enforces secure headers and disables `X-Powered-By: Express`.
* **Dual-Tier Rate Limiting (`express-rate-limit`)**:
  * Global API Limiter: 200 requests / 15 minutes per IP.
  * Strict Escrow Limiter: 30 payment initializations / 15 minutes per IP on `/api/payaza/`.
* **Zod Schema Validation (`server/routes/payaza.js`)**: Enforces positive non-zero transaction amounts (capped at ₦50M), whitelisted currency codes (`NGN`, `USD`), and RFC email format.
* **Payload Bound**: Request body limited to 100kb to mitigate memory exhaustion.
* **Environment Hygiene**: Sample environment variables documented in [`.env.example`](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/.env.example).

---

## 🧪 Testing Suite & Quality Assurance

### 1. Vitest Unit & Security Tests (100% Pass Rate)
Runs in native headless Node environment:
```bash
npm test
```
* `src/test/pricing.test.js`: Validates currency conversion and quote formatting.
* `src/test/sizing.test.js`: Validates 3D mannequin biometric scaling math.
* `src/test/security.test.js`: Validates Zod transaction validation rules.

### 2. Playwright End-to-End Test Suite
Executes comprehensive user journey tests across Desktop Chromium and Mobile Safari:
```bash
npm run test:e2e
```

### 3. Vulnerability Audit
```bash
npm run security:audit
```

---

## 📚 Technical Documentation & Integration Guides

* 📑 [**Complete Audit & QA Report**](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/docs/AUDIT_REPORT.md): Full technical evaluation of bundle size, security, WCAG 2.2 accessibility, and test runs.
* 🧊 [**3D Modeling Engine Integration Spec**](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/docs/3D_ENGINE_INTEGRATION_SPEC.md): Technical contract for the upcoming Codex IDE commit (Astra GLB loader & universal logo drop-in).
* ⚙️ [**Environment Template**](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/.env.example): Environment variable configuration template.

---

## 🚀 Quickstart

### Prerequisites
* Node.js >= 18.x
* npm >= 9.x

### Installation & Launch
```bash
# Install dependencies
npm install

# Start both Express backend and Vite frontend concurrently
npm start
```
* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:5000`
