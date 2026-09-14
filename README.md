# 🧵 LOOM — 3D Virtual Atelier & Bespoke Fashion

**Where Fashion Meets Dimension**

> A minimalist 3D fashion e-commerce showroom replacing static product photos with interactive 3D WebGL garments, live MediaPipe camera body scanning, custom native design studio, and Payaza payment integration. Built for commercial luxury fashion e-commerce.

---

## 🎯 Project Overview & Architecture Alignment

**LOOM** is a luxury digital showroom that brings bespoke African fashion to life in 3D. 

### Core Features & User Workflows:
- 🧊 **3D Showroom Gallery (`ATELIER` Tab)**: Rotate 360°, inspect fabric weaves, view raycaster hotspots, and toggle between bespoke garments or the bare 3D mannequin.
- 🎨 **Bespoke Native Studio (`STUDIO` Tab)**: Design custom native attire from scratch (Senator Top, Imperial Agbada, Royal Kaftan, Dashiki) with real-time options for fit, color, collar, pockets, and embroidery.
- 📏 **AI Body Scanning & Sizing Wizard**: Google MediaPipe Pose AI camera body scanning + 3-step measurement wizard to scale the 3D mannequin in real time.
- 🧵 **Heritage Textile Archive (`TEXTILES` Tab)**: 1200x optical macro lens visualizer and oral history audio archives for heritage fabrics (Aso-Oke, Velvet, Silk).
- 🤖 **Dual AI Conceptor (`EDITIONS` Tab)**: Primary AI (Google Gemini) + Fallback AI (Groq Llama 3) for synthesizing bespoke design specifications from text prompts.
- 💳 **Payaza Payment Integration**: Direct, secure e-commerce checkout powered by Payaza (Naira ₦ NGN exclusive currency).

---

## 🎨 Design Tokens & Aesthetic Standard

| Color Token | Hex | Role / Usage |
| :--- | :--- | :--- |
| **Burgundy Wine** | `#5B0F18` | Primary brand backdrop |
| **Cherry Burgundy** | `#800020` | Primary CTAs & interactive highlights |
| **Noir Black** | `#1B1717` | Canvas backdrop & dark obsidian glass |
| **Ivory Cream** | `#FFFAEF` | Headlines & editorial typography contrast |
| **Soft Cream** | `#F8F1E7` | Input card surfaces |
| **Gold Foil** | `#C9A96E` | Luxury filigree borders, badges & metallic accents |

**Typography**: `Playfair Display` (serif headlines) + `Inter` (body & tabular metrics)

---

## 🔌 Backend API Contracts (For Backend Engineers & Copilots)

All backend engineers and AI copilots MUST adhere strictly to the following API endpoints:

### 1. Payaza Checkout Initialization
* **Endpoint:** `POST /api/payaza/initialize-transaction`
* **Request Payload:**
  ```json
  {
    "amount": 520000,
    "currency": "NGN",
    "email": "patron@loom.fashion",
    "fullName": "Bespoke Patron"
  }
  ```
* **Response Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "checkoutUrl": "https://checkout.payaza.africa/pay/...",
      "reference": "PZ_1788894200"
    }
  }
  ```

### 2. Custom Native Order Creation
* **Endpoint:** `POST /api/orders/create`
* **Request Payload:**
  ```json
  {
    "garment": {
      "style": "Senator Top",
      "fit": "Tailored Fit",
      "primaryColor": "#5B0F18",
      "collarStyle": "Mandarin Collar",
      "pockets": "Double Welt Pocket",
      "embroidery": "Gold Chest Motif"
    },
    "priceNaira": 145000,
    "customer": { "email": "patron@loom.fashion", "phone": "+2348000000000" }
  }
  ```

### 3. Dual AI Concept Generator (Primary + Fallback Rollback)
* **Endpoint:** `POST /api/ai/generate-concept`
* **Primary Model:** Google Gemini (`PRIMARY_AI_API_KEY`)
* **Fallback Model:** Groq Llama 3 (`FALLBACK_AI_API_KEY`)
* **Request Payload:** `{ "prompt": "Deep burgundy velvet Senator top with gold collar filigree" }`

---

## 🛑 MANDATORY DIRECTIVES FOR BACKEND & SOFTWARE ENGINEERS

> [!IMPORTANT]
> All incoming developers, software engineers, and backend AI agents MUST strictly comply with these rules. Do not modify or replace the core frontend decisions outlined below.

1. **Payaza Gateway Exclusive**: Payaza is the ONLY supported payment gateway for transactions.
2. **Naira (₦ NGN) Currency Exclusive**: Multi-currency conversion and USD toggles have been removed by design. All transactions, pricing metrics, and API payloads must be in **NGN**.
3. **No Escrow Virtual Accounts**: Standard e-commerce direct checkout is enforced (`POST /api/payaza/initialize-transaction`). Do NOT introduce milestone-based escrow accounts or virtual bank transfers.
4. **No Third-Party Branding**: Brand references to outside collections or legacy demos (e.g. Abraham's Collection) are strictly forbidden. The system is branded exclusively as **LOOM — 3D Virtual Atelier**.
5. **Aesthetics & Color Palette Rules**: All UI elements, backend responses returning UI themes, or generated metadata must strictly respect the color system:
   - Burgundy Wine (`#5B0F18`), Cherry Burgundy (`#800020`), Noir Black (`#1B1717`), Ivory Cream (`#FFFAEF`), Gold Foil (`#C9A96E`).

---

## 🗂️ Project Structure

```
loom/
├── public/
│   └── models/               # 3D mannequin & garment .glb models
├── server/
│   ├── routes/
│   │   ├── aiConceptor.js    # Primary (Gemini) + Fallback (Groq) AI route
│   │   ├── payaza.js         # Payaza payment transaction route
│   │   └── orders.js         # Standard checkout order route
│   └── server.js             # Express API & Socket.io server
├── src/
│   ├── components/
│   │   ├── 3d/               # Three.js / React Three Fiber WebGL stage
│   │   ├── modules/          # NativeStudio, Showroom, Sizing, Checkout, Textiles
│   │   └── ui/               # Header, GlassCard, Badge
│   ├── context/
│   │   └── AtelierContext.jsx# Global state, Naira pricing & custom native builder
│   ├── utils/
│   │   └── poseCalculator.js # MediaPipe AI camera pose 3D landmark math
│   ├── App.jsx               # Main layout & router
│   └── main.jsx
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start both backend Express server and frontend Vite server concurrently
npm start
```

---

*© 2026 LOOM — Where Fashion Meets Dimension*
