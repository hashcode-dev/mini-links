import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LinkAnalytics from './pages/LinkAnalytics';
import Links from './pages/Links';
import QRCode from './pages/QRCode';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import RequireAuth from './components/RequireAuth';
import CreateLink from './pages/CreateLink';

// Compliance & Trust Pages
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SitemapPage from './pages/SitemapPage';

// Helper component to dynamically inject Canonical links and Document Titles
function PageMetaManager() {
  const location = useLocation();

  useEffect(() => {
    // Generate clean canonical URL (strips trailing slashes, search queries and hashes)
    const cleanPath = location.pathname.endsWith('/') && location.pathname !== '/'
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const canonicalUrl = `https://mini-links.com${cleanPath}`;

    // Update or create canonical link in head
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // Set Dynamic Tab Titles to guarantee unique crawler indexing
    const titleMap: Record<string, string> = {
      '/': 'Mini-Links | Enterprise URL Shortener & Dynamic QR Codes',
      '/pricing': 'Mini-Links Pricing | Scalable Plans for Teams & Developers',
      '/about': 'About Us | Mini-Links Redirection Standards & Team',
      '/contact': 'Contact Support | Submit Link Abuse & Inquiries',
      '/privacy-policy': 'Privacy Policy | Data Collection, Cookies & GDPR Disclosure',
      '/terms-of-service': 'Terms of Service | User Conduct & Redirect Liability Agreements',
      '/sitemap': 'HTML Sitemap | Browse Mini-Links Public Directory',
    };

    // Private route titles helper
    if (location.pathname.startsWith('/dashboard')) {
      document.title = 'Dashboard | Mini-Links Management';
    } else if (location.pathname.startsWith('/links/new')) {
      document.title = 'Create Short Link | Mini-Links';
    } else if (location.pathname.startsWith('/links')) {
      document.title = 'My Links | Mini-Links';
    } else if (location.pathname.startsWith('/qr')) {
      document.title = 'QR Code Workshop | Mini-Links';
    } else {
      document.title = titleMap[location.pathname] || 'Mini-Links | Branded Link Shortener';
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <Router>
      <PageMetaManager />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          {/* Public Core Routes */}
          <Route path="pricing" element={<Pricing />} />

          {/* Compliance & Trust Routes */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="sitemap" element={<SitemapPage />} />

          {/* Secured User Workspace Routes */}
          <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="links" element={<RequireAuth><Links /></RequireAuth>} />
          <Route path="links/new" element={<RequireAuth><CreateLink /></RequireAuth>} />
          <Route path="links/:id" element={<RequireAuth><LinkAnalytics /></RequireAuth>} />
          <Route path="qr" element={<RequireAuth><QRCode /></RequireAuth>} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
