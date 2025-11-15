
import React, { useState, useRef } from 'react';
import Button from '../../pages/ui/Button';
import { generateImage, ImageQuality } from '../../services/geminiService';
import { usePlan } from '../../hooks/usePlan';
import { GeneratorType } from '../../types';
import { useAuth } from '../../hooks/useAuth';

type AspectRatio = '16:9' | '1:1' | '9:16';

const ThumbnailGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [quality, setQuality] = useState<ImageQuality>('Standard');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { canGenerate, addGeneration, currentPlan, usage } = usePlan();
  const { isLoggedIn } = useAuth();

  const limit = currentPlan?.limits.thumbnail;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setReferenceImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveReference = () => {
      setReferenceImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      setError('You are not logged in. Please login or sign up to generate thumbnails.');
      return;
    }
    if (!canGenerate(GeneratorType.Thumbnail)) {
      setError('You have reached your daily limit for thumbnail generation.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImage(prompt, 'Vibrant and eye-catching', aspectRatio, quality, referenceImage);
      setGeneratedImage(imageUrl);
      addGeneration({ type: 'Thumbnail', prompt, imageUrl });
    } catch (err) {
      setError('Failed to generate thumbnail. Please try again.');
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
    link.download = `itzgen_thumbnail_${safePrompt}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {isLoggedIn && (
        <div className="text-right text-sm text-gray-400">
            Daily Limit: {usage.thumbnail} / {limit === 'unlimited' ? '∞' : limit}
        </div>
       )}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A shocked face reacting to an exploding laptop, hyper-realistic..."
          className="w-full p-4 pr-12 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all h-28 resize-none"
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            aria-label="Attach reference image"
            title="Attach reference image"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
        </button>
      </div>

      {previewUrl && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
              <img src={previewUrl} alt="Reference preview" className="w-full h-full object-cover" />
              <button 
                  onClick={handleRemoveReference} 
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-opacity"
                  aria-label="Remove reference image"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Size Presets</label>
           <div className="flex flex-wrap gap-2">
            {(['16:9', '1:1', '9:16'] as AspectRatio[]).map(r => (
              <button key={r} onClick={() => setAspectRatio(r)} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${aspectRatio === r ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                {r}
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
      <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt || (isLoggedIn && !canGenerate(GeneratorType.Thumbnail))} className="w-full">
        Generate Thumbnail
      </Button>
      {error && <p className="text-red-400 text-center">{error}</p>}
      {generatedImage && (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-center">Result</h3>
            <div className="relative group mx-auto max-w-full md:max-w-md">
                <img src={generatedImage} alt="Generated thumbnail" className="rounded-lg w-full" />
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

export default ThumbnailGenerator;