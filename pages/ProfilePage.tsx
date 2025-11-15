import React, { useState } from 'react';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { usePlan } from '../hooks/usePlan';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { Generation } from '../types';

const NotLoggedInProfile: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto max-w-md text-center">
             <h1 className="text-4xl font-bold text-center mb-8">Profile</h1>
            <GlassCard>
                <h2 className="text-2xl font-semibold mb-2">Join ItzGen</h2>
                <p className="text-gray-400 mb-6">Login or create an account to view your profile, manage your plan, and see your generations.</p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                    Login / Sign Up
                </Button>
            </GlassCard>
        </div>
    );
};

const ProfilePage: React.FC = () => {
  const { isLoggedIn, user, logout, updateUserName, changePassword } = useAuth();
  const { generations, currentPlan, usage, resetUsage } = usePlan();
  const navigate = useNavigate();

  // State for name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [nameUpdateMessage, setNameUpdateMessage] = useState('');

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });


  if (!isLoggedIn) {
    return <NotLoggedInProfile />;
  }

  const handleNameSave = () => {
    if (newName.trim() && newName !== user?.name) {
      updateUserName(newName.trim());
      setNameUpdateMessage('Name updated successfully!');
      setTimeout(() => setNameUpdateMessage(''), 3000);
    }
    setIsEditingName(false);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
        setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
        return;
    }
    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordMessage({ type: 'success', text: result.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 4000);
    } else {
      setPasswordMessage({ type: 'error', text: result.message });
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/auth');
  }

  const handleDownload = (gen: Generation) => {
    const link = document.createElement('a');
    link.href = gen.imageUrl;
    const extension = gen.imageUrl.startsWith('data:image/jpeg') ? 'jpg' : 'png';
    const safePrompt = gen.prompt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    link.download = `itzgen_${gen.type.toLowerCase()}_${safePrompt}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-8">Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
            <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 text-white">Account Details</h2>
                <div className="space-y-4 text-gray-300">
                     <div className="flex items-center justify-between gap-2">
                        <div className="flex-grow">
                            <label className="text-sm font-medium">Name</label>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    aria-label="Edit name"
                                />
                            ) : (
                                <p className="font-semibold text-white">{user?.name}</p>
                            )}
                             {nameUpdateMessage && <p className="text-green-400 text-xs mt-1">{nameUpdateMessage}</p>}
                        </div>
                        <div className="flex items-center flex-shrink-0 self-start pt-6">
                            {isEditingName ? (
                                <>
                                    <button onClick={handleNameSave} className="p-2 text-green-400 hover:text-green-300 transition-colors" title="Save name">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button onClick={() => setIsEditingName(false)} className="p-2 text-red-400 hover:text-red-300 transition-colors" title="Cancel edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => { setIsEditingName(true); setNewName(user?.name || ''); setNameUpdateMessage(''); }} className="p-2 text-gray-400 hover:text-white transition-colors" title="Edit name">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="font-semibold text-white">{user?.email}</p>
                    </div>
                </div>
                 <Button onClick={handleLogout} variant="secondary" className="w-full mt-6 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300">
                    Logout
                 </Button>
            </GlassCard>
            
            <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 text-white">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        required
                    />
                     <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        required
                    />
                     <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        required
                    />
                    {passwordMessage.text && (
                        <p className={`text-sm text-center ${passwordMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {passwordMessage.text}
                        </p>
                    )}
                    <Button type="submit" className="w-full">Update Password</Button>
                </form>
            </GlassCard>

            <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 text-white">Plan Status</h2>
                <div className="space-y-2">
                    <p className="text-xl font-bold text-indigo-400">{currentPlan?.name}</p>
                    <p className="text-gray-400">{currentPlan?.description}</p>
                    <div className="pt-4 space-y-2 text-sm">
                        <p>Images: {usage.image} / {currentPlan?.limits.image ?? 'N/A'}</p>
                        <p>Thumbnails: {usage.thumbnail} / {currentPlan?.limits.thumbnail ?? 'N/A'}</p>
                        <p>Switches: {usage.switch} / {currentPlan?.limits.switch ?? 'N/A'}</p>
                    </div>
                    <Button onClick={() => resetUsage()} variant="secondary" className="w-full mt-2 text-xs py-2">Reset Usage (Debug)</Button>
                </div>
                <Button onClick={() => navigate('/plans')} className="w-full mt-6">Upgrade Plan</Button>
            </GlassCard>
        </div>
        <div className="md:col-span-2">
            <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 text-white">My Generations</h2>
                {generations.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                        {generations.map(gen => (
                            <div key={gen.id} className="group relative">
                                <img src={gen.imageUrl} alt={gen.prompt} className="rounded-lg w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-xs flex flex-col justify-end">
                                    <button onClick={() => handleDownload(gen)} className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                                        <span className="sr-only">Download Image</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                    <div>
                                        <p className="font-bold">{gen.type}</p>
                                        <p className="truncate">{gen.prompt}</p>
                                        <p className="text-gray-400">{gen.timestamp.toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-10">You haven't generated anything yet. Go to the Gens page to start creating!</p>
                )}
            </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
