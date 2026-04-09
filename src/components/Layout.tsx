import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/pricing';
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface dark:bg-navy text-navy dark:text-surface transition-colors duration-200">
      {!isPublicPage && <Sidebar />}
      
      <div className={`flex-1 flex flex-col min-w-0 ${!isPublicPage ? 'md:ml-64' : ''}`}>
        <Navbar isPublicPage={isPublicPage} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
