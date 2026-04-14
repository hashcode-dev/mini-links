import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/pricing';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface dark:bg-navy text-navy dark:text-surface transition-colors duration-200">
      {!isPublicPage && <Sidebar />}
      
      <div className={`flex-1 flex flex-col min-w-0 ${!isPublicPage ? 'md:ml-64' : ''}`}>
        <Navbar isPublicPage={isPublicPage} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
