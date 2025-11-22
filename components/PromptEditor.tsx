import React, { useState } from 'react';
import { Era, EraConfig } from '../types';
import { ERA_CONFIGS } from '../constants';
import Timeline from './Timeline';
import { motion } from 'framer-motion';
import { Sparkles, Edit3 } from 'lucide-react';

interface Props {
  prompts: Record<Era, string>;
  onPromptChange: (era: Era, newPrompt: string) => void;
  onGenerate: () => void;
}

const PromptEditor: React.FC<Props> = ({ prompts, onPromptChange, onGenerate }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Start at 1930 by default
  const eras = Object.values(Era) as Era[];

  return (
    <div className="w-full mx-auto space-y-8 pb-12 overflow-hidden">
      <div className="text-center space-y-2 px-4">
        <h2 className="text-2xl font-serif-sc font-bold text-gray-800">定制您的人生剧本</h2>
        <p className="text-gray-500 text-sm">左右拖动时间轴选择年代，微调下方剧本</p>
      </div>

      <Timeline 
        eras={eras}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        renderItem={(era, isActive) => {
          const config = ERA_CONFIGS[era];
          return (
            <div 
              className={`rounded-2xl border bg-white shadow-sm overflow-hidden h-[400px] flex flex-col transition-all duration-300 ${isActive ? 'shadow-xl border-red-200 ring-2 ring-red-50' : 'border-gray-200'}`}
            >
              {/* Header */}
              <div className={`h-2 bg-gradient-to-r ${config.bgGradient}`} />
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between mb-1">
                   <span className={`text-2xl font-serif-sc font-bold ${config.color}`}>{config.name}</span>
                   <span className="text-4xl font-black text-gray-100 absolute top-4 right-4 pointer-events-none">{config.year}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 relative z-10">{config.description}</p>

                <div className="relative flex-1 flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                    Prompt (English)
                  </label>
                  <textarea
                    value={prompts[config.id]}
                    onChange={(e) => onPromptChange(config.id, e.target.value)}
                    className="flex-1 w-full p-3 text-xs text-gray-700 border border-gray-200 rounded-lg focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none resize-none leading-relaxed bg-gray-50/50"
                    spellCheck={false}
                    disabled={!isActive} // Disable editing if not active to prevent scroll conflict
                  />
                  {isActive && (
                    <Edit3 className="absolute bottom-3 right-3 w-3 h-3 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
          );
        }}
      />

      <div className="flex justify-center pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGenerate}
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-red-600 text-white rounded-full text-lg font-bold shadow-xl shadow-red-200 overflow-hidden z-10"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Sparkles className="w-5 h-5" />
          <span>穿越时空 (Generate All)</span>
        </motion.button>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PromptEditor;