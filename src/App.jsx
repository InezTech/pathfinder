import React, { useEffect, useState } from 'react';
import AuraSplash from './components/AuraSplash';
import CinemaScroll from './components/CinemaScroll';
import Manifesto from './components/Manifesto';
import PrivateInquiry from './components/PrivateInquiry';
import Navbar from './components/Navbar';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate high-end asset preloading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {loading && <AuraSplash />}
      <Navbar />
      <main className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        <section id="hero">
          <CinemaScroll />
        </section>
        <div id="manifesto">
          <Manifesto />
        </div>
        <section id="inquiry">
          <PrivateInquiry />
        </section>
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
