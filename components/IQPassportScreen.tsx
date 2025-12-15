import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Share2 } from 'lucide-react';
import { DoodleBrain } from './HandDrawnIcons';
import { StudentResult } from '../types';
import { getIQClassification } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  result: StudentResult;
  onRetake: () => void;
}

const IQPassportScreen: React.FC<Props> = ({ result, onRetake }) => {
  const passportRef = useRef<HTMLDivElement>(null);
  const [showStamp, setShowStamp] = useState(false);
  
  const score = result.iqScore || 0;
  const classification = getIQClassification(score);
  const maxScore = 14;
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    // Trigger stamp animation after a short delay
    const timer = setTimeout(() => setShowStamp(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (passportRef.current) {
      const canvas = await html2canvas(passportRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `GenYou_IQPassport_${result.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const visaNumber = `IQ-${score}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

  return (
    <div className="w-full min-h-screen bg-blue-50 p-4 font-hand flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg relative perspective-1000"
      >
        {/* PASSPORT BOOKLET - Pastel Blue Theme */}
        <div 
          ref={passportRef}
          className="bg-white border-r-8 border-b-8 border-l-2 border-t-2 border-blue-200 rounded-r-2xl rounded-l-md shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col"
          style={{ 
             backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
             boxShadow: "10px 10px 20px rgba(0,0,0,0.2), inset 5px 0 20px rgba(0,0,0,0.1)" 
          }}
        >
          {/* Spine (Pastel Blue) */}
          <div className="h-full w-8 absolute left-0 top-0 border-r border-blue-300 bg-gradient-to-r from-blue-200 to-white flex flex-col items-center justify-center gap-2">
             <div className="w-[2px] h-full bg-blue-200/50"></div>
          </div>

          <div className="pl-12 pr-6 py-8 flex flex-col h-full relative">
            
            {/* Header Text */}
            <div className="flex justify-between items-start border-b-2 border-blue-800 pb-2 mb-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-blue-900">VISA</h2>
                <p className="text-xs font-sans font-bold text-blue-600">INTELLIGENCE ASSESSMENT • GENYOU</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-blue-900">{visaNumber}</p>
                <p className="text-[10px] uppercase text-blue-400">Class: IQ</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                
                {/* User Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 font-sans relative">
                     <div className="col-span-1">
                        <div className="w-24 h-32 border-2 border-blue-400 bg-blue-50 p-1 flex items-center justify-center">
                            <DoodleBrain size={48} className="text-blue-500" />
                        </div>
                     </div>
                     <div className="col-span-2 flex flex-col justify-end gap-1 relative">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Surname / Given Name</span>
                          <span className="font-hand text-2xl font-bold uppercase block border-b border-blue-300 truncate">{result.name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Student ID</span>
                          <span className="font-mono text-lg block border-b border-blue-300">{result.studentId}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Total Score</span>
                          <span className="font-black text-xl text-blue-700">{score}/14</span>
                        </div>
                     </div>
                </div>

                {/* STAMP EFFECT */}
                {showStamp && (
                  <motion.div 
                    initial={{ scale: 2, opacity: 0, rotate: -30 }} 
                    animate={{ scale: 1, opacity: 0.9, rotate: -8 }} 
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute top-[80px] right-[10px] w-40 h-40 border-[6px] border-blue-800 rounded-full flex flex-col items-center justify-center p-2 text-blue-800 mix-blend-multiply z-20 pointer-events-none"
                    style={{ 
                      borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%',
                      transform: 'rotate(-8deg)'
                    }}
                  >
                      <div className="absolute inset-1 border-2 border-dashed border-blue-800 rounded-full opacity-60"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">IQ VERIFIED</span>
                      <h1 className="text-3xl font-black my-[-2px] tracking-tighter text-center leading-none">
                          {classification.label.replace('IQ ', '')}
                      </h1>
                      <span className="text-[9px] font-bold uppercase border-t-2 border-blue-800 pt-1 mt-1">GENYOU SYSTEM</span>
                  </motion.div>
                )}

                {/* IQ Bar Chart */}
                <div className="mt-8 mb-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Performance Scale</span>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative border border-gray-300">
                        <div 
                           className="h-full bg-blue-500"
                           style={{ width: `${percentage}%` }}
                        ></div>
                        {/* Markers */}
                        <div className="absolute top-0 bottom-0 left-[28%] w-[1px] bg-black/20"></div>
                        <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-black/20"></div>
                        <div className="absolute top-0 bottom-0 left-[71%] w-[1px] bg-black/20"></div>
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-400 font-mono mt-1 px-1">
                        <span>Low</span>
                        <span>Avg</span>
                        <span>High</span>
                        <span>Superior</span>
                    </div>
                </div>

                {/* Details */}
                <div className="mt-4">
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Assessment Notes</p>
                    <div className="font-hand text-md text-gray-800 italic border-l-2 border-blue-400 pl-2 leading-relaxed">
                         "{classification.desc}"
                    </div>
                </div>

            </div>

            {/* Footer MRZ */}
            <div className="mt-auto font-mono text-lg tracking-widest text-blue-900 break-all leading-none opacity-60 pt-4 grayscale">
              P&lt;GENYOU{score}&lt;&lt;{result.name.replace(/\s/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
              {result.id.substring(0,9)}&lt;0IQ{new Date().getFullYear()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4 w-full max-w-lg z-20">
        <button onClick={handleDownload} className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl font-bold border-4 border-transparent hover:bg-blue-800 transition-all shadow-xl">
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

export default IQPassportScreen;