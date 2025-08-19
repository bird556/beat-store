// src/App.tsx
import './App.css';
import { ThemeProvider } from '@/contexts/theme-provider';
import Home from '../pages/Home';
import Beats from '../pages/Beats';
import CartCheckOut from '../pages/CartCheckOut';
// import About from '../pages/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Particles from './components/ui/ReactBits/Particles';
import Contact from './components/Contact';
import MusicPlayer from './components/MusicPlayer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/helper/ScrollToTop';
import { PlayerProvider } from './contexts/PlayerContext';
import { useEffect } from 'react';
import { CartProvider } from './contexts/cart-context';
import { Toaster } from 'react-hot-toast';
import { LicenseProvider } from './contexts/LicenseContext';
import { BeatsProvider } from './contexts/BeatsContext';
import Billing from '../pages/Billing';
import TermsOfUse from '../pages/TermsOfUse';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import RefundPolicy from '../pages/RefundPolicy';
import DownloadPage from '../pages/DownloadPage';
import SingleBeatPage from '../pages/SingleBeat';
import NotFound from '../pages/NotFound';
import LicensePage from '../pages/LicensePage';
function App() {
  const headerText = 'text-2xl';

  useEffect(() => {}, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CartProvider>
          <BeatsProvider>
            <PlayerProvider>
              <LicenseProvider>
                <div className="dark:bg-black bg-background relative m-auto w-full">
                  <div className="fixed h-full w-full top-0 left-0 z-0">
                    <Particles
                      particleColors={['#ffffff', '#ffffff']}
                      particleCount={50000}
                      particleSpread={70}
                      speed={0.1}
                      particleBaseSize={50}
                      // particleBaseSize={10}
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
                        <Route path="*" element={<NotFound />} />
                        <Route path="/beats" element={<Beats />} />
                        <Route path="/licenses" element={<LicensePage />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route
                          path="/terms-of-service"
                          element={<TermsOfUse />}
                        />
                        <Route
                          path="/privacy-policy"
                          element={<PrivacyPolicy />}
                        />
                        <Route
                          path="/refund-policy"
                          element={<RefundPolicy />}
                        />
                        <Route
                          path="/contact"
                          element={<Contact fullscreen={true} />}
                        />
                        {/* <Route path="/about" element={<About />} /> */}
                        <Route
                          path="/checkout"
                          element={<CartCheckOut size={headerText} />}
                        />

                        <Route path="/download" element={<DownloadPage />} />
                        <Route path="/beat" element={<SingleBeatPage />} />
                      </Routes>
                    </div>
                    <Footer />
                    <MusicPlayer />
                  </Router>

                  <Toaster position="top-center" reverseOrder={false} />
                </div>
              </LicenseProvider>
            </PlayerProvider>
          </BeatsProvider>
        </CartProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
