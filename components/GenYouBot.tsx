import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  mood?: 'happy' | 'thinking' | 'excited';
  className?: string;
}

const GenYouBot: React.FC<Props> = ({ mood = 'happy', className = '' }) => {
  return (
    <motion.div 
      className={`relative w-32 h-32 ${className}`}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
        {/* Robot Head - Teal/Mint Theme */}
        <rect x="20" y="25" width="80" height="70" rx="15" fill="#2DD4BF" stroke="#134E4A" strokeWidth="3" />
        
        {/* Ears/Headphones */}
        <rect x="10" y="50" width="10" height="20" rx="2" fill="#0F766E" />
        <rect x="100" y="50" width="10" height="20" rx="2" fill="#0F766E" />
        
        {/* Antenna */}
        <line x1="60" y1="25" x2="60" y2="10" stroke="#134E4A" strokeWidth="3" />
        <circle cx="60" cy="10" r="5" fill="#F472B6" stroke="#134E4A" strokeWidth="2" />

        {/* Face Screen */}
        <rect x="30" y="40" width="60" height="40" rx="8" fill="#F0FDFA" opacity="0.9" />

        {/* Expressions */}
        {mood === 'happy' && (
          <g>
            <circle cx="45" cy="55" r="4" fill="#134E4A" />
            <circle cx="75" cy="55" r="4" fill="#134E4A" />
            <path d="M45 65 Q 60 75 75 65" fill="none" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="60" r="2" fill="#F472B6" opacity="0.5" />
            <circle cx="80" cy="60" r="2" fill="#F472B6" opacity="0.5" />
          </g>
        )}

        {mood === 'thinking' && (
          <g>
            <circle cx="45" cy="55" r="4" fill="#134E4A" />
            <line x1="70" y1="55" x2="80" y2="55" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="70" r="3" fill="#134E4A" />
          </g>
        )}

        {mood === 'excited' && (
          <g>
             {/* Star eyes */}
            <path d="M40 55 L 45 50 L 50 55 M 45 50 L 45 60 M 40 55 L 50 55" stroke="#134E4A" strokeWidth="2" />
            <path d="M70 55 L 75 50 L 80 55 M 75 50 L 75 60 M 70 55 L 80 55" stroke="#134E4A" strokeWidth="2" />
            <path d="M45 70 Q 60 80 75 70" fill="none" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export default GenYouBot;