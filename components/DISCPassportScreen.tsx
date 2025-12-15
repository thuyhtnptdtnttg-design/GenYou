import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Share2, Crosshair } from 'lucide-react';
import { StudentResult } from '../types';
import { DISC_PROFILES } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  result: StudentResult;
  onRetake: () => void;
}

const DISCPassportScreen: React.FC<Props> = ({ result, onRetake }) => {
  const passportRef = useRef<HTMLDivElement>(null);
  const [showStamp, setShowStamp] = useState(false);
  
  const dominantType = result.discType || 'D';
  const profile = DISC_PROFILES[dominantType];
  const scores = result.discScores || { D: 0, I: 0, S: 0, C: 0 };
  
  useEffect(() => {
    // Trigger stamp animation after a short delay
    const timer = setTimeout(() => setShowStamp(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (passportRef.current) {
      const canvas = await html2canvas(passportRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `GenYou_DISCPassport_${result.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const visaNumber = `DISC-${dominantType}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

  // --- RADAR CHART LOGIC ---
  const axes = ['D', 'I', 'S', 'C'];
  const maxVal = 21;
  const chartSize = 160;
  const center = chartSize / 2;
  const radius = 60;
  const angleStep = (Math.PI * 2) / 4;

  const points = axes.map((axis, i) => {
    // @ts-ignore
    const val = scores[axis] || 0;
    const normalized = val / maxVal;
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * normalized * Math.cos(angle);
    const y = center + radius * normalized * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const fullPoly = axes.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full min-h-screen bg-red-50 p-4 font-hand flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg relative perspective-1000"
      >
        {/* PASSPORT BOOKLET - Pastel Red Theme */}
        <div 
          ref={passportRef}
          className="bg-white border-r-8 border-b-8 border-l-2 border-t-2 border-red-200 rounded-r-2xl rounded-l-md shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col"
          style={{ 
             backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
             boxShadow: "10px 10px 20px rgba(0,0,0,0.2), inset 5px 0 20px rgba(0,0,0,0.1)" 
          }}
        >
          {/* Spine (Pastel Red) */}
          <div className="h-full w-8 absolute left-0 top-0 border-r border-red-300 bg-gradient-to-r from-red-200 to-white flex flex-col items-center justify-center gap-2">
             <div className="w-[2px] h-full bg-red-200/50"></div>
          </div>

          <div className="pl-12 pr-6 py-8 flex flex-col h-full relative">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-red-800 pb-2 mb-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-red-900">VISA</h2>
                <p className="text-xs font-sans font-bold text-red-600">PERSONALITY ASSESSMENT • GENYOU</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-red-900">{visaNumber}</p>
                <p className="text-[10px] uppercase text-red-400">Type: DISC</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative">
                
                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4 font-sans relative">
                     <div className="col-span-1">
                        <div className="w-24 h-32 border-2 border-red-400 bg-red-50 p-1 flex items-center justify-center">
                             <span className="text-5xl">{profile.icon}</span>
                        </div>
                     </div>
                     <div className="col-span-2 flex flex-col justify-end gap-1 relative">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Student Name</span>
                          <span className="font-hand text-2xl font-bold uppercase block border-b border-red-300 truncate">{result.name}</span>
                        </div>
                        <div>
                           <span className="block text-[10px] text-gray-400 uppercase">Student ID</span>
                           <span className="font-mono text-lg block border-b border-red-300">{result.studentId}</span>
                        </div>
                        <div>
                           <span className="block text-[10px] text-gray-400 uppercase">Dominant Personality</span>
                           <span className="font-bold text-lg" style={{ color: profile.color }}>
                               {profile.name.split(' ')[0]}
                           </span>
                        </div>
                     </div>
                </div>

                {/* STAMP EFFECT */}
                {showStamp && (
                    <motion.div 
                        initial={{ scale: 2, opacity: 0, rotate: -25 }} 
                        animate={{ scale: 1, opacity: 0.85, rotate: -12 }} 
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute top-[80px] right-[10px] w-36 h-36 border-[6px] border-red-700 rounded-full flex flex-col items-center justify-center p-2 text-red-700 mix-blend-multiply z-20 pointer-events-none"
                        style={{ 
                            borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%',
                            transform: 'rotate(-12deg)'
                        }}
                    >
                        <div className="absolute inset-1 border-[2px] border-dashed border-red-700 rounded-full opacity-60"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">DISC APPROVED</span>
                        <h1 className="text-6xl font-black my-[-5px] tracking-tighter">{dominantType}</h1>
                        <span className="text-xs font-bold border-t-2 border-red-700 pt-0.5 mt-0.5">GENYOU SYSTEM</span>
                    </motion.div>
                )}

                {/* Radar Chart + Scores */}
                <div className="flex items-center justify-between mt-2 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-2 relative z-10">
                   <div className="w-1/2 flex justify-center">
                      <svg width="140" height="140" viewBox="0 0 160 160" className="overflow-visible">
                          <polygon points={fullPoly} fill="none" stroke="#cbd5e1" strokeWidth="1" />
                          <polygon points={fullPoly} fill="none" stroke="#cbd5e1" strokeWidth="1" transform="scale(0.5)" transform-origin="80 80" />
                          
                          {axes.map((_, i) => {
                              const angle = i * angleStep - Math.PI / 2;
                              const x = center + radius * Math.cos(angle);
                              const y = center + radius * Math.sin(angle);
                              return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />
                          })}

                          <polygon points={points} fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="2" />
                          
                          {/* Labels */}
                          {axes.map((label, i) => {
                               const angle = i * angleStep - Math.PI / 2;
                               const x = center + (radius + 15) * Math.cos(angle);
                               const y = center + (radius + 15) * Math.sin(angle);
                               return (
                                   <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-xs font-black fill-gray-600">
                                       {label}
                                   </text>
                               )
                          })}
                      </svg>
                   </div>
                   <div className="w-1/2 grid grid-cols-2 gap-2 text-center">
                       {axes.map(axis => (
                           <div key={axis} className="bg-white border border-gray-200 rounded p-1">
                               <span className="block text-[10px] text-gray-400 font-bold">{axis}</span>
                               <span className="block text-lg font-black text-gray-800">
                                   {/* @ts-ignore */}
                                   {scores[axis]}
                               </span>
                           </div>
                       ))}
                   </div>
                </div>

                {/* Profile Description */}
                <div className="mb-4">
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Assessment Notes</p>
                    <p className="font-hand text-sm text-gray-800 italic border-l-2 border-red-400 pl-2 leading-tight">
                        "{profile.description}"
                    </p>
                </div>

                 {/* Careers */}
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Suggested Careers</p>
                    <div className="flex flex-wrap gap-1">
                        {profile.jobs.slice(0, 4).map((job, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-50 text-red-800 text-[10px] font-bold rounded border border-red-200">
                                {job}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer MRZ */}
            <div className="mt-auto font-mono text-lg tracking-widest text-red-900 break-all leading-none opacity-60 pt-4 grayscale">
              P&lt;GENYOU{dominantType}&lt;&lt;{result.name.replace(/\s/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
              {result.id.substring(0,9)}&lt;0DISC{new Date().getFullYear()}&lt;&lt;&lt;&lt;&lt;&lt;
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4 w-full max-w-lg z-20">
        <button onClick={handleDownload} className="flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-xl font-bold border-4 border-transparent hover:bg-red-800 shadow-xl transition-all">
             <Download size={20} /> Tải PDF
        </button>
        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold border-4 border-black hover:bg-gray-100 shadow-comic transition-all">
             <Share2 size={20} /> Chia sẻ
        </button>
        <button onClick={onRetake} className="flex items-center gap-2 bg-yellow-300 text-black px-4 py-3 rounded-xl font-bold border-4 border-black hover:bg-yellow-400 shadow-comic transition-all">
             <RotateCcw size={20} />
        </button>
      </div>

    </div>
  );
};

export default DISCPassportScreen;