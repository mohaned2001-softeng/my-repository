import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logo = 'https://d64gsuwffb70l.cloudfront.net/692c300d2977b5af17b3fc74_1764503896954_822c3c76.jpg';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'labs', label: 'Labs' },
    { id: 'about', label: 'About Us' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0E27]/98 shadow-lg shadow-black/20' : 'bg-[#0A0E27]/80'} backdrop-blur-md border-b border-red-900/20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => setCurrentPage('home')}>
            <img src={logo} alt="Cyber Academy" className="h-10 w-auto transition-transform group-hover:scale-105" />
            <span className="ml-3 text-white font-semibold hidden sm:block">Cyber Academy</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === item.id ? 'text-red-500 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                {item.label}
              </button>
            ))}
            {user ? (
              <>
                <button onClick={() => setCurrentPage('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 'dashboard' ? 'text-red-500 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  Dashboard
                </button>
                <div className="ml-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={signOut} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => setCurrentPage('login')} className="ml-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-red-600/20">
                Login
              </button>
            )}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0E27] border-t border-red-900/20 px-4 py-4 space-y-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setCurrentPage(item.id); setMobileOpen(false); }}
              className={`block w-full text-left px-4 py-3 rounded-lg ${currentPage === item.id ? 'bg-red-500/10 text-red-500' : 'text-gray-300'}`}>
              {item.label}
            </button>
          ))}
          {user ? (
            <>
              <button onClick={() => { setCurrentPage('dashboard'); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg text-gray-300">Dashboard</button>
              <button onClick={signOut} className="w-full mt-2 px-4 py-3 bg-red-600 text-white rounded-lg">Logout</button>
            </>
          ) : (
            <button onClick={() => { setCurrentPage('login'); setMobileOpen(false); }} className="w-full mt-2 px-4 py-3 bg-red-600 text-white rounded-lg">Login</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
