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
    { name: 'Analytics', path: '/links/1', icon: BarChart3 }, // Example link for analytics
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-slate-50 border-r border-slate-200 p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
          <LinkIcon size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-none tracking-tight">Mini Links</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Analytics Studio</p>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-white text-blue-600 font-semibold shadow-sm border border-slate-200/80" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 space-y-2">
        <Link to="/links/new" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]">
          <Plus size={18} />
          <span>Create Link</span>
        </Link>
        
        <div className="px-3 py-2 text-slate-500 flex items-center gap-3 hover:bg-slate-100 hover:text-slate-700 rounded-lg cursor-pointer transition-all text-sm font-medium">
          <HelpCircle size={18} />
          <span>Support</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-3 py-2 text-slate-500 flex items-center gap-3 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>

  );
}
