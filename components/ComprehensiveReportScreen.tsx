import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, FolderOpen, CheckCircle } from 'lucide-react';
import { getResults } from '../services/storageService';
import { getComprehensiveAnalysis } from '../services/geminiService';
import { StudentResult, TestType } from '../types';
import GenYouBot from './GenYouBot';
import ReactMarkdown from 'react-markdown'; // Assuming basic markdown rendering or just text

interface Props {
  studentName: string;
  studentId: string;
  onBack: () => void;
}

const ComprehensiveReportScreen: React.FC<Props> = ({ studentName, studentId, onBack }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [latestResults, setLatestResults] = useState<Record<string, StudentResult | null>>({
    MBTI: null,
    HOLLAND: null,
    IQ: null,
    EQ: null,
    DISC: null
  });

  useEffect(() => {
    // Fetch all results and filter for current student
    const allResults = getResults();
    const studentResults = allResults.filter(r => r.studentId === studentId || r.name === studentName);

    // Get latest of each type
    const latest: Record<string, StudentResult | null> = { ...latestResults };
    const types: TestType[] = ['MBTI', 'HOLLAND', 'IQ', 'EQ', 'DISC'];
    
    types.forEach(type => {
      const typeResults = studentResults.filter(r => r.type === type);
      if (typeResults.length > 0) {
        // Sort by timestamp desc
        typeResults.sort((a, b) => b.timestamp - a.timestamp);
        latest[type] = typeResults[0];
      }
    });

    setLatestResults(latest);
  }, [studentId, studentName]);

  const handleAnalyze = async () => {
    setLoading(true);
    const analysis = await getComprehensiveAnalysis(studentName, latestResults);
    setReport(analysis);
    setLoading(false);
  };

  const completedCount = Object.values(latestResults).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-paper font-sans p-4 relative overflow-hidden flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0"></div>

      <div className="w-full max-w-4xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-bold hover:text-black bg-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-black transition-all">
            <ArrowLeft size={20} /> Quay lại Menu
          </button>
          <div className="flex items-center gap-2">
            <FolderOpen className="text-yellow-500" size={28} />
            <span className="font-black text-xl text-gray-800 uppercase">Hồ sơ năng lực</span>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white border-4 border-black shadow-comic rounded-3xl p-6 mb-8 relative">
          <GenYouBot mood="excited" className="absolute -top-12 -right-4 w-28 h-28" />
          <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
             <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
               {studentName}
             </h1>
             <p className="text-gray-500 font-mono font-bold">ID: {studentId}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             {/* Summary Badges */}
             {(Object.entries(latestResults) as [string, StudentResult | null][]).map(([type, res]) => (
               <div key={type} className={`
                 p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-1 transition-all
                 ${res ? 'bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-gray-100 border-gray-200 opacity-50 border-dashed'}
               `}>
                 <span className="text-[10px] font-bold uppercase text-gray-400">{type}</span>
                 {res ? (
                   <>
                     <span className="text-lg font-black text-gray-800 leading-none">
                       {res.mbtiType || res.hollandCode || res.iqClassification?.split(' ')[1] || res.eqClassification?.split(' ')[1] || res.discType}
                     </span>
                     {type === 'IQ' && <span className="text-[10px] font-mono">{res.iqScore}/14</span>}
                     {type === 'EQ' && <span className="text-[10px] font-mono">{res.eqScore}/70</span>}
                     <CheckCircle size={14} className="text-green-500 mt-1" />
                   </>
                 ) : (
                   <span className="text-xs font-bold text-gray-400 py-2">Chưa làm</span>
                 )}
               </div>
             ))}
          </div>
        </div>

        {/* Action Section */}
        {completedCount > 0 ? (
          <div className="flex flex-col items-center gap-6">
             {!report && (
                <div className="text-center max-w-md">
                  <p className="text-gray-600 font-hand text-xl mb-4">
                    Bạn đã hoàn thành {completedCount}/5 bài test. <br/>
                    Hãy để GenYou kết nối các dữ liệu lại và đưa ra chiến lược tối ưu nhất cho bạn nhé!
                  </p>
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-xl px-8 py-4 rounded-2xl border-4 border-black shadow-comic hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    {loading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Sparkles size={24} className="animate-pulse" /> 
                    )}
                    {loading ? 'Đang phân tích...' : 'PHÂN TÍCH TỔNG HỢP (AI)'}
                  </button>
                </div>
             )}

             {/* The Report */}
             {report && (
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="w-full bg-paper border-4 border-black rounded-xl p-8 shadow-comic relative overflow-hidden"
                 style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
               >
                  <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
                  
                  <h2 className="text-2xl font-black text-center mb-6 uppercase border-b-2 border-black pb-2 inline-block mx-auto w-full">
                    📑 Báo Cáo Chiến Lược Cá Nhân Hóa
                  </h2>
                  
                  <div className="prose prose-lg prose-p:font-hand prose-headings:font-sans prose-headings:font-black max-w-none text-gray-800">
                    <div className="whitespace-pre-line leading-relaxed">
                      {report}
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">Generated by GenYou AI</span>
                  </div>
               </motion.div>
             )}
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-xl font-bold text-gray-400">Bạn chưa làm bài test nào cả!</p>
            <p className="text-gray-500">Hãy quay lại Menu và hoàn thành ít nhất 1 bài test để xem phân tích nhé.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComprehensiveReportScreen;