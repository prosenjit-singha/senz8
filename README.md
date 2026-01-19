# Senz8 Perfume Ecommerce Monorepo

This repository contains the **full Senz8 perfume ecommerce project**, including the **main ecommerce website** and the **animated landing page**, organized using **Turborepo** for a scalable, maintainable monorepo structure.

---

## Overview

This monorepo includes two separate applications:

### 1. Ecommerce Website (`apps/website`)

A fully functional ecommerce platform for perfumes, built to provide a seamless shopping experience:

- **Shopify API Integration:** Real-time product, inventory, and order sync
- **User Authentication:** Secure registration and login system
- **Cart Functionality:** Add/update products fully synced with Shopify
- **SEO Optimized:** Server-side rendered homepage and product pages
- **Forms & Validation:** React Hook Form + Zod for robust form handling
- **State Management:** Zustand for global state (cart, user sessions)
- **Backend Integration:** Next.js App Router & Server Actions

📄 For full details, see: [Ecommerce Website README](apps/website/README.md)  
🌐 Live Demo: [senz8-website.vercel.app](https://senz8-website.vercel.app)

---

### 2. Landing Page (`apps/landing`)

An animated, interactive landing page to showcase the brand:

- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** GSAP and Framer Motion for smooth transitions and scroll-based effects
- **Performance Optimized:** Next.js Server Components and responsive design
- **Interactive UI:** Engaging visuals to highlight brand and products

📄 For full details, see: [Landing Page README](apps/landing/README.md)  
🌐 Live Demo: [senz8-landing.vercel.app](https://senz8-landing.vercel.app)

---

## Tech Stack

- **Frontend & Framework:** Next.js (React, Server Components)
- **State Management:** Zustand (website)
- **Forms & Validation:** React Hook Form + Zod (website)
- **3D Graphics & Animation:** Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Framer Motion (landing)
- **Backend & API Integration:** Next.js App Router (`app/api` routes) and Server Actions (website)
- **Styling:** Tailwind CSS / custom CSS

---

## Getting Started

### Install dependencies

```bash
pnpm install
```
