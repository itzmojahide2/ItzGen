

import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import GlassCard from './ui/GlassCard';

// #region Helper Components
const Sidebar: React.FC<{ closeSidebar: () => void }> = ({ closeSidebar }) => {
    const { logout } = useAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        closeSidebar();
        logout();
        navigate('/auth');
    }

    const navItems = [
        { path: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { path: 'users', label: 'Users', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 12a4 4 0 110-8 4 4 0 010 8z" /></svg> },
        { path: 'payments', label: 'Payments', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
        { path: 'plans', label: 'Plans', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
        { path: 'gateways', label: 'Gateways', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
        { path: 'admins', label: 'Admins', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
        { path: 'settings', label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];

    const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
        return (
            <NavLink
                to={to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`
                }
            >
                {children}
            </NavLink>
        );
    };

    return (
        <GlassCard className="h-full p-4 flex flex-col">
            <div className="flex items-center justify-between space-x-2 mb-8 px-2">
                 <div className="flex items-center space-x-2">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="url(#paint0_linear_1_2)"/><defs><linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#4F46E5"/><stop offset="1" stopColor="#A259FF"/></linearGradient></defs></svg>
                    <span className="font-bold text-lg text-white">ItzGen Admin</span>
                </div>
                 <button onClick={closeSidebar} className="md:hidden p-1 text-gray-400 hover:text-white" aria-label="Close sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <nav className="space-y-2 flex-grow">
                {navItems.map(item => (
                    <NavItem key={item.path} to={item.path}>
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </NavItem>
                ))}
            </nav>
            <div className="mt-auto">
                <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </GlassCard>
    );
};
// #endregion

// Main Admin Layout
const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="relative flex h-screen bg-black text-white -my-8 -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
             <div className={`fixed inset-y-0 left-0 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 ${ isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
                 <header className="sticky top-0 bg-black/50 backdrop-blur-sm z-20 md:hidden flex items-center p-4 border-b border-white/10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-300 hover:text-white mr-4"
                        aria-label="Open sidebar"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-2">
                         <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="url(#paint0_linear_1_3)"/><defs><linearGradient id="paint0_linear_1_3" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#4F46E5"/><stop offset="1" stopColor="#A259FF"/></linearGradient></defs></svg>
                        <span className="font-bold text-lg text-white">Admin Panel</span>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                     <Outlet />
                </main>
            </div>
        </div>
    );
}

// Router for the whole Admin section
const AdminPage: React.FC = () => {
    const { isLoggedIn } = useAdmin();
    
    if (!isLoggedIn) {
        return <Navigate to="/auth" replace />;
    }

    return <AdminLayout />;
}

export default AdminPage;
