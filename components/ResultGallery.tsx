import React, { useState } from 'react';
import { Era, GeneratedResult } from '../types';
import { ERA_CONFIGS } from '../constants';
import Timeline from './Timeline';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  results: Record<Era, GeneratedResult>;
  onReRoll: (era: Era) => void;
  onReset: () => void;
}

const ResultGallery: React.FC<Props> = ({ results, onReRoll, onReset }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const eras = Object.values(Era) as Era[];

  const handleDownload = (url: string | null, name: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `Shanghai_${name}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full mx-auto space-y-8 pb-20 overflow-hidden">
      <div className="text-center space-y-4 px-4">
        <h2 className="text-3xl font-serif-sc font-bold text-gray-800">您的上海人生分支</h2>
        <div className="flex justify-center gap-4 text-sm">
          <p className="text-gray-500">左右滑动查看不同时代</p>
          <span className="text-gray-300">|</span>
          <button 
            onClick={onReset}
            className="text-red-500 hover:text-red-600 hover:underline"
          >
            &larr; 重新上传
          </button>
        </div>
      </div>

      <Timeline 
        eras={eras}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        renderItem={(era, isActive) => {
          const config = ERA_CONFIGS[era];
          const result = results[era];
          
          return (
            <div className="relative group rounded-2xl overflow-hidden bg-white shadow-xl aspect-[3/4] select-none">
                {/* Background Gradient specific to Era */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-50`} />
                
                {result.loading ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 backdrop-blur-sm">
                     <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-3" />
                     <p className="text-sm text-gray-500 font-serif-sc animate-pulse">正在构建 {config.year}...</p>
                   </div>
                ) : result.error ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                     <p className="text-red-500 text-sm mb-4">{result.error}</p>
                     <button 
                       onClick={(e) => { e.stopPropagation(); onReRoll(config.id); }}
                       className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-xs font-bold hover:bg-red-200"
                     >
                       重试
                     </button>
                   </div>
                ) : result.imageUrl ? (
                  <>
                    <img 
                      src={result.imageUrl} 
                      alt={config.name} 
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    
                    {/* Overlay Actions - Only show when active or hovered */}
                    <div className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                       <button 
                         onClick={(e) => { e.stopPropagation(); onReRoll(config.id); }}
                         className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-700 hover:text-red-500 transition"
                         title="重新生成"
                       >
                         <RefreshCw className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDownload(result.imageUrl, config.id); }}
                         className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-700 hover:text-blue-500 transition"
                         title="下载"
                       >
                         <Download className="w-4 h-4" />
                       </button>
                    </div>

                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pt-16">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-lg font-serif-sc font-bold">{config.name}</h3>
                        <span className="text-xs opacity-70">{config.year}</span>
                      </div>
                      <p className="text-xs text-white/90 italic font-light leading-relaxed">
                        "{result.caption || '...'}"
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    等待生成...
                  </div>
                )}
              </div>
          );
        }}
      />
    </div>
  );
};

export default ResultGallery;