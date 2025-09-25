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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import ScrollToTop from './components/helper/ScrollToTop';
import { PlayerProvider } from './contexts/PlayerContext';
import { useEffect, useState } from 'react';
import { CartProvider } from './contexts/cart-context';
import { Toaster } from 'react-hot-toast';
import { LicenseProvider } from './contexts/LicenseContext';
import { BeatsProvider } from './contexts/BeatsContext';
import { BeatPackProvider } from './contexts/BeatPackContext';
import { OrdersProvider } from './contexts/OrdersContext';
import Billing from '../pages/Billing';
import TermsOfUse from '../pages/TermsOfUse';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import RefundPolicy from '../pages/RefundPolicy';
import DownloadPage from '../pages/DownloadPage';
import SingleBeatPage from '../pages/SingleBeat';
import NotFound from '../pages/NotFound';
import LicensePage from '../pages/LicensePage';
import NewsLetterSignUp from './components/NewsLetterSignUp';
import BlogPage from '../pages/BlogPage';
import BlogPostWrapper from '../pages/BlogPost';
import Login from '../pages/Login';
import Pack from '../pages/Packs';
import AdminBeats from '../pages/dashboard/AdminBeats';
import AdminBeatPacks from '../pages/dashboard/AdminBeatPacks';
import AdminSingleBeat from '../pages/dashboard/AdminSingleBeat';
import AdminUploadBeats from '../pages/dashboard/AdminUploadBeat';
import Dashboard from '../pages/dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SinglePack from '../pages/SinglePack';
import Maintenance from '../pages/Maintenance';
// Create a wrapper component that uses useLocation
function AppContent() {
  const headerText = 'text-2xl';

  // Use the useLocation hook to get the current URL path
  const location = useLocation();
  const [isUnderMaintenance] = useState(false);
  // Check if the current path is the dashboard
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdminLogin = location.pathname.startsWith('/admin');

  useEffect(() => {}, []);

  return (
    <div className="dark:bg-black bg-background relative m-auto w-full">
      <div className="fixed h-full w-full top-0 left-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={50000}
          particleSpread={70}
          speed={0.1}
          particleBaseSize={50}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={true}
        />
      </div>
      <ScrollToTop />
      {!isDashboard && !isAdminLogin && !isUnderMaintenance && <Navbar />}
      <div className="overflow-x-hidden">
        <Routes>
          <>
            {!isUnderMaintenance ? (
              <>
                {/* Home */}
                <Route path="/" element={<Home size={headerText} />} />
                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
                {/* Beats */}
                <Route path="/beats" element={<Beats />} />
                {/* Packs*/}
                <Route path="/packs" element={<Pack />} />
                <Route path="/licenses" element={<LicensePage />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/terms-of-service" element={<TermsOfUse />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route
                  path="/contact"
                  element={<Contact fullscreen={true} />}
                />
                {/* BLOG */}
                <Route
                  path="/blogs"
                  element={
                    <BlogPage tagline="Latest Updates" heading="Blog Posts" />
                  }
                />
                <Route path="/blog/:id" element={<BlogPostWrapper />} />
                <Route
                  path="/checkout"
                  element={<CartCheckOut size={headerText} />}
                />
                <Route path="/download" element={<DownloadPage />} />
                <Route path="/beat" element={<SingleBeatPage />} />
                <Route path="/pack" element={<SinglePack />} />
                <Route path="/newsletter" element={<NewsLetterSignUp />} />
                {/* Login */}
                <Route path="/admin" element={<Login />} />
              </>
            ) : (
              <Route path="*" element={<Maintenance />} />
            )}
            {/* ADMIN DASHBOARD */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/beats" element={<AdminBeats />} />
              <Route path="/admin/packs" element={<AdminBeatPacks />} />
              <Route path="/admin/beat" element={<AdminSingleBeat />} />
              <Route path="/admin/upload-beat" element={<AdminUploadBeats />} />
            </Route>
          </>
        </Routes>
      </div>
      {!isDashboard && !isAdminLogin && !isUnderMaintenance && <Footer />}
      {!isDashboard && !isAdminLogin && !isUnderMaintenance && <MusicPlayer />}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CartProvider>
        <OrdersProvider>
          <BeatsProvider>
            <BeatPackProvider>
              <PlayerProvider>
                <LicenseProvider>
                  <AuthProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </AuthProvider>
                </LicenseProvider>
              </PlayerProvider>
            </BeatPackProvider>
          </BeatsProvider>
        </OrdersProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
