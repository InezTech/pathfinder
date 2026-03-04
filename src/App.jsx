import React, { useEffect, useState, Suspense } from 'react';
import AuraSplash from './components/AuraSplash';
import CinemaScroll from './components/CinemaScroll';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';

// DYNAMIC IMPORT FIX: 
// Three.js and GLTF loading logic is incredibly heavy (~2MB+).
// By lazy-loading the Manifesto (which contains the 3D WatchScene), 
// we physically split the JS payload, massively speeding up the initial page load and Google ranking.
const Manifesto = React.lazy(() => import('./components/Manifesto'));
const PrivateInquiry = React.lazy(() => import('./components/PrivateInquiry'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // VITAL SEO FIX: Reduced artificial loader from 3000ms to 800ms. 
    // This allows the browser to actually paint the page under 1 second for perfect Google Core Web Vitals.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {loading && <AuraSplash />}
      </AnimatePresence>
      <Navbar />

      {/* 
        Removed the opacity-0 wrapper! 
        Even if the splash screen is up, the browser can now immediately paint the 
        hero section behind it, guaranteeing a lightning-fast First Contentful Paint.
      */}
      <main>
        <section id="hero">
          <CinemaScroll />
        </section>

        <Suspense fallback={<div style={{ height: '600px', backgroundColor: 'var(--obsidian)' }} />}>
          <div id="manifesto">
            <Manifesto />
          </div>
          <section id="inquiry">
            <PrivateInquiry />
          </section>
        </Suspense>
      </main>

      {!loading && (
        <footer className="rolex-footer">
          <p>© 2026 Pathfinder Horology. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#">Legal</a>
            <a href="#">Privacy</a>
            <a href="#">Terms of Service</a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
