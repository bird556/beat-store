import './App.css';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '../pages/Home';
import Beats from '../pages/Beats';
import About from '../pages/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Particles from './components/ui/ReactBits/Particles';
import MusicPlayer from './components/musicplayer';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import ScrollToTop from './components/helper/ScrollToTop';
import { PlayerProvider } from './contexts/PlayerContext';
import { MoveUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartProvider } from './contexts/cart-context';

function App() {
  const headerText = 'text-2xl';
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll position
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate 90% of the page height
      const ninetyPercentHeight = 0.9 * documentHeight;

      // Show button if scrolled past 90% of the page
      setShowButton(scrollPosition + windowHeight >= ninetyPercentHeight);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CartProvider>
          <PlayerProvider>
            <div className="bg-background relative m-auto w-full">
              {/* <Marquee className="sticky top-0 !bg-transparent font-medium">
            15% OFF Code: BIRDIE15 🚀
          </Marquee> */}
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
                    <Route path="/about" element={<About />} />
                  </Routes>
                  {/* <div className="py-10"></div> */}
                  <Footer />
                </div>
              </Router>
              {showButton && (
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  className="z-50 fixed bottom-35 lg:right-20 right-5 transition-all duration-300 transform"
                >
                  <MoveUp />
                </button>
              )}
              <MusicPlayer />
            </div>
          </PlayerProvider>
        </CartProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
