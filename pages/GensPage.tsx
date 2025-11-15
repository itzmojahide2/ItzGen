import React, { useState } from 'react';
import GlassCard from './ui/GlassCard';
import ImageGenerator from '../components/generation/ImageGenerator';
import ThumbnailGenerator from '../components/generation/ThumbnailGenerator';
import SwitchGenerator from '../components/generation/SwitchGenerator';

type Tab = 'image' | 'thumbnail' | 'switch';

const GensPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('image');

  const renderContent = () => {
    switch (activeTab) {
      case 'image':
        return <ImageGenerator />;
      case 'thumbnail':
        return <ThumbnailGenerator />;
      case 'switch':
        return <SwitchGenerator />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-white/10 text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-8">Generation Studio</h1>
      <GlassCard>
        <div className="mb-6 flex justify-center space-x-2 border-b border-white/10 pb-4">
          <TabButton tabName="image" label="Image Generator" />
          <TabButton tabName="thumbnail" label="Thumbnail Generator" />
          <TabButton tabName="switch" label="Switch Generator" />
        </div>
        <div>{renderContent()}</div>
      </GlassCard>
    </div>
  );
};

export default GensPage;