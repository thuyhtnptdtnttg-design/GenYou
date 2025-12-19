import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Heart, ArrowLeft, BrainCircuit } from 'lucide-react';
import GenYouBot from './GenYouBot';

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const MBTIIntroScreen: React.FC<Props> = ({ onStart, onBack }) => {
  return (
    <div className="min-h-screen bg-paper p-4 flex flex-col items-center justify-center font-hand relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-200 via-transparent to-transparent"></div>
      
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 font-bold hover:text-black z-20 text-lg"
      >
        <ArrowLeft size={28} /> Quay lại
      </button>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white border-4 border-black shadow-comic rounded-3xl p-6 md:p-10 relative z-10 mx-4"
      >
        <GenYouBot mood="happy" className="absolute -top-16 -right-4 w-32 h-32 md:w-40 md:h-40" />
        
        <div className="mb-6">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border-2 border-purple-200 inline-block mb-2">
            PERSONALITY TEST
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-ink uppercase tracking-tight leading-none">
            Khám phá<br/>bản thân cùng MBTI
          </h1>
        </div>

        <div className="space-y-6 text-lg text-gray-700">
           <p className="font-sans font-medium text-gray-600">
             Bài trắc nghiệm <strong>MBTI</strong> giúp bạn hiểu rõ hơn về cách mình nhìn nhận thế giới, ra quyết định và tương tác với mọi người.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl flex gap-3 items-start">
                  <Clock className="text-blue-500 shrink-0 mt-1" size={24} />
                  <div>
                    <span className="font-black block text-blue-800 uppercase text-sm">Thời gian</span>
                    <span className="text-sm font-bold">~2 phút (20 câu)</span>
                  </div>
               </div>

               <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl flex gap-3 items-start">
                  <BrainCircuit className="text-green-600 shrink-0 mt-1" size={24} />
                  <div>
                    <span className="font-black block text-green-800 uppercase text-sm">Kết quả</span>
                    <span className="text-sm font-bold">16 Nhóm tính cách</span>
                  </div>
               </div>
           </div>

           <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl flex gap-3 items-start">
              <Heart className="text-yellow-600 shrink-0 mt-1" size={24} />
              <div>
                <span className="font-black block text-yellow-800 uppercase text-sm">Lưu ý quan trọng</span>
                <span className="text-sm font-bold">Không có câu trả lời đúng hay sai. Hãy chọn đáp án mà bạn thấy <span className="underline decoration-wavy decoration-yellow-500">tự nhiên nhất</span> với con người thật của mình (không phải con người bạn muốn trở thành).</span>
              </div>
           </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full mt-8 bg-black hover:bg-gray-800 text-white border-4 border-transparent text-xl md:text-2xl font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
        >
          BẮT ĐẦU NGAY <ArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
        </button>

      </motion.div>

      <div className="mt-6 text-gray-500 font-bold text-sm text-center max-w-md">
        "Hiểu mình là bước đầu tiên để chinh phục thế giới."
      </div>
    </div>
  );
};

export default MBTIIntroScreen;