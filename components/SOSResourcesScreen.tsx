
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Phone, Heart, Zap, BookOpen, 
  Wind, Clock, Calendar, CheckSquare, Eye,
  Moon, MapPin, Stars, ChevronRight, Info
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

const SOSResourcesScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FDFCF7] p-4 md:p-8 font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto space-y-12 z-10 relative">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border-2 border-gray-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-2xl border-2 border-green-800/10">
                <BookOpen className="text-green-600" size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Tài liệu & Hỗ trợ</h1>
           </div>
           <button 
             onClick={onBack}
             className="flex items-center gap-2 px-8 py-3 bg-white border-4 border-black rounded-xl font-black text-slate-900 shadow-comic hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
           >
              <ArrowLeft size={24} /> Quay lại
           </button>
        </header>

        {/* 1. Hotlines */}
        <section className="space-y-4">
           <h3 className="flex items-center gap-2 text-sm font-black text-red-500 uppercase tracking-widest bg-red-50 w-fit px-4 py-1 rounded-full border border-red-100">
             <Phone size={14} /> ĐƯỜNG DÂY NÓNG (KHẨN CẤP)
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HotlineCard name="Tổng đài Quốc gia bảo vệ Trẻ em" info="Mở cửa 24/7, tư vấn tâm lý, can thiệp khẩn cấp về bạo lực, xâm hại hoặc khủng hoảng tinh thần." number="111" />
              <HotlineCard name="Đường dây Ngày Mai" info="Dự án sơ cứu sức khỏe tinh thần phi lợi nhuận dành cho người trẻ đang gặp khủng hoảng tâm lý." number="096 306 1414" />
              <HotlineCard name="Cửa sổ tình yêu" info="Tư vấn chuyên sâu về sức khỏe sinh sản, giới tính và những rắc rối tâm lý tuổi dậy thì." number="1900 6219" />
           </div>
        </section>

        {/* 2. Study Skills */}
        <section className="space-y-6">
           <h3 className="flex items-center gap-2 text-sm font-black text-green-600 uppercase tracking-widest bg-green-50 w-fit px-4 py-1 rounded-full border border-green-100">
             <BookOpen size={14} /> GÓC KỸ NĂNG HỌC ĐƯỜNG
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailedResourceCard 
                icon={<Eye size={22} className="text-green-600" />} 
                title="Kỹ năng tập trung (Deep Work)" 
                desc="Tạo ra trạng thái 'Dòng chảy' (Flow) để xử lý lượng kiến thức khổng lồ."
                steps={[
                    "Dọn dẹp bàn học: Chỉ để đúng cuốn sách đang học trước mặt.",
                    "Quy tắc 2 phút: Nếu việc gì dưới 2 phút, hãy làm ngay để không gây nặng nề não bộ.",
                    "Tắt thông báo: Để điện thoại ở chế độ 'Không làm phiền' hoặc cất sang phòng khác."
                ]}
                color="bg-[#F0FDF4]"
              />
              <DetailedResourceCard 
                icon={<Clock size={22} className="text-yellow-600" />} 
                title="Ma trận Eisenhower" 
                desc="Cách ưu tiên công việc để không bao giờ bị 'ngập' trong bài tập."
                steps={[
                    "Gấp & Quan trọng: Làm ngay (ví dụ: bài kiểm tra ngày mai).",
                    "Không gấp & Quan trọng: Lên lịch làm (ví dụ: học ngoại ngữ hàng daily).",
                    "Gấp & Không quan trọng: Ủy quyền hoặc làm nhanh (ví dụ: tin nhắn bạn bè).",
                    "Không gấp & Không quan trọng: Bỏ qua (lướt mạng xã hội vô bổ)."
                ]}
                color="bg-[#FFFBEB]"
              />
              <DetailedResourceCard 
                icon={<Calendar size={22} className="text-red-600" />} 
                title="Phương pháp Pomodoro" 
                desc="Bí kíp học lâu không mệt bằng cách chia nhỏ thời gian."
                steps={[
                    "Chọn 1 nhiệm vụ duy nhất: Tập trung hoàn toàn.",
                    "Chu kỳ: Học 25 phút - Nghỉ 5 phút (đi lại, uống nước).",
                    "Sau 4 chu kỳ: Nghỉ dài hơn (15-30 phút).",
                    "Lưu ý: Trong 5 phút nghỉ, TUYỆT ĐỐI không cầm điện thoại."
                ]}
                color="bg-[#FEF2F2]"
              />
              <DetailedResourceCard 
                icon={<Zap size={22} className="text-purple-600" />} 
                title="Ghi nhớ chủ động (Active Recall)" 
                desc="Đừng đọc đi đọc lại, hãy tự kiểm tra chính mình."
                steps={[
                    "Sau khi đọc 1 trang: Gấp sách lại và tự nói ra những ý chính.",
                    "Sử dụng Flashcards: Viết câu hỏi mặt trước, câu trả lời mặt sau.",
                    "Lặp lại ngắt quãng: Ôn lại sau 1 ngày, 3 ngày, 1 tuần và 1 tháng để đưa kiến thức vào trí nhớ dài hạn."
                ]}
                color="bg-[#FAF5FF]"
              />
              <DetailedResourceCard 
                icon={<CheckSquare size={22} className="text-blue-600" />} 
                title="Ghi chú Cornell" 
                desc="Cách ghi chép khoa học giúp ôn thi 'siêu tốc'."
                steps={[
                    "Cột phải (Notes): Ghi nội dung chính trong bài giảng.",
                    "Cột trái (Cues): Đặt câu hỏi hoặc từ khóa gợi nhớ tương ứng.",
                    "Hàng cuối (Summary): Tóm tắt bài học trong 2-3 câu ngắn gọn.",
                    "Khi ôn tập: Che cột phải, chỉ nhìn cột trái và trả lời."
                ]}
                color="bg-[#EFF6FF]"
              />
              <DetailedResourceCard 
                icon={<MapPin size={22} className="text-teal-600" />} 
                title="Kỹ thuật Time-Blocking" 
                desc="Làm chủ quỹ thời gian 24h của bạn."
                steps={[
                    "Chia ngày thành các khối thời gian cố định cho từng việc.",
                    "Dành 'Deep Work block' cho môn khó nhất vào buổi sáng.",
                    "Chừa ra 'Buffer time' (thời gian đệm) 15-30 phút giữa các khối để giải quyết việc phát sinh."
                ]}
                color="bg-[#F0FDFA]"
              />
           </div>
        </section>

        {/* 3. Psychological Tips */}
        <section className="space-y-6">
           <h3 className="flex items-center gap-2 text-sm font-black text-purple-600 uppercase tracking-widest bg-purple-50 w-fit px-4 py-1 rounded-full border border-purple-100">
             <Stars size={14} /> MẸO TÂM LÝ & CÂN BẰNG
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailedResourceCard 
                icon={<Eye size={22} className="text-blue-600" />} 
                title="Kỹ thuật Grounding 5-4-3-2-1" 
                desc="Giảm lo âu tức thì khi bị áp lực hoặc hoảng loạn."
                steps={[
                    "Tìm 5 thứ bạn thấy (cái bút, cái cây...).",
                    "Tìm 4 thứ bạn chạm được (mặt bàn, mái tóc...).",
                    "Tìm 3 âm thanh nghe thấy (tiếng xe, tiếng quạt...).",
                    "Tìm 2 mùi ngửi được (mùi nước hoa, mùi sách...).",
                    "Tìm 1 điều bạn thích ở bản thân."
                ]}
                color="bg-[#F0F9FF]"
              />
              <DetailedResourceCard 
                icon={<BookOpen size={22} className="text-yellow-700" />} 
                title="Viết nhật ký xả stress (Brain Dump)" 
                desc="Làm sạch não bộ bằng cách đưa suy nghĩ lên giấy."
                steps={[
                    "Viết tự do: Đừng quan tâm ngữ pháp, hãy viết hết những gì đang lo lắng.",
                    "Hỏi 'Tại sao?': Đào sâu căn nguyên của nỗi buồn để hiểu mình hơn.",
                    "Viết 3 điều biết ơn: Mỗi ngày tìm 3 việc nhỏ khiến bạn mỉm cười để cài đặt lại tư duy tích cực."
                ]}
                color="bg-[#FFFDF2]"
              />
              <DetailedResourceCard 
                icon={<Wind size={22} className="text-red-600" />} 
                title="Cai nghiện Dopamine độc hại" 
                desc="Giúp não bộ lấy lại sự tập trung và niềm vui thực sự."
                steps={[
                    "Hạn chế Tiktok/Shorts: Những video ngắn làm giảm khả năng tập trung lâu dài.",
                    "Quy tắc 30 phút: Không chạm điện thoại trong 30 phút đầu tiên khi thức dậy.",
                    "Thay thế: Đọc 5 trang sách hoặc nghe nhạc nhẹ thay vì lướt Feed vô định."
                ]}
                color="bg-[#FFF1F2]"
              />
              <DetailedResourceCard 
                icon={<Moon size={22} className="text-indigo-600" />} 
                title="Vệ sinh giấc ngủ" 
                desc="Giấc ngủ ngon là chìa khóa của một trí nhớ siêu đẳng."
                steps={[
                    "Digital Detox: Tắt mọi màn hình 30-60 phút trước khi ngủ.",
                    "Giờ cố định: Đi ngủ và thức dậy cùng một giờ mỗi ngày.",
                    "Nhiệt độ: Giữ phòng thoáng mát và tối hoàn toàn để cơ thể tiết Melatonin tự nhiên."
                ]}
                color="bg-[#EEF2FF]"
              />
              <DetailedResourceCard 
                icon={<Zap size={22} className="text-green-600" />} 
                title="Chuyển động chữa lành" 
                desc="Cơ thể vận động, tâm trí sẽ nhẹ nhõm."
                steps={[
                    "Vươn vai 2 phút: Sau mỗi giờ học để lưu thông máu não.",
                    "Đi bộ nhẹ nhàng: 15-20 phút buổi chiều giúp xả stress cực tốt.",
                    "Tập hít thở bụng: Hít sâu 4s - Giữ 4s - Thở ra 4s để hạ nhịp tim khi căng thẳng."
                ]}
                color="bg-[#F0FDF4]"
              />
              <DetailedResourceCard 
                icon={<Heart size={22} className="text-pink-600" />} 
                title="Tự trắc ẩn (Self-Compassion)" 
                desc="Đừng là 'kẻ thù' lớn nhất của chính mình."
                steps={[
                    "Ngừng so sánh: Cuộc đời mỗi người là một đường chạy riêng biệt.",
                    "Chấp nhận sai lầm: Coi lỗi sai là dữ liệu để học tập, không phải bằng chứng của sự kém cỏi.",
                    "Lời nói tích cực: Hãy nói với mình những lời động viên giống như bạn đang an ủi người bạn thân nhất."
                ]}
                color="bg-[#FFF5F7]"
              />
           </div>
        </section>

        {/* 4. Messages from SOS Mood */}
        <section className="bg-purple-600 rounded-[2.5rem] p-8 md:p-12 border-4 border-black shadow-comic relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
             <Heart size={160} fill="white" />
           </div>
           <h3 className="flex items-center gap-2 text-white font-black text-2xl mb-8 tracking-tight">
             <Heart size={32} fill="white" /> Lời nhắn gửi từ SOS Mood
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MessageBubble text="Đừng giữ trong lòng. Một nỗi buồn được chia sẻ là một nỗi buồn vơi đi một nửa. Bạn không cô đơn đâu!" icon={<Zap size={18} />} />
              <MessageBubble text="Kết quả bài thi quan trọng, nhưng sức khỏe tinh thần của bạn còn quan trọng hơn ngàn lần. Hãy nghỉ ngơi nếu thấy mệt nhé." icon={<Moon size={18} />} />
              <MessageBubble text="Mọi áp lực hiện tại chỉ là một chương nhỏ trong cuốn sách cuộc đời bạn. Đừng để nó làm bạn nản lòng." icon={<Wind size={18} />} />
              <MessageBubble text="Bạn luôn có giá trị riêng biệt. Đừng để bất kỳ ai hay bất kỳ chỉ số nào định nghĩa giới hạn của bạn." icon={<Stars size={18} />} />
           </div>
        </section>

        <footer className="py-8 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
            GenYou Wellness Resources • 2024 Edition
        </footer>
      </div>
    </div>
  );
};

const HotlineCard = ({ name, info, number }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white border-2 border-red-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
  >
     <div className="absolute top-[-10px] right-[-10px] bg-red-50 w-20 h-20 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
     <div className="relative z-10">
        <h4 className="font-black text-gray-800 text-lg mb-2 leading-tight">{name}</h4>
        <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">{info}</p>
     </div>
     <div className="flex items-center justify-between mt-auto pt-4 border-t border-red-50 relative z-10">
        <div className="flex items-center gap-2 text-red-500">
           <Phone size={18} strokeWidth={3} />
           <span className="text-2xl font-black">{number}</span>
        </div>
        <a href={`tel:${number}`} className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-red-600 transition-colors shadow-sm">
           GỌI NGAY
        </a>
     </div>
  </motion.div>
);

const DetailedResourceCard = ({ icon, title, desc, steps, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${color} border-2 border-black/5 p-6 rounded-[2.2rem] space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden group h-full flex flex-col`}
  >
     <div className="bg-white p-3 rounded-2xl border-2 border-black/5 w-fit shadow-sm group-hover:rotate-6 transition-transform">
       {icon}
     </div>
     <div className="space-y-2">
        <h4 className="font-black text-gray-800 text-lg leading-tight">{title}</h4>
        <p className="text-xs font-bold text-gray-400 leading-relaxed">{desc}</p>
     </div>
     
     <div className="mt-4 space-y-3 flex-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/50 w-fit px-2 py-0.5 rounded-md">
            <Info size={10} /> Hướng dẫn thực hành
        </div>
        <ul className="space-y-2">
            {steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-2 text-xs font-bold text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-black/10 rounded-full mt-1.5 shrink-0"></span>
                    <span>{step}</span>
                </li>
            ))}
        </ul>
     </div>
     
     <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {icon}
     </div>
  </motion.div>
);

const MessageBubble = ({ text, icon }: any) => (
  <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/20 transition-all group">
     <div className="text-white mt-1 group-hover:scale-125 transition-transform">{icon}</div>
     <p className="text-white text-sm font-bold leading-relaxed">{text}</p>
  </div>
);

export default SOSResourcesScreen;
