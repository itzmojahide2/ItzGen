
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'text-white bg-white/10'
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileNavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors rounded-lg ${
        isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="text-xs mt-1">{children}</span>
  </NavLink>
);


const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="url(#paint0_linear_1_2)"/>
        <defs>
        <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5"/>
        <stop offset="1" stopColor="#A259FF"/>
        </linearGradient>
        </defs>
    </svg>
);


const Navbar: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-black/20 backdrop-blur-md sticky top-4 mx-4 md:mx-auto md:max-w-4xl rounded-xl z-50 border border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <NavLink to="/" className="flex items-center space-x-2">
                   <Logo />
                   <span className="font-bold text-xl text-white">ItzGen</span>
                 </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex items-baseline space-x-4">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/gens">Gens</NavItem>
                <NavItem to="/profile">Profile</NavItem>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                 <button 
                    onClick={() => navigate('/plans')}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                >
                    {isLoggedIn && user ? `${user.plan} Plan` : 'Upgrade Now'}
                </button>
                 {!isLoggedIn && (
                  <button 
                    onClick={() => navigate('/auth')} 
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="flex justify-around items-center px-2 py-1">
          <MobileNavItem to="/" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>
            Home
          </MobileNavItem>
          <MobileNavItem to="/gens" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}>
            Gens
          </MobileNavItem>
          <MobileNavItem to="/profile" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
            Profile
          </MobileNavItem>
        </div>
      </div>
    </>
  );
};

export default Navbar;
