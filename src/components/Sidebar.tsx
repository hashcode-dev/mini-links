import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Link as LinkIcon, QrCode, BarChart3, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
import clsx from 'clsx';
import { clearAuthSession } from '../lib/auth';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/auth');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Links', path: '/links', icon: LinkIcon },
    { name: 'QR Codes', path: '/qr', icon: QrCode },
    { name: 'Analytics', path: '/links/1', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-[#213145] text-slate-100 border-r border-slate-700/60 p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2 pt-2">
        <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center text-white shadow-md">
          <LinkIcon size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display text-lg font-extrabold text-white leading-none tracking-tight">Mini Links</h1>
          <p className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold mt-1">Analytics Studio</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mb-6 px-1">
        <Link
          to="/links/new"
          className="w-full min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <Plus size={18} />
          <span>Create Link</span>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/links' || location.pathname === '/links');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium min-h-[44px]",
                isActive
                  ? "bg-blue-600/90 text-white font-semibold shadow-sm border border-blue-500/50"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto pt-4 space-y-2 px-1 border-t border-slate-700/50">
        <div className="px-3.5 py-2.5 text-slate-400 flex items-center gap-3 hover:bg-slate-700/40 hover:text-slate-200 rounded-xl cursor-pointer transition-all text-sm font-medium min-h-[44px]">
          <HelpCircle size={18} />
          <span>Support & Docs</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-3.5 py-2.5 text-slate-400 flex items-center gap-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl cursor-pointer transition-all text-sm font-medium min-h-[44px] text-left"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
