import React, { useState } from 'react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL_ENV = 'id@itzgen.bd';
const ADMIN_PASS_ENV = 'itzgen567##**';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const { login: adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLoginView) {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }

      // Check for admin credentials
      if (email === ADMIN_EMAIL_ENV && password === ADMIN_PASS_ENV) {
        adminLogin(email, password);
        navigate('/admin');
        return;
      }

      // Mock user login
      const result = login(email, password);
      if (result.success) {
        navigate('/gens');
      } else {
        setError(result.message);
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      // Mock signup
      const result = signup(name, email, password);
      if (result.success) {
        navigate('/gens');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen -mt-20">
      <GlassCard className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-400 mb-6">
          {isLoginView ? "Sign in to continue to ItzGen" : "Get started with your free account"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
          {!isLoginView && (
             <input
             type="password"
             placeholder="Confirm Password"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
           />
          )}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full">
            {isLoginView ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">
            {isLoginView ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </GlassCard>
    </div>
  );
};

export default AuthPage;