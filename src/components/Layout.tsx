import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const publicPaths = ['/', '/pricing', '/about', '/contact', '/privacy-policy', '/terms-of-service', '/sitemap'];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf8ff] text-slate-900 transition-colors duration-200">
      {!isPublicPage && <Sidebar />}
      
      <div className={`flex-1 flex flex-col min-w-0 ${!isPublicPage ? 'md:ml-64' : ''}`}>
        <Navbar isPublicPage={isPublicPage} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        {isPublicPage && <Footer />}
      </div>
    </div>
  );
}

