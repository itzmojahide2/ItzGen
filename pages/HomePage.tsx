
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <GlassCard className="text-center">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-white">{title}</h3>
    <p className="mt-2 text-base text-gray-400">{description}</p>
  </GlassCard>
);

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
  return (
    <div className="container mx-auto text-center py-16">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
        Welcome to ItzGen
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
        Your ultimate AI-powered generation platform. Create custom visuals, clickable thumbnails, and transform images with our state-of-the-art tools.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={() => navigate(isLoggedIn ? '/gens' : '/auth')}>Start Generating</Button>
        <Button variant="secondary" onClick={() => navigate(isLoggedIn ? '/plans' : '/auth')}>Explore Plans</Button>
      </div>
      <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            title="Image Generator"
            description="Create stunning, custom visuals from simple text prompts."
        />
        <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
            title="Thumbnail Generator"
            description="Produce clickable thumbnails perfect for social media and video content."
        />
        <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M5 9a7 7 0 117 7" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-5h-5M19 15a7 7 0 11-7-7" /></svg>}
            title="Switch Generator"
            description="Transform or merge two images using AI for face, style, or background switches."
        />
      </div>
    </div>
  );
};

export default HomePage;
