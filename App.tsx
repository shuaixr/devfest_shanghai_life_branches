import React, { useState, useCallback } from 'react';
import ApiKeyModal from './components/ApiKeyModal';
import ImageUploader from './components/ImageUploader';
import PromptEditor from './components/PromptEditor';
import ResultGallery from './components/ResultGallery';
import { AppState, Era, GeneratedResult, GeminiModel } from './types';
import { INITIAL_PROMPTS, ERA_CONFIGS } from './constants';
import { GeminiService } from './services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    apiKey: null,
    isDemoMode: false,
    selectedModel: 'gemini-2.5-flash-image',
    userImage: null,
    prompts: { ...INITIAL_PROMPTS },
    results: Object.values(Era).reduce((acc, era) => ({
      ...acc,
      [era]: { era, imageUrl: null, caption: null, loading: false, error: null }
    }), {} as Record<Era, GeneratedResult>),
    step: 'upload',
  });

  const handleApiKeySubmit = (key: string) => {
    setState(prev => ({ ...prev, apiKey: key, isDemoMode: false }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prev => ({ ...prev, selectedModel: e.target.value as GeminiModel }));
  };

  const handleImageSelect = (base64: string) => {
    if (!base64) {
       setState(prev => ({ ...prev, userImage: null }));
       return;
    }
    setState(prev => ({ ...prev, userImage: base64, step: 'edit' }));
  };

  const handlePromptChange = (era: Era, newPrompt: string) => {
    setState(prev => ({
      ...prev,
      prompts: { ...prev.prompts, [era]: newPrompt }
    }));
  };

  const generateSingleEra = async (era: Era, service: GeminiService) => {
    // Set loading
    setState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [era]: { ...prev.results[era], loading: true, error: null }
      }
    }));

    try {
      // Parallel: Image + Caption
      const [imageUrl, caption] = await Promise.all([
        service.generateImage(state.prompts[era], state.userImage!, era, state.selectedModel),
        service.generateCaption(ERA_CONFIGS[era])
      ]);

      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [era]: { ...prev.results[era], loading: false, imageUrl, caption }
        }
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [era]: { ...prev.results[era], loading: false, error: error.message || "Generation failed" }
        }
      }));
    }
  };

  const handleGenerateAll = useCallback(async () => {
    if (!state.apiKey || !state.userImage) return;
    
    setState(prev => ({ ...prev, step: 'results' }));
    const service = new GeminiService(state.apiKey);

    // Trigger all eras with a slight stagger to avoid hitting rate limits instantly
    Object.values(Era).forEach((era, index) => {
      setTimeout(() => {
        generateSingleEra(era as Era, service);
      }, index * 500);
    });
  }, [state.apiKey, state.userImage, state.prompts, state.selectedModel]);

  const handleReRoll = useCallback(async (era: Era) => {
    if (!state.apiKey || !state.userImage) return;
    const service = new GeminiService(state.apiKey);
    generateSingleEra(era, service);
  }, [state.apiKey, state.userImage, state.prompts, state.selectedModel]);

  const handleReset = () => {
     setState(prev => ({
       ...prev,
       step: 'upload',
       userImage: null,
       results: Object.values(Era).reduce((acc, era) => ({
        ...acc,
        [era]: { era, imageUrl: null, caption: null, loading: false, error: null }
      }), {} as Record<Era, GeneratedResult>),
     }));
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-slate-800 selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      {/* Api Key Modal */}
      <ApiKeyModal onSubmit={handleApiKeySubmit} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-lg font-bold font-serif-sc text-lg">沪</div>
          <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2">
            <h1 className="font-serif-sc font-bold text-lg tracking-wide">上海人生分支</h1>
            <span className="text-[10px] md:text-xs font-sans font-normal text-gray-400 uppercase tracking-wider">Life-Branches</span>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200">
          <Settings className="w-3 h-3 text-gray-400" />
          <select 
            value={state.selectedModel}
            onChange={handleModelChange}
            className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer min-w-[140px]"
            disabled={state.step === 'generating' || state.step === 'results'}
          >
            <option value="gemini-2.5-flash-image">Nano Banana (Fast)</option>
            <option value="gemini-3-pro-image-preview">Pro Image (Quality)</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-0 md:px-0 container mx-auto max-w-full">
        <AnimatePresence mode="wait">
          
          {state.step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="px-4 md:px-8 max-w-4xl mx-auto"
            >
               <ImageUploader onImageSelect={handleImageSelect} />
            </motion.div>
          )}

          {state.step === 'edit' && (
             <motion.div
               key="edit"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.5 }}
             >
               <div className="mb-8 flex items-center justify-center gap-4 px-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img src={state.userImage!} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <button onClick={handleReset} className="text-xs text-gray-400 underline hover:text-red-500">更换照片</button>
               </div>
               <PromptEditor 
                  prompts={state.prompts} 
                  onPromptChange={handlePromptChange}
                  onGenerate={handleGenerateAll}
               />
             </motion.div>
          )}

          {state.step === 'results' && (
             <motion.div
               key="results"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
             >
               <ResultGallery 
                 results={state.results} 
                 onReRoll={handleReRoll}
                 onReset={handleReset}
               />
             </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-2 text-center text-[10px] text-gray-400 bg-white/50 backdrop-blur-sm pointer-events-none z-50">
        Powered by Google Gemini API
      </footer>
    </div>
  );
};

export default App;