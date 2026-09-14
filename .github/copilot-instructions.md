# Loom Development Guidelines

## Project Context
Loom is a premium 3D fashion e-commerce showroom for the Kora Hackathon, with Abraham's Collection as the flagship brand.

## Team Role Split
- Person 1: Backend & Escrow Systems Lead (Claude Pro)
  - Kora Pay API and escrow state machine
  - Webhooks, secure payments, and backend reliability
- Person 2: Frontend & UI/UX Developer (GitHub Copilot + IDE)
  - React/Vite storefront, glassmorphism UI, checkout UX, and currency toggles
  - Responsive product experience and customer-facing flows
- Person 3: 3D Graphics & AI Lead (Antigravity)
  - React Three Fiber showroom, garment viewer, and mannequin interaction
  - AI sizing, concept generation, and live 3D sync

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS
- 3D Engine: React Three Fiber, Drei, Three.js
- Animation: GSAP
- Backend: Node.js, Express, Socket.io
- Payments: Kora Pay API

## Design Tokens
- Burgundy Wine: #5B0F18
- Cherry Burgundy: #800020
- Noir Black: #1B1717
- Ivory Cream: #FFFAEF
- Gold Foil: #C9A96E

## Source of Truth
Use the planning documents in `docs/` and the product strategy in `PROJECT_ANALYSIS.md` as the canonical reference for product direction.
