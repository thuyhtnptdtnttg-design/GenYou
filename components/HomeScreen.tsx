
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CheckCircle2, Circle, Map, Star, 
  Heart, Zap, LayoutGrid, Coffee, Bell,
  ChevronRight, Trash2, Quote, Search,
  Compass, Lightbulb, Repeat, Mic2, BookOpenCheck,
  Pin, UserCircle, Smile
} from 'lucide-react';
import GenYouBot from './GenYouBot';

interface Props {
  studentName: string;
  studentGrade: string;
  onSelectGenYou: () => void;
  onSelectChill: () => void;
  onSelectSOS: () => void;
  onSelectStudyHub: () => void;
  onSelectBrainCandy: () => void;
  onSelectPassport: () => void;
  onLogout: () => void;
}

interface ToDoItem { id: string; text: string; time: string; completed: boolean; }
interface LearningJourneyTask { id: string; method: string; task: string; color: string; icon: React.ReactNode; desc: string; }

const LEARNING_JOURNEY_SUGGESTIONS: LearningJourneyTask[] = [
  { id: 'suggest-1', method: 'Pomodoro', task: 'Học 25p - Nghỉ 5p (4 chu kỳ)', color: 'bg-rose-100', icon: <Coffee size={18} className="text-rose-600" />, desc: 'Tăng cường sự tập trung sâu, tránh mệt mỏi.' },
  { id: 'suggest-2', method: 'FEYNMAN', task: 'Tự giảng lại kiến thức vừa học', color: 'bg-amber-100', icon: <Mic2 size={18} className="text-amber-600" />, desc: 'Phương pháp giảng giải để hiểu sâu vấn đề.' },
  { id: 'suggest-3', method: 'ACTIVE RECALL', task: 'Tự kiểm tra 10 câu hỏi không nhìn sách', color: 'bg-emerald-100', icon: <BookOpenCheck size={18} className="text-emerald-600" />, desc: 'Ép não bộ truy xuất thông tin để nhớ lâu hơn.' },
  { id: 'suggest-4', method: 'SPACED REPETITION', task: 'Ôn lại kiến thức sau 1 ngày, 3 ngày, 7 ngày và 14 ngày', color: 'bg-blue-100', icon: <Repeat size={18} className="text-blue-600" />, desc: 'Chống lại đường cong lãng quên của não bộ.' }
];

const HomeScreen: React.FC<Props> = ({ studentName, studentGrade, onSelectGenYou, onSelectChill, onSelectSOS, onSelectStudyHub, onSelectBrainCandy, onSelectPassport, onLogout }) => {
  const [todos, setTodos] = useState<ToDoItem[]>([
    { id: '1', text: 'Hoàn thành bài tập Toán', time: '14:00', completed: false },
    { id: '2', text: 'Luyện nghe tiếng Anh 15p', time: '16:00', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const item: ToDoItem = { id: Date.now().toString(), text: newTodo, time: timeStr, completed: false };
    setTodos([item, ...todos]);
    setNewTodo('');
  };

  const addSuggestedTask = (taskText: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const item: ToDoItem = { id: Date.now().toString(), text: taskText, time: timeStr, completed: false };
    setTodos([item, ...todos]);
  };

  const toggleTodo = (id: string) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const removeTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  return (
    <div className="min-h-screen bg-[#fffdf5] font-hand p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-6xl z-10 space-y-6">
        
        <header className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
             <button onClick={onSelectPassport} className="w-12 h-12 rounded-xl border-4 border-black bg-black flex items-center justify-center shadow-comic-hover hover:scale-105 transition-all">
                <Smile size={28} className="text-yellow-400" />
             </button>
             <div>
                <h1 className="text-2xl md:text-3xl font-black text-ink leading-tight">Xin chào!</h1>
             </div>
          </div>
        </header>

        <motion.div 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-[#FFF490] border-4 border-black p-8 rounded-[2rem] shadow-comic relative overflow-hidden flex flex-col items-center text-center group cursor-default"
        >
          <div className="absolute top-4 right-4 text-red-500 group-hover:scale-125 transition-transform animate-bounce-slow z-20">
            <Bell size={26} fill="currentColor" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-black"></div>
          </div>
          <div className="bg-white/30 p-2 rounded-full mb-2"><Quote className="text-yellow-700 opacity-40" size={24} /></div>
          <h2 className="text-xl md:text-2xl font-black text-ink max-w-4xl leading-tight">
            "Đừng đợi ai trao cho bạn tấm hộ chiếu để đi. Tấm hộ chiếu của bạn chính là sự chuẩn bị, kiến thức và lòng dũng cảm để tự mở ra thế giới."
          </h2>
          <div className="absolute top-[-5px] right-14 text-red-600 rotate-[15deg] drop-shadow-md z-20"><Pin size={32} fill="currentColor" /></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-black text-ink uppercase tracking-tight"><CheckCircle2 size={20} className="text-blue-500" /> TO-DO LIST</h3>
              <div className="bg-white border-4 border-black rounded-[2rem] shadow-comic overflow-hidden">
                <form onSubmit={addTodo} className="p-4 flex gap-3 border-b-2 border-gray-100 bg-gray-50/50">
                  <div className="flex-1 flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 focus-within:border-black transition-colors">
                     <Search size={18} className="text-gray-300" />
                     <input type="text" placeholder="Thêm việc cần làm..." className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:text-gray-300 outline-none" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                  </div>
                  <button type="submit" className="bg-purple-600 text-white w-12 h-12 flex items-center justify-center rounded-xl border-2 border-black shadow-comic-hover transition-all"><Plus size={24} /></button>
                </form>
                <div className="p-6 space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {todos.length > 0 ? todos.map(todo => (
                      <motion.div key={todo.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTodo(todo.id)}>
                          <div className={`transition-colors ${todo.completed ? 'text-green-500' : 'text-gray-200 group-hover:text-gray-400'}`}>
                             {todo.completed ? <CheckCircle2 size={26} /> : <Circle size={26} strokeWidth={2.5} />}
                          </div>
                          <div>
                            <p className={`text-xl font-bold transition-all ${todo.completed ? 'line-through text-gray-300 italic' : 'text-ink'}`}>{todo.text}</p>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{todo.time}</span>
                          </div>
                        </div>
                        <button onClick={() => removeTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                      </motion.div>
                    )) : <div className="py-10 text-center text-gray-300 font-bold uppercase tracking-widest text-sm">Chưa có đầu việc nào hôm nay!</div>}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="flex items-center gap-2 text-xl font-black text-ink uppercase tracking-tight"><Compass size={20} className="text-rose-500" /> HÀNH TRÌNH HỌC TẬP HÔM NAY</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-sm">Đề xuất bởi AI</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {LEARNING_JOURNEY_SUGGESTIONS.map((item, idx) => (
                   <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`${item.color} border-4 border-black rounded-[2rem] p-5 shadow-comic flex flex-col gap-3 relative overflow-hidden group`}>
                      <div className="flex justify-between items-start z-10">
                         <div className="flex items-center gap-2">
                            <div className="bg-white p-2 rounded-xl border-2 border-black shadow-sm group-hover:rotate-6 transition-transform">{item.icon}</div>
                            <span className="font-black text-xs uppercase tracking-wider text-slate-700">{item.method}</span>
                         </div>
                         <button onClick={() => addSuggestedTask(`${item.method}: ${item.task}`)} className="bg-white border-2 border-black p-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-comic-hover active:scale-90"><Plus size={16} /></button>
                      </div>
                      <div className="z-10">
                         <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{item.task}</h4>
                         <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{item.desc}</p>
                      </div>
                      <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition-transform pointer-events-none"><Lightbulb size={80} /></div>
                   </motion.div>
                 ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-black text-ink uppercase tracking-tight px-2"><Zap size={20} className="text-yellow-500" /> KHÁM PHÁ</h3>
              <div className="grid grid-cols-2 gap-4">
                <DiscoveryCard onClick={onSelectGenYou} title="GenYou" color="bg-purple-100" icon={<Star size={18} fill="currentColor" />} delay={0} />
                <DiscoveryCard onClick={onSelectSOS} title="SOS Mood" color="bg-blue-100" icon={<Heart size={18} fill="currentColor" />} delay={0.1} />
                <DiscoveryCard onClick={onSelectBrainCandy} title="BrainCandy" color="bg-pink-100" icon={<Zap size={18} fill="currentColor" />} badge="Mới" delay={0.2} />
                <DiscoveryCard onClick={onSelectStudyHub} title="StudyHub" color="bg-green-100" icon={<LayoutGrid size={18} />} delay={0.3} />
              </div>
            </section>
            <motion.button whileHover={{ scale: 1.05, rotate: -1.5 }} whileTap={{ scale: 0.95 }} onClick={onSelectChill} className="w-full bg-[#B2EBF2] border-4 border-black rounded-[2.2rem] p-6 shadow-comic text-left relative overflow-hidden group h-32 flex flex-col justify-center">
              <h3 className="text-2xl font-black text-cyan-900 leading-none">Chill Zone</h3>
              <p className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.2em] mt-1">RELAX & RECHARGE</p>
              <div className="absolute right-[-10px] bottom-[-10px] text-cyan-300 opacity-20 rotate-[-15deg] group-hover:rotate-0 transition-transform"><Coffee size={90} /></div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscoveryCard = ({ onClick, title, color, icon, badge, delay }: any) => (
  <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05, rotate: 2, y: -10, boxShadow: "0px 10px 0px 0px rgba(0,0,0,1)" }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`${color} border-4 border-black rounded-[2.2rem] p-5 shadow-comic hover:shadow-none transition-all text-left flex flex-col justify-between aspect-square relative overflow-hidden group`}>
    <div className="bg-white p-3 rounded-2xl border-2 border-black w-fit text-ink shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-xl font-black text-ink leading-tight">{title}</span>
    {badge && <div className="absolute top-2 right-2 bg-pink-300 border-2 border-black px-2 py-0.5 rounded-lg text-[7px] font-black rotate-[-8deg] shadow-sm animate-pulse">{badge}</div>}
  </motion.button>
);

export default HomeScreen;
