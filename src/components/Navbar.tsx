import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Search, User } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { clearAuthSession } from '../lib/auth';

interface NavbarProps {
  isPublicPage: boolean;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export default function Navbar({ isPublicPage, toggleDarkMode, isDarkMode }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    setIsDropdownOpen(false);
    navigate('/auth');
  };

  const navLinks = isPublicPage 
    ? [
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Links', path: '/links' },
        { name: 'Analytics', path: '/links/1' },
      ];

  return (
    <header className="sticky top-0 z-30 glass-panel flex justify-between items-center w-full px-6 py-4 border-b border-surface-container-high dark:border-navy shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className={clsx("text-xl font-bold tracking-tight font-display", !isPublicPage && "md:hidden")}>
          Mini Links
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 text-sm font-display font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
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

        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high dark:bg-slate-700 border border-surface-container-low dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300"
          >
            <User size={18} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-navy-light rounded-lg shadow-lg border border-surface-container-high dark:border-slate-700 py-1 z-50">
              <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy">Dashboard</Link>
              <Link to="/links" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy">My Links</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy">Settings</Link>
              <Link to="/pricing" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-navy">Billing</Link>
              <div className="border-t border-surface-container-high dark:border-slate-700 my-1"></div>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
