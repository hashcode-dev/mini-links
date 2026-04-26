import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Link as LinkIcon,
  Pencil,
  Link2,
  QrCode,
  ListChecks,
  Target,
  Code2,
} from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { clearAuthSession, isAuthenticated } from '../lib/auth';

interface NavbarProps {
  isPublicPage: boolean;
}

export default function Navbar({ isPublicPage }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [featuresModalStyle, setFeaturesModalStyle] = useState({ left: 16, top: 72, width: 980 });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const featuresTriggerRef = useRef<HTMLDivElement>(null);
  const featuresModalRef = useRef<HTMLDivElement>(null);

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
      description: "Elevate your customer\'s experiences with dynamic, scannable codes",
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
      if (!isDropdownOpen) {
        return;
      }

      if (profileMenuRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsDropdownOpen(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsFeaturesModalOpen(false);
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
        { name: 'Pricing', path: '/pricing' },
        { name: 'Features', path: '/#features' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Links', path: '/links' },
        { name: 'Analytics', path: '/links/1' },
      ];
  const isUserAuthenticated = isAuthenticated();

  return (
    <header className="sticky top-0 z-30 glass-panel flex justify-between items-center w-full px-6 py-4 border-b border-surface-container-high dark:border-navy shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className={clsx("flex items-center gap-2 text-xl font-bold tracking-tight font-display", !isPublicPage && "md:hidden")}>
          <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <LinkIcon size={16} className="text-white" />
          </span>
          <span className="text-navy dark:text-white">Mini Links</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 text-sm font-display font-medium">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(link.path);

            if (isPublicPage && link.name === 'Features') {
              return (
                <div
                  key={link.name}
                  ref={featuresTriggerRef}
                  className="relative"
                  onMouseEnter={handleOpenFeaturesModal}
                  onMouseLeave={handleCloseFeaturesModal}
                >
                  <Link
                    to={link.path}
                    onFocus={handleOpenFeaturesModal}
                    aria-haspopup="true"
                    className={clsx(
                      "transition-colors pb-1",
                      isActive
                        ? "text-primary dark:text-teal-400 border-b-2 border-primary dark:border-teal-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-teal-400"
                    )}
                  >
                    {link.name}
                  </Link>

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
                      <div className="w-full rounded-xl border border-surface-container-high dark:border-slate-700 bg-surface-container-lowest dark:bg-navy-light shadow-xl p-8">
                        <div className="grid grid-cols-3 gap-x-8 gap-y-7">
                          {featureItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div key={item.title} className="space-y-1.5">
                                <div className="flex items-center gap-2 text-navy dark:text-white">
                                  <Icon size={15} className="text-slate-700 dark:text-slate-300" />
                                  <h3 className="text-[30px] font-semibold leading-7">{item.title}</h3>
                                </div>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-6 pl-6">{item.description}</p>
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
                  "transition-colors pb-1",
                  isActive 
                    ? "text-primary dark:text-teal-400 border-b-2 border-primary dark:border-teal-400 font-semibold" 
                    : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-teal-400"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {!isPublicPage && (
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-surface-container-low dark:bg-navy border border-surface-container-high dark:border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-sm w-48 focus:w-64 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white"
            />
          </div>
        )}


        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-full overflow-hidden bg-primary/15 dark:bg-teal-900/40 border-2 border-primary/30 dark:border-teal-600/40 flex items-center justify-center text-primary dark:text-teal-400"
          >
            <User size={18} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-navy-light rounded-lg shadow-lg border border-surface-container-high dark:border-slate-700 py-1 z-50">
              {isUserAuthenticated ? (
                <>
                  <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy">Profile</Link>
                  <Link to="/pricing" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy">Billing</Link>
                  <div className="border-t border-surface-container-high dark:border-slate-700 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-primary dark:text-teal-400 hover:bg-surface-container-low dark:hover:bg-navy"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
