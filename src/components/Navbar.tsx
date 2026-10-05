import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Menu,
  X,
  Pencil,
  Link2,
  QrCode,
  ListChecks,
  Target,
  Code2,
  Plus,
  HelpCircle,
  LogOut,
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
      description: 'Elevate your customer’s experiences with dynamic, scannable codes',
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
        { name: 'Features', path: '/#features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Links', path: '/links' },
        { name: 'QR Codes', path: '/qr' },
      ];
  const isUserAuthenticated = isAuthenticated();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-50">
      {/* Left Column: Brand Logo */}
      <div className="flex items-center justify-start">
        <Logo className={clsx(!isPublicPage && "md:hidden")} />
      </div>

      {/* Center Column: Navigation links - Desktop (public pages only) */}
      {isPublicPage && (
        <nav className="hidden lg:flex flex-initial items-center justify-center space-x-6 text-sm font-medium">
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
                      "px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none",
                      isActive
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                      <div className="w-full rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl p-6 transition-all duration-300">
                        <div className="grid grid-cols-3 gap-4">
                          {featureItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.title}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-200"
                              >
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <Icon size={18} />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">
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
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right Column: Actions */}
      <div className="flex items-center justify-end gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-full overflow-hidden bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="User menu"
          >
            <User size={18} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              {isUserAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Dashboard</Link>
                  <Link to="/links" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">My Links</Link>
                  <Link to="/qr" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">QR Codes</Link>
                  <Link to="/pricing" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Pricing Plans</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 absolute top-full left-0 right-0 z-40 shadow-lg"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link.path);

              if (isPublicPage && link.name === 'Features') {
                return (
                  <div key={link.name} className="space-y-2">
                    <div className={clsx(
                      "px-3 py-2 text-sm font-semibold rounded-lg transition-colors",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700"
                    )}>
                      {link.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {featureItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.title}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center shrink-0">
                              <Icon size={14} />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-semibold text-slate-900">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors block",
                    isActive
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}

            {!isPublicPage && (
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/links/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus size={15} />
                  <span>Create Link</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <HelpCircle size={16} />
                  <span>Contact Support</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

