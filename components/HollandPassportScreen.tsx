import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Share2, Briefcase } from 'lucide-react';
import { StudentResult } from '../types';
import { RIASEC_PROFILES } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  result: StudentResult;
  onRetake: () => void;
}

const HollandPassportScreen: React.FC<Props> = ({ result, onRetake }) => {
  const passportRef = useRef<HTMLDivElement>(null);
  const [showStamp, setShowStamp] = useState(false);
  
  const code = result.hollandCode || 'RIA';
  const primaryCode = code[0];
  const primaryProfile = RIASEC_PROFILES[primaryCode];

  // Prepare data for chart
  const scores = (result.hollandScores || { R:0, I:0, A:0, S:0, E:0, C:0 }) as Record<string, number>;
  const maxScore = Math.max(...Object.values(scores), 30); // Normalize max height

  useEffect(() => {
    // Trigger stamp animation after a short delay
    const timer = setTimeout(() => setShowStamp(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (passportRef.current) {
      const canvas = await html2canvas(passportRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `GenYou_CareerPassport_${result.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const visaNumber = `HOLLAND-${code}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

  return (
    <div className="w-full min-h-screen bg-orange-50 p-4 font-hand flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg relative perspective-1000"
      >
        {/* PASSPORT BOOKLET - Pastel Orange/Yellow Theme */}
        <div 
          ref={passportRef}
          className="bg-white border-r-8 border-b-8 border-l-2 border-t-2 border-orange-200 rounded-r-2xl rounded-l-md shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col"
          style={{ 
             backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
             boxShadow: "10px 10px 20px rgba(0,0,0,0.2), inset 5px 0 20px rgba(0,0,0,0.1)" 
          }}
        >
          {/* Spine (Pastel Orange) */}
          <div className="h-full w-8 absolute left-0 top-0 border-r border-orange-300 bg-gradient-to-r from-orange-200 to-white flex flex-col items-center justify-center gap-2">
             <div className="w-[2px] h-full bg-orange-200/50"></div>
          </div>

          <div className="pl-12 pr-6 py-8 flex flex-col h-full relative">
            
            {/* Header Text */}
            <div className="flex justify-between items-start border-b-2 border-orange-800 pb-2 mb-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-orange-900">VISA</h2>
                <p className="text-xs font-sans font-bold text-orange-600">CAREER ORIENTATION • GENYOU</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-orange-900">{visaNumber}</p>
                <p className="text-[10px] uppercase text-orange-400">Permit: {code}</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                
                {/* User Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 font-sans relative">
                     <div className="col-span-1">
                        <div className="w-24 h-32 border-2 border-orange-400 bg-orange-50 p-1 flex items-center justify-center">
                            <span className="text-5xl">{primaryProfile.icon}</span>
                        </div>
                     </div>
                     <div className="col-span-2 flex flex-col justify-end gap-1 relative">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Surname / Given Name</span>
                          <span className="font-hand text-2xl font-bold uppercase block border-b border-orange-300 truncate">{result.name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Student ID</span>
                          <span className="font-mono text-lg block border-b border-orange-300">{result.studentId}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Date of Issue</span>
                          <span className="font-mono text-sm block">{new Date(result.timestamp).toLocaleDateString('vi-VN')}</span>
                        </div>
                     </div>
                </div>

                {/* STAMP EFFECT */}
                {showStamp && (
                  <motion.div 
                    initial={{ scale: 2, opacity: 0, rotate: 30 }} 
                    animate={{ scale: 1, opacity: 0.9, rotate: 12 }} 
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute top-[80px] right-[10px] w-36 h-36 border-[6px] border-orange-700 rounded-full flex flex-col items-center justify-center p-2 text-orange-700 mix-blend-multiply z-20 pointer-events-none"
                    style={{ 
                      borderRadius: '55% 45% 60% 40% / 40% 60% 55% 45%',
                      transform: 'rotate(12deg)'
                    }}
                  >
                      <div className="absolute inset-1 border-2 border-dashed border-orange-700 rounded-full opacity-60"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">CAREER PATH</span>
                      <h1 className="text-5xl font-black my-[-2px] uppercase tracking-tighter">{result.hollandCode}</h1>
                      <span className="text-[9px] font-bold uppercase border-t-2 border-orange-700 pt-1 mt-1">GENYOU VERIFIED</span>
                  </motion.div>
                )}

                {/* Chart Section */}
                <div className="mt-8 bg-gray-50 border border-gray-300 rounded-lg p-3 relative z-10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Personality Spectrum (RIASEC)</span>
                    <div className="flex justify-between items-end h-24 gap-1">
                        {Object.entries(scores).map(([key, val]) => (
                            <div key={key} className="flex-1 flex flex-col items-center gap-1 group">
                                <div 
                                    className="w-full rounded-t-sm transition-all duration-1000 ease-out border border-gray-400/20"
                                    style={{ 
                                        height: `${(val / maxScore) * 100}%`,
                                        backgroundColor: RIASEC_PROFILES[key].color
                                    }}
                                ></div>
                                <span className="text-[9px] font-bold">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="mt-6">
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Notes / Endorsements</p>
                    <div className="font-hand text-sm text-gray-800">
                         <div className="mb-2">
                             <span className="font-bold text-teal-600">Primary Group:</span> {primaryProfile.name}
                         </div>
                         <div className="italic text-gray-600 mb-2 leading-tight">"{primaryProfile.description}"</div>
                         <div>
                             <span className="font-bold text-xs uppercase block text-gray-500 mb-1">Suggested Jobs:</span>
                             <div className="flex flex-wrap gap-1">
                                {primaryProfile.jobs.slice(0, 4).map((job, i) => (
                                    <span key={i} className="bg-yellow-100 border border-yellow-300 px-1.5 py-0.5 text-[10px] font-bold rounded">
                                        {job}
                                    </span>
                                ))}
                             </div>
                         </div>
                    </div>
                </div>

            </div>

            {/* Footer MRZ */}
            <div className="mt-auto font-mono text-lg tracking-widest text-orange-900 break-all leading-none opacity-60 pt-4 grayscale">
              P&lt;GENYOU{code}&lt;&lt;{result.name.replace(/\s/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
              {result.id.substring(0,9)}&lt;0HLD{new Date().getFullYear()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4 w-full max-w-lg z-20">
        <button onClick={handleDownload} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold border-4 border-transparent hover:bg-gray-800 transition-all shadow-xl">
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

export default HollandPassportScreen;