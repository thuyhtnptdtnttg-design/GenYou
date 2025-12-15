import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Sparkles, Share2 } from 'lucide-react';
import { StudentResult, MBTIProfile } from '../types';
import { MBTI_PROFILES } from '../constants';
import { getStudyAdvice } from '../services/geminiService';
import { motion } from 'framer-motion';

interface Props {
  result: StudentResult;
  onRetake: () => void;
}

const PassportScreen: React.FC<Props> = ({ result, onRetake }) => {
  const passportRef = useRef<HTMLDivElement>(null);
  
  const mbtiType = result.mbtiType || 'INFP';
  const profile: MBTIProfile = MBTI_PROFILES[mbtiType] || MBTI_PROFILES['INFP'];
  const scores = result.mbtiScores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    // Trigger stamp animation after a delay to simulate "processing" then "stamping"
    const timer = setTimeout(() => setShowStamp(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (passportRef.current) {
      const canvas = await html2canvas(passportRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `GenYou_Passport_${result.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GenYou MBTI Passport',
          text: `Mình là ${mbtiType} - ${profile.name}! Làm passport của bạn tại GenYou nhé!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Đã sao chép liên kết vào bộ nhớ tạm!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const tip = await getStudyAdvice(mbtiType, result.name);
    setAdvice(tip);
    setLoadingAdvice(false);
  };

  // Generate a fake Visa Number
  const visaNumber = `V-${mbtiType}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

  return (
    <div className="w-full min-h-screen bg-purple-50 p-4 font-hand flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg relative perspective-1000"
      >
        {/* Passport Booklet Look - Pastel Purple Theme */}
        <div 
          ref={passportRef}
          className="bg-paper border-r-8 border-b-8 border-l-2 border-t-2 border-purple-300 rounded-r-2xl rounded-l-md shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col"
          style={{ 
             backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
             boxShadow: "10px 10px 20px rgba(0,0,0,0.2), inset 5px 0 20px rgba(0,0,0,0.1)" 
          }}
        >
          {/* Passport Header / Binding Line (Purple Spine) */}
          <div className="h-full w-8 absolute left-0 top-0 border-r border-purple-300 bg-gradient-to-r from-purple-200 to-white flex flex-col items-center justify-center gap-2">
             <div className="w-[2px] h-full bg-purple-200/50"></div>
          </div>

          <div className="pl-12 pr-6 py-8 flex flex-col h-full">
            {/* Header Text */}
            <div className="flex justify-between items-start border-b-2 border-purple-800 pb-2 mb-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-purple-900">VISA</h2>
                <p className="text-xs font-sans font-bold text-purple-500">LEARNING PASSPORT • GENYOU</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-purple-900">{visaNumber}</p>
                <p className="text-[10px] uppercase text-purple-400">Entry Permit</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
              
              {/* User Info Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 font-sans">
                 <div className="col-span-1">
                    <div className="w-24 h-32 border-2 border-purple-400 bg-purple-50 p-1">
                       <div className={`w-full h-full ${profile.color} flex items-center justify-center text-4xl grayscale contrast-125`}>
                         {profile.icon}
                       </div>
                    </div>
                 </div>
                 <div className="col-span-2 flex flex-col justify-end gap-1">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Surname / Given Name</span>
                      <span className="font-hand text-2xl font-bold uppercase block border-b border-purple-300 truncate">{result.name}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Student ID</span>
                      <span className="font-mono text-lg block border-b border-purple-300">{result.studentId}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Date of Issue</span>
                      <span className="font-mono text-sm block">{new Date(result.timestamp).toLocaleDateString('vi-VN')}</span>
                    </div>
                 </div>
              </div>

              {/* The "VISA STAMP" Effect */}
              {showStamp && (
                <motion.div 
                  initial={{ scale: 2, opacity: 0, rotate: -25 }}
                  animate={{ scale: 1, opacity: 0.85, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }} // Slam effect
                  className="absolute top-1/3 left-1/4 transform -translate-x-1/2 w-48 h-48 border-[6px] border-purple-700 rounded-full flex flex-col items-center justify-center p-2 text-purple-700 mix-blend-multiply z-10"
                  style={{ 
                    borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%', // Irregular circle
                  }}
                >
                  <div className="absolute inset-2 border-2 border-dashed border-purple-700 rounded-full opacity-60"></div>
                  <span className="text-xs font-bold uppercase tracking-widest mt-2">MBTI APPROVED</span>
                  <h1 className="text-5xl font-black my-1 uppercase tracking-tighter">{mbtiType}</h1>
                  <span className="text-sm font-bold border-t-2 border-purple-700 pt-1 text-center leading-none">{profile.name}</span>
                  <div className="flex gap-1 mt-1">
                     <span className="text-[10px] font-mono">CODE: {scores.E > scores.I ? 'E' : 'I'}{scores.S > scores.N ? 'S' : 'N'}</span>
                  </div>
                </motion.div>
              )}

              {/* Characteristics (Bottom) */}
              <div className="mt-20">
                <p className="text-[10px] text-gray-400 uppercase mb-1">Notes / Endorsements</p>
                <div className="font-hand text-lg text-ink space-y-1">
                   {profile.description.map((trait, i) => (
                     <div key={i} className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                       <span>{trait}</span>
                     </div>
                   ))}
                   <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 italic">
                      <span>* Valid for study motivation</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Bottom Machine Readable Zone (Fake) */}
            <div className="mt-auto font-mono text-lg tracking-widest text-purple-900 break-all leading-none opacity-60 pt-4">
              P&lt;GENYOU{mbtiType}&lt;&lt;{result.name.replace(/\s/g, '<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
              {result.id.substring(0,9)}&lt;0VNM{new Date().getFullYear()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col md:flex-row justify-center gap-4 w-full max-w-lg z-20">
        <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 bg-purple-900 text-white border-4 border-black px-6 py-3 rounded-xl font-bold font-sans hover:bg-purple-800 transition-colors shadow-comic active:translate-y-1 active:shadow-none">
          <Download size={20} /> Tải về PDF
        </button>
        <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-white text-black border-4 border-black px-6 py-3 rounded-xl font-bold font-sans hover:bg-gray-50 transition-colors shadow-comic active:translate-y-1 active:shadow-none">
          <Share2 size={20} /> Chia sẻ
        </button>
        <button onClick={onRetake} className="flex-1 flex items-center justify-center gap-2 bg-yellow-300 text-black border-4 border-black px-6 py-3 rounded-xl font-bold font-sans hover:bg-yellow-400 transition-colors shadow-comic active:translate-y-1 active:shadow-none">
          <RotateCcw size={20} /> Làm lại
        </button>
      </div>

      {/* AI Advice Section */}
      <div className="mt-6 w-full max-w-lg z-20">
        {!advice ? (
          <button 
            onClick={handleGetAdvice}
            disabled={loadingAdvice}
            className="w-full bg-white text-purple-700 border-4 border-black p-4 rounded-xl font-bold shadow-comic flex items-center justify-center gap-2 hover:translate-y-1 hover:shadow-none transition-all"
          >
            {loadingAdvice ? (
              <span className="animate-pulse">Đang triệu hồi bot...</span>
            ) : (
              <>
                <Sparkles size={20} /> Xin lời khuyên (AI)
              </>
            )}
          </button>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-comic border-4 border-black font-sans relative"
          >
            <div className="absolute -top-3 -left-3 bg-purple-500 text-white px-3 py-1 font-bold text-sm transform -rotate-6 border-2 border-black shadow-sm">
              LỜI KHUYÊN TỪ GENYOU
            </div>
            <div className="text-gray-800 whitespace-pre-line leading-relaxed font-medium mt-2">
              {advice}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PassportScreen;