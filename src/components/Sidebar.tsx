import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Link as LinkIcon, QrCode, BarChart3, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Links', path: '/links', icon: LinkIcon },
    { name: 'QR Codes', path: '/qr', icon: QrCode },
    { name: 'Analytics', path: '/links/1', icon: BarChart3 }, // Example link for analytics
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-surface-container-low dark:bg-navy-light border-r border-surface-container-high dark:border-navy p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <LinkIcon size={20} />
        </div>
        <div>
          <h1 className="text-lg font-black text-primary dark:text-teal-400 font-display leading-none">LinkPrecision</h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mt-1">Editorial Analytics</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/links' || location.pathname === '/links');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-surface-container-lowest dark:bg-navy text-primary dark:text-teal-400 font-semibold shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-navy hover:text-primary dark:hover:text-teal-400 hover:translate-x-1"
              )}
            >
              <Icon size={18} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 space-y-1">
        <button className="w-full mb-6 py-3 bg-cta hover:bg-cta-dark text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95">
          <Plus size={18} />
          <span>Create Link</span>
        </button>
        
        <div className="px-3 py-2 text-slate-500 dark:text-slate-400 flex items-center gap-3 hover:bg-surface-container-high dark:hover:bg-navy rounded-lg cursor-pointer transition-all">
          <HelpCircle size={18} />
          <span className="text-sm">Support</span>
        </div>
        <div className="px-3 py-2 text-slate-500 dark:text-slate-400 flex items-center gap-3 hover:bg-surface-container-high dark:hover:bg-navy rounded-lg cursor-pointer transition-all">
          <LogOut size={18} />
          <span className="text-sm">Log Out</span>
        </div>
      </div>
    </aside>
  );
}
