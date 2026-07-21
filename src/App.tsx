import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import NotFound from './pages/NotFound';

// Helper component to dynamically inject Canonical links, Document Titles, OpenGraph tags, and JSON-LD Schemas
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

    // Title Map
    const titleMap: Record<string, string> = {
      '/': 'Mini-Links | URL Shortener, Branded Short Links & Analytics',
      '/pricing': 'Mini-Links Pricing | Scalable URL Shortening Plans',
      '/about': 'About Us | Mini-Links Redirection Standards & Team',
      '/contact': 'Contact Support | Submit Link Abuse & Inquiries',
      '/privacy-policy': 'Privacy Policy | Data Collection, Cookies & GDPR Disclosure',
      '/terms-of-service': 'Terms of Service | User Conduct & Redirect Liability Agreements',
      '/sitemap': 'Sitemap | Browse Mini-Links Public Directory',
      '/404': '404 Page Not Found | Mini-Links',
    };

    const descriptionMap: Record<string, string> = {
      '/': 'Mini-Links: Create short, user-friendly URLs and dynamic QR codes in seconds. Complete with real-time access analytics, custom branded domains, and secure redirects.',
      '/pricing': 'Choose the perfect URL shortening and link management plan for your brand or enterprise. Start for free or scale up for custom domains and advanced API features.',
      '/about': 'Learn about the mission, engineering team, and redundant edge server infrastructure behind Mini-Links URL shortening and dynamic redirection standards.',
      '/contact': 'Get in touch with the Mini-Links support team. Submit general inquiries, billing questions, or file spam and phishing link abuse reports.',
      '/privacy-policy': 'Read the Mini-Links privacy policy. Details on tracking cookies, Google DART cookie disclosures, GDPR/CCPA data compliance, and user data rights.',
      '/terms-of-service': 'Our terms of service outline user conduct guidelines, strict bans on spam, phishing, and malware, and policies on immediate link terminations.',
      '/sitemap': 'Navigate the public directory sitemap of Mini-Links to easily browse core platform features, product pricing, trust guidelines, and legal documents.',
      '/404': 'The requested page or route could not be found on Mini-Links. Return to home or browse our sitemap.',
    };

    const keywordsMap: Record<string, string> = {
      '/': 'url shortener, shorten url, link shortener, tinyurl, custom url, branded links, qr code generator, link analytics, dynamic qr code, track link clicks',
      '/pricing': 'url shortener pricing, link management cost, custom domain short links, developer api shortener, enterprise link tracking plans',
      '/about': 'about mini links, link redirection team, url shortener safety, secure redirects infrastructure',
      '/contact': 'contact url shortener support, report link abuse, report phishing redirects, support tickets mini links',
      '/privacy-policy': 'privacy policy, cookie policy, google DART cookie opt out, gdpr compliance, ccpa data rights',
      '/terms-of-service': 'terms of service, redirect terms, spam policy, link takedown rules, limit of liability',
      '/sitemap': 'sitemap, directory, navigation map, mini links pages',
      '/404': '404 not found, mini links 404',
    };

    // Determine current title, description, keywords
    let title = titleMap[location.pathname];
    let description = descriptionMap[location.pathname];
    let keywords = keywordsMap[location.pathname];

    if (!title) {
      if (location.pathname.startsWith('/dashboard')) {
        title = 'Dashboard | Mini-Links Management';
        description = 'Manage your shortened links, monitor click counts, and view dynamic QR code metrics.';
        keywords = 'link dashboard, url management, shorten link analytics';
      } else if (location.pathname.startsWith('/links/new')) {
        title = 'Create Short Link | Mini-Links';
        description = 'Create a custom shortened link with branded domain options and access tracking.';
        keywords = 'create short link, new alias, shorten url form';
      } else if (location.pathname.startsWith('/links')) {
        title = 'My Links | Mini-Links';
        description = 'Browse and manage your created short links and dynamic QR codes.';
        keywords = 'my links, link list, url management';
      } else if (location.pathname.startsWith('/qr')) {
        title = 'QR Code Workshop | Mini-Links';
        description = 'Generate and customize dynamic SVG and PNG vector QR codes for any short link.';
        keywords = 'qr code generator, vector qr code, dynamic qr download';
      } else {
        title = 'Mini-Links | Branded Link Shortener';
        description = 'Mini-Links: Create short, user-friendly URLs, dynamic QR codes, and trace redirects.';
        keywords = 'url shortener, shorten url, link shortener, custom url';
      }
    }

    document.title = title;

    // Helper to update meta property/name tags
    const updateMeta = (selector: string, attrName: 'name' | 'property', attrVal: string, content: string) => {
      let el: HTMLMetaElement | null = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[name="keywords"]', 'name', 'keywords', keywords);

    // OpenGraph Meta Tags
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Mini-Links');
    updateMeta('meta[property="og:image"]', 'property', 'og:image', 'https://mini-links.com/og-image.png');

    // Twitter Meta Tags
    updateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', 'https://mini-links.com/og-image.png');

    // Inject Machine Entity JSON-LD Structured Data Schemas
    const injectJsonLd = (schemaId: string, schemaData: object) => {
      let script: HTMLScriptElement | null = document.getElementById(schemaId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schemaData);
    };

    // WebApplication Schema
    injectJsonLd('jsonld-webapplication', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Mini-Links',
      'url': 'https://mini-links.com',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'description': 'Enterprise-grade URL shortener, branded link management, click analytics, and dynamic vector QR code generator.',
    });

    // Organization Schema
    injectJsonLd('jsonld-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Mini-Links',
      'url': 'https://mini-links.com',
      'logo': 'https://mini-links.com/favicon.svg',
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': 'hashcode.dev@gmail.com',
        'contactType': 'customer support',
        'areaServed': 'Worldwide',
        'availableLanguage': 'English',
      },
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Prayagraj',
        'addressRegion': 'Uttar Pradesh',
        'addressCountry': 'India',
      },
    });

    // FAQPage & HowTo Schemas for home route
    if (location.pathname === '/') {
      injectJsonLd('jsonld-faqpage', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Are shortened links permanent on Mini-Links?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, links created on Mini-Links remain active indefinitely unless deleted by the owner or flagged for spam or malware policy violations.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Can I generate custom branded short links?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, Mini-Links allows users to specify custom back-half aliases and branded custom domains.',
            },
          },
          {
            '@type': 'Question',
            'name': 'How does Mini-Links handle user privacy and cookie consent?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Mini-Links strictly complies with Google Consent Mode v2, Google DART advertising disclosures, and GDPR user privacy rights.',
            },
          },
        ],
      });

      injectJsonLd('jsonld-howto', {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': 'How to Shorten a Long URL with Mini-Links',
        'step': [
          {
            '@type': 'HowToStep',
            'name': 'Paste Long URL',
            'text': 'Enter your destination web address into the primary input box on the homepage.',
          },
          {
            '@type': 'HowToStep',
            'name': 'Specify Custom Alias',
            'text': 'Optionally enter a custom branded alias to make your short link memorable.',
          },
          {
            '@type': 'HowToStep',
            'name': 'Generate Short Link and QR Code',
            'text': 'Click Shorten Link to receive your shortened URL and instant vector QR code download.',
          },
        ],
      });
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
          <Route path="404" element={<NotFound />} />

          {/* Secured User Workspace Routes */}
          <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="links" element={<RequireAuth><Links /></RequireAuth>} />
          <Route path="links/new" element={<RequireAuth><CreateLink /></RequireAuth>} />
          <Route path="links/:id" element={<RequireAuth><LinkAnalytics /></RequireAuth>} />
          <Route path="qr" element={<RequireAuth><QRCode /></RequireAuth>} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
