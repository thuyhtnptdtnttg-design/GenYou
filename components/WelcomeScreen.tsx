
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, GraduationCap, User, BookOpen, Lock, StickyNote, PenTool, Eraser, Ruler, Pencil } from 'lucide-react';

interface Props {
  onStart: (name: string, studentId: string) => void;
  onAdmin: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, onAdmin }) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [password, setPassword] = useState('');

  // 3D Tilt Effect for the Passport
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student') {
      if (name.trim() && grade.trim()) {
        const autoId = `GEN-${grade.toUpperCase().replace(/\s+/g, '')}-${Math.floor(Math.random() * 1000)}`;
        onStart(name, autoId);
      } else {
        alert('Vui lòng nhập đầy đủ tên và lớp nhé!');
      }
    } else {
      if (name.trim() && password === 'admin') {
        onAdmin();
      } else if (password !== 'admin') {
        alert('Mật khẩu giáo viên không đúng!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center p-4 font-hand overflow-hidden relative">
      {/* Background Decor: Grid & Hand-drawn elements */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Colorful Abstract Shapes */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-teal-100 rounded-full blur-[100px] opacity-60"></div>

      {/* Subject Stamps & Doodle Decor */}
      <SubjectStamp text="Toán" color="text-red-500" border="border-red-400" top="15%" left="5%" rotate="-15deg" />
      <SubjectStamp text="Văn" color="text-blue-500" border="border-blue-400" bottom="20%" right="5%" rotate="10deg" />
      <SubjectStamp text="Anh" color="text-green-500" border="border-green-400" top="25%" right="8%" rotate="-5deg" />
      <DoodleItem Icon={Ruler} bottom="10%" left="8%" rotate="20deg" color="text-gray-300" />
      <DoodleItem Icon={Pencil} top="10%" right="15%" rotate="-10deg" color="text-gray-300" />

      {/* Main Passport Card */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white border-[6px] border-black rounded-[2.5rem] shadow-comic overflow-hidden relative min-h-[660px] flex flex-col p-8 md:p-10">
          
          {/* Notebook Spine decoration */}
          <div className="absolute left-6 top-0 bottom-0 w-1 border-r-2 border-dashed border-gray-300"></div>

          {/* Header Section */}
          <div className="text-center mb-8 relative">
            {/* Passport Stamp Icon with Graduation Cap inside */}
            <motion.div 
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="inline-flex items-center justify-center relative w-20 h-20 mb-4"
            >
              <div className="absolute inset-0 border-4 border-black rounded-xl bg-yellow-400 transform rotate-[-3deg] shadow-sm"></div>
              <div className="absolute inset-0 border-2 border-dashed border-black/20 rounded-xl"></div>
              <GraduationCap size={36} className="text-black relative z-10" />
            </motion.div>

            {/* Horizontal Title - Bỏ highlight trang trí vàng */}
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none whitespace-nowrap">
              HỘ CHIẾU <span className="text-teal-500">HỌC TẬP</span>
            </h1>
            
            {/* English Slogan */}
            <p className="text-gray-400 font-sans italic font-bold text-xs md:text-sm mt-3 tracking-wide">
              "Empower Your Journey - The Ultimate Learning Passport"
            </p>
            
            <div className="w-24 h-1 bg-black mx-auto mt-4 rounded-full opacity-20"></div>
          </div>

          {/* Sticky Note Tabs */}
          <div className="flex gap-4 mb-10 relative z-10">
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 py-4 rounded-lg font-black text-xl border-2 border-black transition-all relative
                ${role === 'student' ? 'bg-pink-300 -translate-y-1 shadow-comic' : 'bg-white opacity-40 hover:opacity-100'}
              `}
            >
              Học sinh
              {role === 'student' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-black rounded-full"></div>}
            </button>
            <button 
              onClick={() => setRole('teacher')}
              className={`flex-1 py-4 rounded-lg font-black text-xl border-2 border-black transition-all relative
                ${role === 'teacher' ? 'bg-white/80 -translate-y-1 shadow-comic border-gray-300' : 'bg-white opacity-40 hover:opacity-100'}
              `}
            >
              Giáo viên
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Field: Name */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HỌ VÀ TÊN</label>
                  <div className="flex items-center gap-4 border-b-4 border-black pb-2 group">
                    <User size={24} className="text-gray-300 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black placeholder:text-gray-200 outline-none uppercase"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Field: Class / Password */}
                {role === 'student' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">LỚP</label>
                    <div className="flex items-center gap-4 border-b-4 border-black pb-2 group">
                      <BookOpen size={24} className="text-gray-300 group-focus-within:text-black transition-colors" />
                      <input 
                        type="text"
                        required
                        placeholder="VD: 10A"
                        className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black placeholder:text-gray-200 outline-none uppercase"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">MẬT KHẨU</label>
                    <div className="flex items-center gap-4 border-b-4 border-black pb-2 group">
                      <Lock size={24} className="text-gray-300 group-focus-within:text-black transition-colors" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black placeholder:text-gray-200 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Washi Tape Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-auto mb-6 bg-yellow-400 text-black border-4 border-black font-black text-2xl py-5 rounded-lg shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 relative group"
            >
              {/* Fake tape edges */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-12 bg-yellow-500 rounded-sm opacity-50 group-hover:opacity-10 transition-opacity"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-12 bg-yellow-500 rounded-sm opacity-50 group-hover:opacity-10 transition-opacity"></div>
              
              KHÁM PHÁ NGAY <Play size={24} fill="currentColor" />
            </motion.button>
          </form>

          {/* Notebook Binding Circles Decor */}
          <div className="absolute -left-2 top-1/4 bottom-1/4 flex flex-col justify-around pointer-events-none">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-4 h-4 bg-[#fffdf5] border-2 border-black rounded-full shadow-inner"></div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 flex items-center gap-4 text-gray-400 font-black text-xs uppercase tracking-widest z-10">
        <span className="flex items-center gap-1"><BookOpen size={14}/> GenYou</span>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <span>2024 Passport Edition</span>
      </div>
    </div>
  );
};

const SubjectStamp = ({ text, color, border, top, left, right, bottom, rotate }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 0.6, scale: 1, rotate }}
    whileHover={{ opacity: 1, scale: 1.1 }}
    className={`absolute z-0 pointer-events-none hidden md:flex items-center justify-center`}
    style={{ top, left, right, bottom }}
  >
    <div className={`border-4 ${border} ${color} rounded-full px-4 py-2 font-black text-lg rotate-[-10deg] bg-white/30 backdrop-blur-sm shadow-sm`}>
       <span className="opacity-80 uppercase tracking-widest">{text}</span>
    </div>
  </motion.div>
);

const DoodleItem = ({ Icon, top, left, right, bottom, rotate, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: 0.2, 
      scale: 1,
      y: [0, -10, 0],
      rotate: [rotate, `${parseInt(rotate) + 5}deg`, rotate]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className={`absolute z-0 p-4 pointer-events-none hidden md:block ${color}`}
    style={{ top, left, right, bottom, rotate }}
  >
    <Icon size={80} strokeWidth={1} />
  </motion.div>
);

export default WelcomeScreen;
