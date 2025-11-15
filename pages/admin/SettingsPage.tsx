

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { SiteSettings } from '../../types';

const SettingsPage: React.FC = () => {
    const { settings, updateSettings, plans } = useAdmin();
    const [localSettings, setLocalSettings] = useState(settings);
    const [toast, setToast] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        updateSettings(localSettings);
        setToast('Settings saved!');
        setTimeout(() => setToast(''), 3000);
    }
    
    const handleGeneralChange = (field: keyof SiteSettings, value: any) => {
        setLocalSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    const handleGlowChange = (field: keyof SiteSettings['planGlow'], value: any) => {
        setLocalSettings(prev => ({
            ...prev,
            planGlow: {
                ...prev.planGlow,
                [field]: value
            }
        }));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Site Settings</h1>
            
            <GlassCard className="mb-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-2 text-white">General Settings</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Site Name</label>
                        <input type="text" value={localSettings.name} onChange={e => handleGeneralChange('name', e.target.value)} className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-white"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Contact Email</label>
                        <input type="email" value={localSettings.contactEmail} onChange={e => handleGeneralChange('contactEmail', e.target.value)} className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-white"/>
                    </div>
                </div>
            </GlassCard>

            <GlassCard>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 text-white">Plan Glow Settings</h2>
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-200">Enable Glow</label>
                        <button onClick={() => handleGlowChange('enabled', !localSettings.planGlow.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${localSettings.planGlow.enabled ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${localSettings.planGlow.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {localSettings.planGlow.enabled && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Featured Plan</label>
                                <select value={localSettings.planGlow.planId} onChange={e => handleGlowChange('planId', e.target.value)} className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-white">
                                    <option value="">Select a plan to highlight</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-200">Glow Color</label>
                                <input type="color" value={localSettings.planGlow.color} onChange={e => handleGlowChange('color', e.target.value)} className="w-12 h-8 p-1 bg-transparent border-none rounded-lg cursor-pointer"/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Glow Opacity: {localSettings.planGlow.opacity}%</label>
                                <input type="range" min="0" max="100" value={localSettings.planGlow.opacity} onChange={e => handleGlowChange('opacity', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </>
                    )}
                </div>
            </GlassCard>
            
            <div className="mt-6 flex items-center gap-4">
                <Button onClick={handleSave}>Save Settings</Button>
                {toast && <p className="text-green-400 text-sm animate-pulse">{toast}</p>}
            </div>
        </div>
    );
}

export default SettingsPage;