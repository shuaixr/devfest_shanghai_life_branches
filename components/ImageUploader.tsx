import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onImageSelect: (base64: string) => void;
}

const ImageUploader: React.FC<Props> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("无法访问摄像头");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(dataUrl);
        onImageSelect(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect("");
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif-sc font-bold text-gray-800">上传您的照片</h2>
        <p className="text-gray-500 text-sm">为了获得最佳效果，请使用正面清晰的人像照片</p>
      </div>

      {isCameraOpen ? (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] shadow-lg">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={stopCamera} 
              className="p-3 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <button 
              onClick={capturePhoto} 
              className="p-4 bg-white rounded-full text-red-600 shadow-lg hover:scale-105 transition"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        </div>
      ) : preview ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-[3/4] bg-gray-100 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
              onClick={clearImage} 
              className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-50 shadow-lg transform hover:-translate-y-1 transition"
            >
              <RotateCcw className="w-4 h-4" /> 重选
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <motion.label 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition bg-white h-64"
           >
             <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
             <Upload className="w-10 h-10 text-gray-400 mb-3" />
             <span className="text-gray-600 font-medium">上传照片</span>
             <span className="text-xs text-gray-400 mt-1">支持 JPG, PNG</span>
           </motion.label>

           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={startCamera}
             className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition bg-white h-64"
           >
             <Camera className="w-10 h-10 text-gray-400 mb-3" />
             <span className="text-gray-600 font-medium">拍摄照片</span>
             <span className="text-xs text-gray-400 mt-1">使用摄像头</span>
           </motion.button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
