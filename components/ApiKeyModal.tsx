import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Unlock } from 'lucide-react';

interface Props {
  onSubmit: (key: string) => void;
}

const ApiKeyModal: React.FC<Props> = ({ onSubmit }) => {
  const [inputKey, setInputKey] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    // Ignore 'demo' key from previous sessions
    if (storedKey && storedKey !== 'demo') {
      setIsVisible(false);
      onSubmit(storedKey);
    }
  }, [onSubmit]);

  const handleSubmit = () => {
    if (!inputKey.trim()) return;
    localStorage.setItem('gemini_api_key', inputKey);
    setIsVisible(false);
    onSubmit(inputKey);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
              <h2 className="text-2xl font-serif-sc font-bold text-white mb-2">
                上海人生分支
              </h2>
              <p className="text-red-100 text-sm">Shanghai Life-Branches</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-gray-600 text-sm leading-relaxed">
                请输入您的 Google Gemini API Key 以开启时空之旅。我们使用 <strong>Gemini 2.5 Flash Image</strong> 模型生成您在不同时代的上海肖像。
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="AIzaSy..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!inputKey}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Unlock className="w-4 h-4" />
                  开始旅程
                </button>
              </div>
              
              <div className="text-center">
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-red-500 hover:underline">
                   获取 API Key &rarr;
                 </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApiKeyModal;