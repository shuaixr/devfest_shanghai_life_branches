import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { Era, EraConfig } from '../types';
import { ERA_CONFIGS } from '../constants';

interface Props {
  eras: Era[];
  activeIndex: number;
  onChange: (index: number) => void;
  renderItem: (era: Era, isActive: boolean) => React.ReactNode;
}

const CARD_WIDTH = 320; // Width + Gap approximately
const CARD_GAP = 20;

const Timeline: React.FC<Props> = ({ eras, activeIndex, onChange, renderItem }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);

  // Calculate the center position offset
  const centerOffset = width / 2 - (CARD_WIDTH / 2);
  
  // Update constraints when resize
  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      // Initial position
      x.set(-activeIndex * (CARD_WIDTH + CARD_GAP) + (containerRef.current.offsetWidth / 2 - CARD_WIDTH/2));
    }
  }, [activeIndex]); // Re-run if activeIndex changes externally to snap

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;
    
    // Predict where it would land based on velocity
    const predictedX = currentX + velocity * 0.2;
    
    // Convert position to index
    // Position = -index * (WIDTH + GAP) + CenterOffset
    // index = (CenterOffset - Position) / (WIDTH + GAP)
    let targetIndex = Math.round((centerOffset - predictedX) / (CARD_WIDTH + CARD_GAP));
    
    // Clamp index
    targetIndex = Math.max(0, Math.min(eras.length - 1, targetIndex));
    
    onChange(targetIndex);

    // Animate to snap position
    const targetX = -targetIndex * (CARD_WIDTH + CARD_GAP) + centerOffset;
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30
    });
  };

  // Manual snap if props change
  useEffect(() => {
    if (width === 0) return;
    const targetX = -activeIndex * (CARD_WIDTH + CARD_GAP) + centerOffset;
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
  }, [activeIndex, width]);

  return (
    <div className="relative w-full overflow-hidden pt-10 pb-20" ref={containerRef}>
      {/* Background Year Indicator - Subtle */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none opacity-10">
         <span className="text-[12rem] font-bold font-serif-sc tracking-widest text-gray-900">
           {ERA_CONFIGS[eras[activeIndex]].year}
         </span>
      </div>

      <motion.div
        className="flex items-center cursor-grab active:cursor-grabbing pl-[50vw]" 
        style={{ x, paddingLeft: 0 }} // Padding handled by calculation
        drag="x"
        dragConstraints={{ 
           left: -(eras.length - 1) * (CARD_WIDTH + CARD_GAP) + centerOffset - 100, 
           right: centerOffset + 100 
        }}
        onDragEnd={handleDragEnd}
      >
        {eras.map((era, index) => {
          const config = ERA_CONFIGS[era];
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={era}
              className="relative shrink-0"
              style={{ 
                width: CARD_WIDTH,
                marginRight: CARD_GAP,
              }}
              animate={{
                scale: isActive ? 1 : 0.9,
                opacity: isActive ? 1 : 0.5,
                y: isActive ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
            >
              {renderItem(era, isActive)}
              
              {/* Timeline Dot Connector */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                 <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isActive ? 'bg-red-600' : 'bg-gray-300'}`} />
                 <span className={`text-xs font-serif-sc font-bold transition-colors duration-300 ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                   {config.year}
                 </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Connecting line for timeline dots */}
      <div className="absolute bottom-[4.2rem] left-0 right-0 h-0.5 bg-gray-200 -z-10" />
      
      {/* Navigation Hints */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300 pointer-events-none">
         &larr;
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-300 pointer-events-none">
         &rarr;
      </div>
    </div>
  );
};

export default Timeline;