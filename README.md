# Pathfinder Horology
> One-of-One Masterpieces

A premium, state-of-the-art e-commerce showcase engineered to mimic the interactive luxury of high-end Swiss watchmakers like Rolex and Audemars Piguet. Built with React, Vite, React Three Fiber, and GSAP, Pathfinder delivers cinematic scroll-based 3D animations, perfectly lit interactive product models, precision typography, and flawless layout transitions.

## 🌟 Key Features

### **Real-Time 3D Interactive Showcase**
- **React Three Fiber & Drei:** Replaces static photography with a fully realized, interactive 3D WebGL model (`.gltf`) of a luxury timepiece.
- **Studio-Grade Lighting:** Utilizes dynamic `Environment` mapping and multi-directional ambient/studio lighting to achieve photo-realistic gold reflections.
- **Precision Framing & Physics:** Hand-coded responsive focal lengths (`adjustCamera`), locked polar angles, and heavy momentum damping on `OrbitControls` ensure the watch feels like a solid, premium object that customers can only smoothly rotate along a locked horizontal axis.
- **Dynamic Shadows:** Employs soft, calculated `ContactShadows` to anchor the 3D model beautifully onto the digital canvas.

### **Cinematic Scroll Rendering (GSAP Engine)**
- **High-Performance Image Sequence:** Uses `gsap` ScrollTrigger paired with an HTML5 `<canvas>` to deliver a 417-frame sequence of a watch assembling in 3D right as you scroll down the page.
- **Skeletal Load Strategy:** Employs an intelligent multi-threaded preloader that instantly fetches a sparse "skeleton" sequence (every 10th frame) first. This ensures buttery smooth, razor-sharp scrubbing with zero network stalling, even on mobile devices.
- **CPU Offloading:** Implements sub-millisecond frame cache checking to completely skip redundant `drawImage` paint cycles, bypassing standard scroll-lag.

### **Swiss Precision Aesthetics**
- **Micro-Animations:** Features elegant, staggered reveals and continuous hovering `framer-motion` sequences.
- **Typography:** Hand-tuned leading and tracking on classic serif fonts (`Cormorant Garamond`) contrasting heavily with functional, tracked-out sans-serif web fonts.
- **"By Invitation Only" Paradigm:** Stripped of standard web forms, utilizing sophisticated CSS grid/flexbox layouts to deliver an exclusive, high-net-worth contact point design format.

## 🛠 Tech Stack
- Frontend Framework: **React 18**
- Build Tool: **Vite**
- 3D Engine: **Three.js**, **@react-three/fiber**, **@react-three/drei**
- Animation Engine: **GSAP** & **Framer Motion**
- Styling: **Pure CSS** (Custom Variables & Modern Native Flexbox/CSS Grid)
- Icons: **Lucide React**

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## 📐 Design & Engineering Philosophy

The objective of Pathfinder is to dominate negative space with immense, interactive graphics without sacrificing vertical pixel rhythm or mobile performance. The transition from the pitch-black cinematic scroll assembly directly into the pristine, interactive 3D WebGL gallery forces a stunning visual tempo change for the user, drawing complete and undivided attention to the craftsmanship of the product. Every element—from the weight of the 3D rotation physics to the fade-in GSAP timings—is mathematically tuned to exude high-end luxury.
