import './App.css';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '../pages/Home';
import Beats from '../pages/Beats';
import CartCheckOut from '../pages/CartCheckOut';
import About from '../pages/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Particles from './components/ui/ReactBits/Particles';
import Contact from './components/Contact';
import MusicPlayer from './components/musicplayer';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import ScrollToTop from './components/helper/ScrollToTop';
import { PlayerProvider } from './contexts/PlayerContext';
import { MoveUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartProvider } from './contexts/cart-context';
import { Toaster } from 'react-hot-toast';
import { LicenseProvider } from './contexts/LicenseContext';
function App() {
  const headerText = 'text-2xl';

  useEffect(() => {}, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CartProvider>
          <PlayerProvider>
            <LicenseProvider>
              <div className="bg-background relative m-auto w-full">
                <div className="fixed h-full w-full top-0 left-0 z-0">
                  <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={50000}
                    particleSpread={70}
                    speed={0.1}
                    particleBaseSize={10}
                    moveParticlesOnHover={false}
                    alphaParticles={true}
                    disableRotation={true}
                  />
                </div>
                <Router>
                  <ScrollToTop />
                  <Navbar />
                  <div className="overflow-x-hidden">
                    <Routes>
                      <Route path="/" element={<Home size={headerText} />} />
                      <Route path="*" element={<Home size={headerText} />} />
                      <Route path="/beats" element={<Beats />} />
                      <Route
                        path="/contact"
                        element={<Contact fullscreen={true} />}
                      />
                      <Route path="/about" element={<About />} />
                      <Route
                        path="/checkout"
                        element={<CartCheckOut size={headerText} />}
                      />
                    </Routes>
                    {/* <div className="py-10"></div> */}
                  </div>
                  <Footer />
                </Router>

                <Toaster position="top-center" reverseOrder={false} />
                <MusicPlayer />
              </div>
            </LicenseProvider>
          </PlayerProvider>
        </CartProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
