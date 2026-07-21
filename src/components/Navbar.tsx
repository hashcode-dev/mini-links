import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Menu,
  X,
  Pencil,
  Link2,
  QrCode,
  ListChecks,
  Target,
  Code2,
  Bell,
} from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { clearAuthSession, isAuthenticated } from '../lib/auth';
import Logo from './Logo';

interface NavbarProps {
  isPublicPage: boolean;
}

export default function Navbar({ isPublicPage }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [featuresModalStyle, setFeaturesModalStyle] = useState({ left: 16, top: 72, width: 980 });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const featuresTriggerRef = useRef<HTMLDivElement>(null);
  const featuresModalRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const featureItems = [
    {
      title: 'Link Editor',
      description: 'Keep all your links dynamic, and extend their value in the long run',
      icon: Pencil,
    },
    {
      title: 'Branded Links',
      description: 'Turn heads and hold attention with fully custom short links',
      icon: Link2,
    },
    {
      title: 'QR Code Generator',
      description: "Elevate your customer's experiences with dynamic, scannable codes",
      icon: QrCode,
    },
    {
      title: 'Link Management',
      description: 'Organize as many links as you need with our powerful, intuitive platform',
      icon: ListChecks,
    },
    {
      title: 'Short URL Tracking',
      description: 'Measure the success of your efforts and make smarter, data-driven choices',
      icon: Target,
    },
    {
      title: 'Short URL API',
      description: 'Build powerful apps and automations with our link shortening API',
      icon: Code2,
    },
  ];

  const updateFeaturesModalPosition = () => {
    const triggerRect = featuresTriggerRef.current?.getBoundingClientRect();
    if (!triggerRect) {
      return;
    }

    const horizontalPadding = 16;
    const desiredWidth = 980;
    const maxWidth = Math.max(320, window.innerWidth - horizontalPadding * 2);
    const width = Math.min(desiredWidth, maxWidth);
    const preferredLeft = triggerRect.left + triggerRect.width / 2 - width / 2;
    const minLeft = horizontalPadding;
    const maxLeft = window.innerWidth - width - horizontalPadding;
    const left = Math.min(Math.max(preferredLeft, minLeft), Math.max(minLeft, maxLeft));

    setFeaturesModalStyle({
      left,
      top: triggerRect.bottom + 8,
      width,
    });
  };

  const handleOpenFeaturesModal = () => {
    updateFeaturesModalPosition();
    setIsFeaturesModalOpen(true);
  };

  const handleCloseFeaturesModal = () => {
    setIsFeaturesModalOpen(false);
  };

  const isNavLinkActive = (path: string) => {
    const [linkPath, linkHash] = path.split('#');
    const normalizedPath = linkPath || '/';

    if (linkHash) {
      return location.pathname === normalizedPath && location.hash === `#${linkHash}`;
    }

    if (!isPublicPage) {
      if (normalizedPath === '/links') {
        return location.pathname === '/links' || location.pathname === '/links/new';
      }

      if (normalizedPath === '/links/1') {
        return /^\/links\/[^/]+$/.test(location.pathname) && location.pathname !== '/links/new';
      }
    }

    return location.pathname === normalizedPath;
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDropdownOpen && !isMobileMenuOpen) {
        return;
      }

      if (profileMenuRef.current?.contains(event.target as Node)) {
        return;
      }

      if (mobileMenuRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsFeaturesModalOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isFeaturesModalOpen) {
      return;
    }

    const handleWindowChange = () => {
      updateFeaturesModalPosition();
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (featuresTriggerRef.current?.contains(event.target as Node)) {
        return;
      }

      if (featuresModalRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsFeaturesModalOpen(false);
    };

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isFeaturesModalOpen]);

  const handleLogout = () => {
    clearAuthSession();
    setIsDropdownOpen(false);
    navigate('/auth');
  };

  const navLinks = isPublicPage
    ? [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms-of-service' },
        { name: 'Contact Support', path: '/contact' },
        { name: 'Pricing Plan', path: '/pricing' },
        { name: 'Features', path: '/#features' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Links', path: '/links' },
        { name: 'Analytics', path: '/links/1' },
      ];

  const isUserAuthenticated = isAuthenticated();
  const isOnHomePage = location.pathname === '/';

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center justify-start">
        <Logo className={clsx(!isPublicPage && "md:hidden")} />
      </div>

      {/* Center Nav for Public Pages */}
      {isPublicPage && (
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(link.path);

            if (link.name === 'Features') {
              return (
                <div
                  key={link.name}
                  ref={featuresTriggerRef}
                  className="relative"
                  onMouseEnter={handleOpenFeaturesModal}
                  onMouseLeave={handleCloseFeaturesModal}
                >
                  <span
                    className={clsx(
                      "px-3 py-2 rounded-xl transition-colors cursor-pointer select-none font-medium",
                      isActive
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {link.name}
                  </span>

                  {isFeaturesModalOpen && (
                    <div
                      ref={featuresModalRef}
                      className="fixed z-40 pt-2"
                      style={{
                        left: `${featuresModalStyle.left}px`,
                        top: `${featuresModalStyle.top}px`,
                        width: `${featuresModalStyle.width}px`,
                      }}
                      onMouseEnter={handleOpenFeaturesModal}
                      onMouseLeave={handleCloseFeaturesModal}
                    >
                      <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md card-shadow p-6 transition-all duration-300">
                        <div className="grid grid-cols-3 gap-4">
                          {featureItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.title}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                              >
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <Icon size={18} />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "px-3 py-2 rounded-xl transition-colors font-medium",
                  isActive
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* App Workspace Header Actions (Search & User Profile) */}
      {!isPublicPage && (
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search links, clients, reports..."
            className="w-full min-h-[40px] pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
            aria-label="Global search"
          />
        </div>
      )}

      {/* Right Column Actions */}
      <div className="flex items-center space-x-3">
        {!isPublicPage && (
          <button
            type="button"
            className="p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
        )}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="User Profile"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
              <User size={18} />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              {isUserAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">User Workspace</p>
                    <p className="text-[11px] text-slate-400 truncate">user@minilinks.com</p>
                  </div>
                  {isOnHomePage && (
                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/pricing" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Billing & Plan
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 absolute top-full left-0 right-0 z-40 shadow-xl"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "px-4 py-2.5 text-sm font-medium rounded-xl transition-colors block min-h-[44px] flex items-center",
                    isActive
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
