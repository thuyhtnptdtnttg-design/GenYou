import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Share2 } from 'lucide-react';
import { DoodleHeart } from './HandDrawnIcons';
import { StudentResult } from '../types';
import { getEQClassification } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  result: StudentResult;
  onRetake: () => void;
}

const EQPassportScreen: React.FC<Props> = ({ result, onRetake }) => {
  const passportRef = useRef<HTMLDivElement>(null);
  const [showStamp, setShowStamp] = useState(false);
  
  const score = result.eqScore || 0;
  const classification = getEQClassification(score);
  const skills = result.eqSkills || { 
      SelfAwareness: 0, SelfManagement: 0, SocialAwareness: 0, RelationshipSkills: 0, SelfMotivation: 0 
  };

  useEffect(() => {
    // Trigger stamp animation after a short delay
    const timer = setTimeout(() => setShowStamp(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (passportRef.current) {
      const canvas = await html2canvas(passportRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `GenYou_EQPassport_${result.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // --- RADAR CHART LOGIC ---
  const categories = [
    { key: 'SelfAwareness', label: 'Nhận thức\nbản thân', max: 10 },
    { key: 'SelfManagement', label: 'Quản lý\ncảm xúc', max: 10 },
    { key: 'SocialAwareness', label: 'Nhận thức\nxã hội', max: 10 },
    { key: 'RelationshipSkills', label: 'Kỹ năng\nquan hệ', max: 15 },
    { key: 'SelfMotivation', label: 'Động lực\ncá nhân', max: 25 },
  ];

  const chartSize = 180;
  const center = chartSize / 2;
  const radius = 60;
  const angleStep = (Math.PI * 2) / 5;

  const points = categories.map((cat, i) => {
    // @ts-ignore
    const val = skills[cat.key] || 0;
    const normalized = val / cat.max;
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const x = center + radius * normalized * Math.cos(angle);
    const y = center + radius * normalized * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const fullPoly = categories.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Fake Visa Number
  const visaNumber = `EQ-${score}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

  return (
    <div className="w-full min-h-screen bg-pink-50 p-4 font-hand flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg relative perspective-1000"
      >
        {/* PASSPORT BOOKLET LOOK - Pastel Pink Theme */}
        <div 
          ref={passportRef}
          className="bg-white border-r-8 border-b-8 border-l-2 border-t-2 border-pink-300 rounded-r-2xl rounded-l-md shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col"
          style={{ 
             backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
             boxShadow: "10px 10px 20px rgba(0,0,0,0.2), inset 5px 0 20px rgba(0,0,0,0.1)" 
          }}
        >
          {/* Spine / Binding Line (Pink) */}
          <div className="h-full w-8 absolute left-0 top-0 border-r border-pink-300 bg-gradient-to-r from-pink-200 to-white flex flex-col items-center justify-center gap-2">
             <div className="w-[2px] h-full bg-pink-200/50"></div>
          </div>

          <div className="pl-12 pr-6 py-8 flex flex-col h-full relative">
            
            {/* Header Text */}
            <div className="flex justify-between items-start border-b-2 border-pink-300 pb-2 mb-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-pink-900">VISA</h2>
                <p className="text-xs font-sans font-bold text-pink-500">EMOTIONAL INTELLIGENCE • GENYOU</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-pink-900">{visaNumber}</p>
                <p className="text-[10px] uppercase text-pink-400">Type: EQ</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">
                
                {/* User Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 font-sans relative">
                     <div className="col-span-1">
                        <div className="w-24 h-32 border-2 border-pink-300 bg-pink-50 p-1 flex items-center justify-center">
                             <DoodleHeart size={48} className="text-pink-400 fill-pink-200" />
                        </div>
                     </div>
                     <div className="col-span-2 flex flex-col justify-end gap-1 relative">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Holder Name</span>
                          <span className="font-hand text-2xl font-bold uppercase block border-b border-pink-200 truncate">{result.name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Student ID</span>
                          <span className="font-mono text-lg block border-b border-pink-200">{result.studentId || 'N/A'}</span>
                        </div>
                        <div className="relative z-0">
                          <span className="block text-[10px] text-gray-400 uppercase">Classification</span>
                          <span className="font-bold text-pink-600 block">{classification.label}</span>
                        </div>
                     </div>
                </div>

                {/* STAMP EFFECT */}
                {showStamp && (
                    <motion.div 
                        initial={{ scale: 2, opacity: 0, rotate: -30 }} 
                        animate={{ scale: 1, opacity: 0.85, rotate: -10 }} 
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute top-[80px] right-[10px] w-36 h-36 border-[6px] border-pink-600 rounded-full flex flex-col items-center justify-center p-2 text-pink-600 mix-blend-multiply z-20 pointer-events-none"
                        style={{ 
                            borderRadius: '50%',
                            transform: 'rotate(-10deg)'
                        }}
                    >
                        {/* Outer and Inner circles for stamp look */}
                        <div className="absolute inset-2 border-[2px] border-dashed border-pink-600 rounded-full opacity-70"></div>
                        
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">EQ VERIFIED</span>
                        <h1 className="text-3xl font-black my-0 tracking-tighter uppercase leading-none">
                          {classification.label.includes(' ') ? classification.label.split(' ').slice(1).join(' ') : classification.label}
                        </h1>
                        <span className="text-sm font-bold border-t-2 border-pink-600 pt-0.5 mt-0.5">{score}/70</span>
                    </motion.div>
                )}

                {/* Radar Chart Section */}
                <div className="flex flex-col items-center mt-4 relative z-10">
                   <div className="relative w-[180px] h-[180px]">
                      <svg width="180" height="180" viewBox="0 0 180 180" className="overflow-visible">
                          {/* Background Webs */}
                          <polygon points={fullPoly} fill="none" stroke="#fbcfe8" strokeWidth="1" />
                          <polygon points={fullPoly} fill="none" stroke="#fbcfe8" strokeWidth="1" transform="scale(0.75)" transform-origin="90 90" />
                          <polygon points={fullPoly} fill="none" stroke="#fbcfe8" strokeWidth="1" transform="scale(0.5)" transform-origin="90 90" />
                          
                          {/* Axis Lines */}
                          {categories.map((_, i) => {
                              const angle = i * angleStep - Math.PI / 2;
                              const x = center + radius * Math.cos(angle);
                              const y = center + radius * Math.sin(angle);
                              return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#fbcfe8" strokeWidth="1" />
                          })}

                          {/* Data Polygon */}
                          <polygon points={points} fill="rgba(236, 72, 153, 0.4)" stroke="#db2777" strokeWidth="2" />
                          
                          {/* Labels */}
                          {categories.map((cat, i) => {
                               const angle = i * angleStep - Math.PI / 2;
                               const x = center + (radius + 20) * Math.cos(angle);
                               const y = center + (radius + 20) * Math.sin(angle);
                               return (
                                   <text 
                                     key={i} 
                                     x={x} 
                                     y={y} 
                                     textAnchor="middle" 
                                     dominantBaseline="middle" 
                                     className="text-[7px] font-bold fill-gray-500 uppercase font-sans"
                                   >
                                       {cat.label.split('\n')[0]}
                                   </text>
                               )
                          })}
                      </svg>
                   </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-8">
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Assessment Notes</p>
                    <p className="font-hand text-md text-gray-700 italic border-l-2 border-pink-400 pl-2">
                        "{classification.desc}"
                    </p>
                </div>

            </div>

            {/* Bottom Machine Readable Zone */}
            <div className="mt-auto font-mono text-lg tracking-widest text-pink-900 break-all leading-none opacity-60 pt-4 grayscale">
              P&lt;GENYOU{result.eqScore}&lt;&lt;{result.name.replace(/\s/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
              {result.id.substring(0,9)}&lt;0EQ{new Date().getFullYear()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4 w-full max-w-lg z-20">
        <button onClick={handleDownload} className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl font-bold border-4 border-transparent hover:bg-pink-700 shadow-xl transition-all">
             <Download size={20} /> Tải PDF
        </button>
        <button onClick={async () => {
             if (navigator.share) {
                try {
                    await navigator.share({
                    title: 'GenYou EQ Passport',
                    text: `Mình đạt mức ${classification.label} trong bài test EQ của GenYou!`,
                    url: window.location.href,
                    });
                } catch (error) { console.log('Error sharing', error); }
            } else {
                alert('Đã sao chép liên kết!');
            }
        }} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold border-4 border-black hover:bg-gray-100 shadow-comic transition-all">
             <Share2 size={20} /> Chia sẻ
        </button>
        <button onClick={onRetake} className="flex items-center gap-2 bg-yellow-300 text-black px-4 py-3 rounded-xl font-bold border-4 border-black hover:bg-yellow-400 shadow-comic transition-all">
             <RotateCcw size={20} />
        </button>
      </div>

    </div>
  );
};

export default EQPassportScreen;