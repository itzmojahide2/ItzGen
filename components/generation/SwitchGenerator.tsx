
import React, { useState } from 'react';
import Button from '../../pages/ui/Button';
import ImageUpload from '../../pages/ui/ImageUpload';
import { editImageWithSwitch, ImageQuality } from '../../services/geminiService';
import { usePlan } from '../../hooks/usePlan';
import { GeneratorType, SwitchMode } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const SwitchGenerator: React.FC = () => {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [switchMode, setSwitchMode] = useState<SwitchMode>(SwitchMode.Face);
  const [quality, setQuality] = useState<ImageQuality>('Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { canGenerate, addGeneration, currentPlan, usage } = usePlan();
  const { isLoggedIn } = useAuth();

  const limit = currentPlan?.limits.switch;

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      setError('You are not logged in. Please login or sign up to use the Switch Generator.');
      return;
    }
    if (!image1 || !image2) {
      setError('Please upload both images.');
      return;
    }
    if (!canGenerate(GeneratorType.Switch)) {
      setError('You have reached your daily limit for switch generation.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const imageUrl = await editImageWithSwitch(image1, image2, prompt, switchMode, quality);
      setGeneratedImage(imageUrl);
      addGeneration({ type: 'Switch', prompt: `${switchMode}: ${prompt}`, imageUrl });
    } catch (err) {
      setError('Failed to switch images. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const safePrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    link.download = `itzgen_switch_${switchMode}_${safePrompt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
       {isLoggedIn && (
        <div className="text-right text-sm text-gray-400">
            Daily Limit: {usage.switch} / {limit === 'unlimited' ? '∞' : limit}
        </div>
       )}
      <div className="grid md:grid-cols-2 gap-4">
        <ImageUpload onFileSelect={setImage1} label="Upload Base Image" />
        <ImageUpload onFileSelect={setImage2} label="Upload User Image" />
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Optional: describe the switch (e.g., 'match lighting style')..."
        className="w-full p-4 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all h-20 resize-none"
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Switch Type</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(SwitchMode).map(mode => (
              <button key={mode} onClick={() => setSwitchMode(mode)} className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${switchMode === mode ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                {mode} Switch
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
          <div className="flex flex-wrap gap-2">
            {(['Standard', '720p', '1080p', '2K', '4K'] as ImageQuality[]).map(q => (
              <button key={q} onClick={() => setQuality(q)} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${quality === q ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
       <Button onClick={handleGenerate} isLoading={isLoading} disabled={!image1 || !image2 || (isLoggedIn && !canGenerate(GeneratorType.Switch))} className="w-full">
        Generate Switch
      </Button>
       {error && <p className="text-red-400 text-center">{error}</p>}
      {generatedImage && (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-center">Result</h3>
            <div className="relative group mx-auto max-w-full md:max-w-md">
                <img src={generatedImage} alt="Generated switch" className="rounded-lg w-full" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button onClick={handleDownload} variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SwitchGenerator;