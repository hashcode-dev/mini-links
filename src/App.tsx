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
      '/': 'Mini-Links | URL Shortener, Branded Short Links & Analytics',
      '/pricing': 'Mini-Links Pricing | Scalable URL Shortening Plans',
      '/about': 'About Us | Mini-Links Redirection Standards & Team',
      '/contact': 'Contact Support | Submit Link Abuse & Inquiries',
      '/privacy-policy': 'Privacy Policy | Data Collection, Cookies & GDPR Disclosure',
      '/terms-of-service': 'Terms of Service | User Conduct & Redirect Liability Agreements',
      '/sitemap': 'HTML Sitemap | Browse Mini-Links Public Directory',
    };

    const descriptionMap: Record<string, string> = {
      '/': 'Mini-Links: Create short, user-friendly URLs and dynamic QR codes in seconds. Complete with real-time access analytics, custom branded domains, and secure redirects.',
      '/pricing': 'Choose the perfect URL shortening and link management plan for your brand or enterprise. Start for free or scale up for custom domains and advanced API features.',
      '/about': 'Learn about the mission, engineering team, and redundant edge server infrastructure behind Mini-Links URL shortening and dynamic redirection standards.',
      '/contact': 'Get in touch with the Mini-Links support team. Submit general inquiries, billing questions, or file spam and phishing link abuse reports.',
      '/privacy-policy': 'Read the Mini-Links privacy policy. Details on tracking cookies, Google DART cookie disclosures, GDPR/CCPA data compliance, and user data rights.',
      '/terms-of-service': 'Our terms of service outline user conduct guidelines, strict bans on spam, phishing, and malware, and policies on immediate link terminations.',
      '/sitemap': 'Navigate the public directory sitemap of Mini-Links to easily browse core platform features, product pricing, trust guidelines, and legal documents.',
    };

    const keywordsMap: Record<string, string> = {
      '/': 'url shortener, shorten url, link shortener, tinyurl, custom url, branded links, qr code generator, link analytics, dynamic qr code, track link clicks',
      '/pricing': 'url shortener pricing, link management cost, custom domain short links, developer api shortener, enterprise link tracking plans',
      '/about': 'about mini links, link redirection team, url shortener safety, secure redirects infrastructure',
      '/contact': 'contact url shortener support, report link abuse, report phishing redirects, support tickets mini links',
      '/privacy-policy': 'privacy policy, cookie policy, google DART cookie opt out, gdpr compliance, ccpa data rights',
      '/terms-of-service': 'terms of service, redirect terms, spam policy, link takedown rules, limit of liability',
      '/sitemap': 'sitemap, directory, navigation map, mini links pages',
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

    // Update or create description tag in head
    let metaDescription: HTMLMetaElement | null = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = descriptionMap[location.pathname] || 'Mini-Links: Create short, user-friendly URLs, dynamic QR codes, and trace redirects.';

    // Update or create keywords tag in head
    let metaKeywords: HTMLMetaElement | null = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywordsMap[location.pathname] || 'url shortener, shorten url, link shortener, custom url';
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
