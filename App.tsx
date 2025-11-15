
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GensPage from './pages/GensPage';
import ProfilePage from './pages/ProfilePage';
import PlanPage from './pages/PlanPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import Navbar from './pages/Navbar';
import { useAuth } from './hooks/useAuth';

// Import admin sub-pages for routing
import DashboardPage from './pages/admin/DashboardPage';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import PaymentsManagementPage from './pages/admin/PaymentsManagementPage';
import PlansManagementPage from './pages/admin/PlansManagementPage';
import AdminsManagementPage from './pages/admin/AdminsManagementPage';
import SettingsPage from './pages/admin/SettingsPage';
import GatewaysManagementPage from './pages/admin/GatewaysManagementPage';


const App: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10">
        <HashRouter>
          <AppContent />
        </HashRouter>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isAuthOrAdminPage = location.pathname === '/auth' || location.pathname.startsWith('/admin');

  return (
    <>
      {!isAuthOrAdminPage && <Navbar />}
      <main className="px-4 pt-8 pb-20 sm:px-6 lg:px-8 md:pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={isLoggedIn ? <Navigate to="/gens" /> : <AuthPage />} />
          
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="payments" element={<PaymentsManagementPage />} />
            <Route path="plans" element={<PlansManagementPage />} />
            <Route path="gateways" element={<GatewaysManagementPage />} />
            <Route path="admins" element={<AdminsManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/gens" element={<GensPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plans" element={<PlanPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;