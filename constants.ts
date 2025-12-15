
import { Question, MBTIProfile, HollandQuestion, HollandProfile, IQQuestion, EQQuestion, DISCQuestion, DISCProfile } from './types';

// Updated to be short, blunt, and casual
export const QUESTIONS: Question[] = [
  // E vs I (1-5)
  { id: 1, textA: "Teamwork", textB: "Solo", category: 'EI' },
  { id: 2, textA: "Tụ tập", textB: "Ở nhà", category: 'EI' },
  { id: 3, textA: "Nói luôn", textB: "Nghĩ kỹ", category: 'EI' },
  { id: 4, textA: "Rõ ràng", textB: "Bay bổng", category: 'EI' }, 
  { id: 5, textA: "Chi tiết", textB: "Đại khái", category: 'EI' }, 

  // S vs N (6-10)
  { id: 6, textA: "Thực tế", textB: "Lý thuyết", category: 'SN' },
  { id: 7, textA: "Dùng não", textB: "Dùng tim", category: 'SN' },
  { id: 8, textA: "Thẳng thắn", textB: "Khéo léo", category: 'SN' },
  { id: 9, textA: "Công bằng", textB: "Tình cảm", category: 'SN' },
  { id: 10, textA: "Chốt lịch", textB: "Tùy hứng", category: 'SN' },

  // T vs F (11-15)
  { id: 11, textA: "Xong sớm", textB: "Để mai", category: 'TF' },
  { id: 12, textA: "Gọn gàng", textB: "Bừa bộn", category: 'TF' },
  { id: 13, textA: "Ồn ào", textB: "Yên tĩnh", category: 'TF' },
  { id: 14, textA: "Kết quả", textB: "Cảm xúc", category: 'TF' },
  { id: 15, textA: "Quen thuộc", textB: "Mới lạ", category: 'TF' },

  // J vs P (16-20)
  { id: 16, textA: "Từng bước", textB: "Ngẫu hứng", category: 'JP' },
  { id: 17, textA: "Nói nhiều", textB: "Quan sát", category: 'JP' },
  { id: 18, textA: "Logic", textB: "Lắng nghe", category: 'JP' },
  { id: 19, textA: "Cố định", textB: "Thay đổi", category: 'JP' },
  { id: 20, textA: "Quy tắc", textB: "Phá cách", category: 'JP' },
];

export const getCategoryByindex = (index: number): 'EI' | 'SN' | 'TF' | 'JP' => {
  if (index < 5) return 'EI';
  if (index < 10) return 'SN';
  if (index < 15) return 'TF';
  return 'JP';
};

export const MBTI_PROFILES: Record<string, MBTIProfile> = {
  ISTJ: { type: 'ISTJ', name: 'Thanh niên nghiêm túc', description: ['Trách nhiệm', 'Thực tế', 'Chuẩn chỉ'], color: 'bg-blue-200', icon: '📋' },
  ISFJ: { type: 'ISFJ', name: 'Bảo mẫu quốc dân', description: ['Tận tâm', 'Chi tiết', 'Tình cảm'], color: 'bg-yellow-200', icon: '🛡️' },
  INFJ: { type: 'INFJ', name: 'Trùm tiên tri', description: ['Sâu sắc', 'Dị', 'Thấu hiểu'], color: 'bg-green-200', icon: '🧙' },
  INTJ: { type: 'INTJ', name: 'Bộ não thiên tài', description: ['Độc lập', 'Lạnh lùng', 'Tầm nhìn'], color: 'bg-purple-200', icon: '♟️' },
  ISTP: { type: 'ISTP', name: 'Dân chơi hệ kỹ thuật', description: ['Linh hoạt', 'Ngầu', 'Khéo léo'], color: 'bg-red-200', icon: '🛠️' },
  ISFP: { type: 'ISFP', name: 'Nghệ sĩ mộng mơ', description: ['Nhẹ nhàng', 'Tinh tế', 'Chill'], color: 'bg-orange-200', icon: '🎨' },
  INFP: { type: 'INFP', name: 'Em bé nhạy cảm', description: ['Lý tưởng', 'Bay bổng', 'Dễ khóc'], color: 'bg-pink-200', icon: '🍃' },
  INTP: { type: 'INTP', name: 'Giáo sư biết tuốt', description: ['Phân tích', 'Tò mò', 'Nerd'], color: 'bg-indigo-200', icon: '🧪' },
  ESTP: { type: 'ESTP', name: 'Ông hoàng hành động', description: ['Năng động', 'Thực dụng', 'Liều'], color: 'bg-red-300', icon: '🚀' },
  ESFP: { type: 'ESFP', name: 'Siêu sao tiệc tùng', description: ['Vui vẻ', 'Nhiệt tình', 'Hề hước'], color: 'bg-orange-300', icon: '🎉' },
  ENFP: { type: 'ENFP', name: 'Vitamin vui vẻ', description: ['Sôi nổi', 'Sáng tạo', 'Hòa đồng'], color: 'bg-green-300', icon: '🦄' },
  ENTP: { type: 'ENTP', name: 'Chúa tể cãi cùn', description: ['Thông minh', 'Linh hoạt', 'Thẳng tính'], color: 'bg-indigo-300', icon: '💡' },
  ESTJ: { type: 'ESTJ', name: 'Lớp trưởng gương mẫu', description: ['Quyết đoán', 'Hệ thống', 'Hiệu quả'], color: 'bg-blue-300', icon: '⚖️' },
  ESFJ: { type: 'ESFJ', name: 'Hoa hậu thân thiện', description: ['Hòa đồng', 'Chu đáo', 'Trách nhiệm'], color: 'bg-yellow-300', icon: '🤝' },
  ENFJ: { type: 'ENFJ', name: 'Thủ lĩnh tinh thần', description: ['Cuốn hút', 'Thấu cảm', 'Lãnh đạo'], color: 'bg-green-400', icon: '🌟' },
  ENTJ: { type: 'ENTJ', name: 'Tổng tài bá đạo', description: ['Quyết liệt', 'Chiến lược', 'Sếp'], color: 'bg-purple-300', icon: '👔' },
};

// --- HOLLAND CODE DATA ---

export const RIASEC_PROFILES: Record<string, HollandProfile> = {
  R: { code: 'R', name: 'Kỹ Thuật (Realistic)', description: 'Thích làm việc với đồ vật, máy móc, công cụ, cây cối, con vật. Thích vận động, làm việc ngoài trời.', jobs: ['Kỹ sư cơ khí', 'Kiến trúc sư', 'Nông lâm nghiệp', 'Công an/Quân đội', 'Vận hành máy'], color: '#f87171', icon: '🔧' },
  I: { code: 'I', name: 'Nghiên Cứu (Investigative)', description: 'Thích quan sát, tìm tòi, phân tích, đánh giá và giải quyết các vấn đề thông qua suy nghĩ, nghiên cứu.', jobs: ['Lập trình viên', 'Dược sĩ', 'Bác sĩ', 'Nhà nghiên cứu', 'Chuyên gia phân tích'], color: '#60a5fa', icon: '🔬' },
  A: { code: 'A', name: 'Nghệ Thuật (Artistic)', description: 'Có khả năng nghệ thuật, trực giác mạnh, thích làm việc trong các tình huống không có kế hoạch, dùng trí tưởng tượng.', jobs: ['Thiết kế đồ họa', 'Nhà văn/Biên kịch', 'Diễn viên', 'Kiến trúc sư', 'Truyền thông đa phương tiện'], color: '#c084fc', icon: '🎨' },
  S: { code: 'S', name: 'Xã Hội (Social)', description: 'Thích làm việc với con người để soi sáng, thông tin, giải thích, giúp đỡ, chữa trị hoặc huấn luyện.', jobs: ['Giáo viên', 'Tư vấn tâm lý', 'Hướng dẫn viên', 'Y tá/Điều dưỡng', 'Công tác xã hội'], color: '#fb923c', icon: '🤝' },
  E: { code: 'E', name: 'Quản Lý (Enterprising)', description: 'Thích làm việc với con người để tác động, thuyết phục, lãnh đạo hoặc quản lý vì mục tiêu tổ chức, lợi ích kinh tế.', jobs: ['Kinh doanh', 'Marketing', 'Luật sư', 'Quản lý nhân sự', 'CEO/Startup'], color: '#facc15', icon: '💼' },
  C: { code: 'C', name: 'Nghiệp Vụ (Conventional)', description: 'Thích làm việc với dữ liệu, con số, có khả năng làm việc văn phòng, thống kê, thực hiện các công việc chi tiết, tỉ mỉ.', jobs: ['Kế toán/Kiểm toán', 'Thủ thư', 'Hành chính nhân sự', 'Ngân hàng', 'Biên tập viên'], color: '#2dd4bf', icon: '📊' },
};

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  // R - Realistic (1-10)
  { id: 1, text: "Thích sửa chữa các thiết bị điện, cơ khí", category: 'R' },
  { id: 2, text: "Thích làm việc với máy móc, dụng cụ cầm tay", category: 'R' },
  { id: 3, text: "Thích các hoạt động ngoài trời, vận động", category: 'R' },
  { id: 4, text: "Thích trồng cây, chăm sóc vật nuôi", category: 'R' },
  { id: 5, text: "Giỏi các môn thủ công, kỹ thuật", category: 'R' },
  { id: 6, text: "Thích mày mò lắp ráp mô hình", category: 'R' },
  { id: 7, text: "Thích công việc có kết quả cụ thể nhìn thấy được", category: 'R' },
  { id: 8, text: "Không ngại lấm bẩn khi làm việc", category: 'R' },
  { id: 9, text: "Thích lái xe hoặc vận hành thiết bị", category: 'R' },
  { id: 10, text: "Thực tế, ít mơ mộng", category: 'R' },

  // I - Investigative (11-20)
  { id: 11, text: "Thích giải các bài toán khó", category: 'I' },
  { id: 12, text: "Thích tìm hiểu nguyên lý hoạt động của mọi thứ", category: 'I' },
  { id: 13, text: "Thích đọc sách khoa học, nghiên cứu", category: 'I' },
  { id: 14, text: "Giỏi phân tích số liệu, logic", category: 'I' },
  { id: 15, text: "Thích làm thí nghiệm", category: 'I' },
  { id: 16, text: "Thường đặt câu hỏi 'Tại sao?'", category: 'I' },
  { id: 17, text: "Thích giải quyết các vấn đề phức tạp", category: 'I' },
  { id: 18, text: "Thích suy luận, tư duy trừu tượng", category: 'I' },
  { id: 19, text: "Thích đánh giá, phê bình dựa trên lý trí", category: 'I' },
  { id: 20, text: "Có khả năng tập trung cao độ vào nghiên cứu", category: 'I' },

  // A - Artistic (21-30)
  { id: 21, text: "Thích vẽ, thiết kế, trang trí", category: 'A' },
  { id: 22, text: "Thích viết lách, sáng tác thơ văn", category: 'A' },
  { id: 23, text: "Thích chơi nhạc cụ hoặc ca hát", category: 'A' },
  { id: 24, text: "Thích sự tự do, không gò bó", category: 'A' },
  { id: 25, text: "Có trí tưởng tượng phong phú", category: 'A' },
  { id: 26, text: "Thích đi xem triển lãm, nghệ thuật", category: 'A' },
  { id: 27, text: "Thường có những ý tưởng độc đáo, khác biệt", category: 'A' },
  { id: 28, text: "Nhạy cảm, giàu cảm xúc", category: 'A' },
  { id: 29, text: "Thích thể hiện cá tính riêng", category: 'A' },
  { id: 30, text: "Thích chụp ảnh, quay phim sáng tạo", category: 'A' },

  // S - Social (31-40)
  { id: 31, text: "Thích giúp đỡ người khác", category: 'S' },
  { id: 32, text: "Thích lắng nghe tâm sự của bạn bè", category: 'S' },
  { id: 33, text: "Thích tham gia các hoạt động tình nguyện", category: 'S' },
  { id: 34, text: "Giỏi giao tiếp, kết nối mọi người", category: 'S' },
  { id: 35, text: "Thích dạy học, hướng dẫn người khác", category: 'S' },
  { id: 36, text: "Quan tâm đến cảm xúc của người xung quanh", category: 'S' },
  { id: 37, text: "Thích làm việc nhóm hơn làm một mình", category: 'S' },
  { id: 38, text: "Thân thiện, hòa đồng", category: 'S' },
  { id: 39, text: "Thích giải quyết mâu thuẫn giữa mọi người", category: 'S' },
  { id: 40, text: "Thích các công việc phục vụ cộng đồng", category: 'S' },

  // E - Enterprising (41-50)
  { id: 41, text: "Thích làm lãnh đạo, chỉ huy", category: 'E' },
  { id: 42, text: "Thích thuyết phục người khác theo ý mình", category: 'E' },
  { id: 43, text: "Thích kinh doanh, buôn bán", category: 'E' },
  { id: 44, text: "Dám chấp nhận rủi ro để đạt mục tiêu", category: 'E' },
  { id: 45, text: "Thích sự cạnh tranh, thi đua", category: 'E' },
  { id: 46, text: "Có tham vọng, muốn thăng tiến", category: 'E' },
  { id: 47, text: "Giỏi đàm phán, thương lượng", category: 'E' },
  { id: 48, text: "Thích khởi xướng các dự án mới", category: 'E' },
  { id: 49, text: "Năng động, tự tin trước đám đông", category: 'E' },
  { id: 50, text: "Quan tâm đến lợi ích kinh tế, hiệu quả", category: 'E' },

  // C - Conventional (51-60)
  { id: 51, text: "Thích sự ngăn nắp, trật tự", category: 'C' },
  { id: 52, text: "Thích làm việc với các con số, dữ liệu", category: 'C' },
  { id: 53, text: "Làm việc cẩn thận, tỉ mỉ từng chi tiết", category: 'C' },
  { id: 54, text: "Thích tuân thủ các quy tắc, quy trình", category: 'C' },
  { id: 55, text: "Giỏi sắp xếp hồ sơ, tài liệu", category: 'C' },
  { id: 56, text: "Thích công việc ổn định, rõ ràng", category: 'C' },
  { id: 57, text: "Thường lập kế hoạch chi tiết trước khi làm", category: 'C' },
  { id: 58, text: "Có trách nhiệm cao với công việc được giao", category: 'C' },
  { id: 59, text: "Thích kiểm tra, rà soát lỗi sai", category: 'C' },
  { id: 60, text: "Không thích sự thay đổi đột ngột", category: 'C' },
];

// --- IQ TEST DATA ---

export const IQ_QUESTIONS: IQQuestion[] = [
  { 
    id: 1, 
    text: "Số tiếp theo trong dãy là gì: 2, 4, 8, 16, ...?", 
    options: ["24", "32", "40", "64"], 
    correctAnswer: "32", 
    category: "Math" 
  },
  { 
    id: 2, 
    text: "Ngón tay đối với Bàn tay thì Ngón chân đối với ...?", 
    options: ["Đầu gối", "Bàn chân", "Gót chân", "Mắt cá"], 
    correctAnswer: "Bàn chân", 
    category: "Logic" 
  },
  { 
    id: 3, 
    text: "Tìm từ khác loại: Chó, Mèo, Chuột hamster, Cá mập", 
    options: ["Chó", "Mèo", "Chuột hamster", "Cá mập"], 
    correctAnswer: "Cá mập", 
    category: "Logic" 
  },
  { 
    id: 4, 
    text: "Nếu 3 cây bút giá 15.000đ, thì 1 cây giá bao nhiêu?", 
    options: ["3.000đ", "5.000đ", "6.000đ", "10.000đ"], 
    correctAnswer: "5.000đ", 
    category: "Math" 
  },
  { 
    id: 5, 
    text: "Chữ cái tiếp theo: A, C, E, G, ...?", 
    options: ["H", "I", "K", "L"], 
    correctAnswer: "I", 
    category: "Logic" 
  },
  { 
    id: 6, 
    text: "Sắp xếp chữ cái: G-Ó-N-B-Đ-Á thành từ có nghĩa", 
    options: ["Đá bóng", "Bóng đá", "Đóng bà", "Bà đóng"], 
    correctAnswer: "Bóng đá", 
    category: "Logic" 
  },
  { 
    id: 7, 
    text: "Hình nào KHÁC BIỆT: △ , ◇ , ○ , □ , ▽", 
    options: ["△", "◇", "○", "□"], 
    correctAnswer: "○", 
    category: "Spatial" 
  },
  { 
    id: 8, 
    text: "Sáng đối với Tối thì Nóng đối với ...?", 
    options: ["Ấm", "Lạnh", "Mát", "Khô"], 
    correctAnswer: "Lạnh", 
    category: "Logic" 
  },
  { 
    id: 9, 
    text: "Điền vào chỗ trống: ▲ , ▶ , ▼ , ◀ , ▲ , ?", 
    options: ["▲", "▼", "◀", "▶"], 
    correctAnswer: "▶", 
    category: "Spatial" 
  },
  { 
    id: 10, 
    text: "Quy luật quay: ► , ▼ , ◄ , ?", 
    options: ["▲", "▼", "►", "●"], 
    correctAnswer: "▲", 
    category: "Spatial" 
  },
  { 
    id: 11, 
    text: "Số nào không thuộc dãy: 3, 6, 9, 11, 15", 
    options: ["6", "9", "11", "15"], 
    correctAnswer: "11", 
    category: "Math" 
  },
  { 
    id: 12, 
    text: "Tất cả Mèo đều sợ Chó. Mun là Mèo. Vậy...", 
    options: ["Mun thích Chó", "Mun sợ Chó", "Mun là Chó", "Chó sợ Mun"], 
    correctAnswer: "Mun sợ Chó", 
    category: "Logic" 
  },
  { 
    id: 13, 
    text: "1, 1, 2, 3, 5, 8, ... Số tiếp theo?", 
    options: ["11", "12", "13", "14"], 
    correctAnswer: "13", 
    category: "Math" 
  },
  { 
    id: 14, 
    text: "Tìm hình còn thiếu trong quy luật: ⚪⚫ -> ⚫⚪ ; ⬛⬜ -> ?", 
    options: ["⬛⬜", "⬜⬛", "⬛⬛", "⬜⬜"], 
    correctAnswer: "⬜⬛", 
    category: "Spatial" 
  },
];

export const getIQClassification = (score: number) => {
  if (score <= 4) return { label: 'IQ Thấp', desc: 'Cần cố gắng rèn luyện tư duy thêm nhé!' };
  if (score <= 7) return { label: 'IQ Trung Bình', desc: 'Mức độ tư duy phổ biến, cố lên!' };
  if (score <= 10) return { label: 'IQ Khá', desc: 'Bạn có tư duy logic rất tốt!' };
  if (score <= 12) return { label: 'IQ Tốt', desc: 'Tuyệt vời! Bạn rất thông minh.' };
  return { label: 'IQ Rất Cao', desc: 'Thiên tài! Tư duy vượt trội.' };
};

// --- EQ TEST DATA ---

export const EQ_QUESTIONS: EQQuestion[] = [
  // 1. Self-Awareness (Câu 1-2)
  { id: 1, text: "Tôi nhận ra cảm xúc của mình khi vui, buồn hoặc tức giận.", category: "SelfAwareness" },
  { id: 2, text: "Tôi hiểu nguyên nhân khiến mình cảm thấy khó chịu hoặc thất vọng.", category: "SelfAwareness" },
  
  // 2. Self-Management (Câu 3-4)
  { id: 3, text: "Tôi có thể giữ bình tĩnh khi gặp tình huống khó khăn.", category: "SelfManagement" },
  { id: 4, text: "Tôi biết cách kiềm chế hành vi nóng giận hoặc bốc đồng.", category: "SelfManagement" },

  // 3. Social Awareness (Câu 5-6)
  { id: 5, text: "Tôi dễ nhận biết cảm xúc của người khác qua nét mặt, lời nói hoặc cử chỉ.", category: "SocialAwareness" },
  { id: 6, text: "Tôi có thể hiểu quan điểm và cảm xúc của bạn bè, thầy cô.", category: "SocialAwareness" },

  // 4. Relationship Skills (Câu 7-9)
  { id: 7, text: "Tôi biết cách giải quyết mâu thuẫn với bạn bè hoặc nhóm.", category: "RelationshipSkills" },
  { id: 8, text: "Tôi có thể giao tiếp rõ ràng để người khác hiểu ý mình.", category: "RelationshipSkills" },
  { id: 9, text: "Tôi biết cách thuyết phục người khác một cách khéo léo.", category: "RelationshipSkills" },

  // 5. Self-Motivation (Câu 10-14)
  { id: 10, text: "Tôi đặt mục tiêu và cố gắng hoàn thành chúng.", category: "SelfMotivation" },
  { id: 11, text: "Tôi có thể vượt qua thất bại mà không bỏ cuộc.", category: "SelfMotivation" },
  { id: 12, text: "Tôi luôn tìm cách học hỏi và phát triển bản thân.", category: "SelfMotivation" },
  { id: 13, text: "Tôi hứng thú với việc thử thách bản thân và đạt kết quả tốt.", category: "SelfMotivation" },
  { id: 14, text: "Tôi luôn cố gắng hoàn thiện bản thân mỗi ngày.", category: "SelfMotivation" },
];

export const getEQClassification = (score: number) => {
  if (score >= 60) return { label: 'EQ Xuất Sắc', desc: 'Bạn có trí tuệ cảm xúc tuyệt vời! Bạn là người thấu cảm và lãnh đạo tốt.' };
  if (score >= 45) return { label: 'EQ Tốt', desc: 'Bạn quản lý cảm xúc tốt và hòa đồng với mọi người.' };
  if (score >= 30) return { label: 'EQ Trung Bình', desc: 'Mức độ cảm xúc ổn định, nhưng cần rèn luyện thêm kỹ năng xã hội.' };
  return { label: 'EQ Cần Cải Thiện', desc: 'Hãy cố gắng lắng nghe và thấu hiểu cảm xúc của mình hơn nhé!' };
};

// --- DISC TEST DATA ---

export const DISC_PROFILES: Record<string, DISCProfile> = {
  D: { 
    code: 'D', 
    name: 'Dominance (Thủ Lĩnh)', 
    description: 'Bạn là người quyết đoán, mạnh mẽ và thích thử thách. Bạn luôn hướng tới kết quả và không ngại đối mặt với khó khăn để đạt được mục tiêu.',
    characteristics: ['Quyết đoán', 'Mạnh mẽ', 'Tập trung kết quả', 'Thẳng thắn'],
    jobs: ['Quản lý doanh nghiệp', 'Kinh doanh/Sales', 'Lãnh đạo', 'Quân đội/Công an', 'Khởi nghiệp (Startup)'], 
    color: '#ef4444', // Red
    icon: '🦅' 
  },
  I: { 
    code: 'I', 
    name: 'Influence (Truyền Cảm Hứng)', 
    description: 'Bạn là người hoạt bát, lạc quan và có khả năng giao tiếp tuyệt vời. Bạn thích kết nối mọi người và tạo ra bầu không khí vui vẻ.',
    characteristics: ['Nhiệt tình', 'Sáng tạo', 'Giao tiếp tốt', 'Lạc quan'],
    jobs: ['MC/Dẫn chương trình', 'Marketing/PR', 'Truyền thông', 'Giáo dục/Đào tạo', 'Hướng dẫn viên'], 
    color: '#eab308', // Yellow
    icon: '🦚' 
  },
  S: { 
    code: 'S', 
    name: 'Steadiness (Ổn Định)', 
    description: 'Bạn là người kiên nhẫn, điềm đạm và biết lắng nghe. Bạn thích sự ổn định, hài hòa và luôn sẵn sàng hỗ trợ người khác.',
    characteristics: ['Kiên nhẫn', 'Lắng nghe', 'Hòa nhã', 'Đáng tin cậy'],
    jobs: ['Giáo viên', 'Y tá/Điều dưỡng', 'Tư vấn tâm lý', 'Công tác xã hội', 'Nhân sự'], 
    color: '#22c55e', // Green
    icon: '🕊️' 
  },
  C: { 
    code: 'C', 
    name: 'Compliance (Nguyên Tắc)', 
    description: 'Bạn là người cẩn thận, tỉ mỉ và tuân thủ quy tắc. Bạn làm việc dựa trên logic, dữ liệu và luôn hướng tới sự chính xác cao.',
    characteristics: ['Cẩn thận', 'Chi tiết', 'Logic', 'Kỷ luật'],
    jobs: ['Lập trình viên (IT)', 'Kế toán/Kiểm toán', 'Kỹ thuật viên', 'Phân tích dữ liệu', 'Nghiên cứu khoa học'], 
    color: '#3b82f6', // Blue
    icon: '🦉' 
  }
};

export const DISC_QUESTIONS: DISCQuestion[] = [
  { id: 1, text: "Khi đối mặt với khó khăn, bạn thường:", options: { A: "Đối đầu trực tiếp để giải quyết ngay", B: "Tìm sự giúp đỡ và bàn bạc với mọi người", C: "Bình tĩnh chờ đợi và quan sát tình hình", D: "Phân tích kỹ lưỡng nguyên nhân trước khi làm" } },
  { id: 2, text: "Phong cách giao tiếp của bạn là:", options: { A: "Thẳng thắn, đi vào vấn đề", B: "Sôi nổi, nhiệt tình, kể chuyện", C: "Nhẹ nhàng, lắng nghe nhiều hơn nói", D: "Chính xác, dựa trên thông tin cụ thể" } },
  { id: 3, text: "Trong một nhóm, bạn thường đóng vai trò:", options: { A: "Người lãnh đạo, ra quyết định", B: "Người khuấy động, kết nối mọi người", C: "Người hỗ trợ, hòa giải mâu thuẫn", D: "Người lập kế hoạch, kiểm tra chi tiết" } },
  { id: 4, text: "Bạn thích môi trường làm việc như thế nào?", options: { A: "Cạnh tranh, có nhiều thử thách", B: "Vui vẻ, thoải mái, tự do sáng tạo", C: "Ổn định, thân thiện, ít áp lực", D: "Trật tự, rõ ràng, có quy trình chuẩn" } },
  { id: 5, text: "Khi mua một món đồ mới, bạn quan tâm điều gì nhất?", options: { A: "Tính năng và hiệu quả sử dụng", B: "Kiểu dáng độc đáo, bắt mắt", C: "Sự tiện dụng và quen thuộc", D: "Thông số kỹ thuật và giá cả" } },
  { id: 6, text: "Bạn ghét điều gì nhất?", options: { A: "Sự chậm chạp và thiếu quyết đoán", B: "Sự buồn tẻ và bị phớt lờ", C: "Sự xung đột và thay đổi đột ngột", D: "Sự sai sót và thiếu logic" } },
  { id: 7, text: "Khi đặt mục tiêu, bạn sẽ:", options: { A: "Quyết tâm đạt được bằng mọi giá", B: "Hào hứng lúc đầu nhưng dễ nản nếu chán", C: "Thực hiện từ từ, kiên trì đến cùng", D: "Lên kế hoạch chi tiết từng bước một" } },
  { id: 8, text: "Cách bạn phản ứng khi tức giận:", options: { A: "Bùng nổ ngay lập tức", B: "Nói nhiều để xả stress", C: "Im lặng và chịu đựng", D: "Rút lui để suy nghĩ lại" } },
  { id: 9, text: "Điều gì tạo động lực cho bạn?", options: { A: "Quyền lực và chiến thắng", B: "Sự công nhận và lời khen ngợi", C: "Sự an toàn và tình cảm", D: "Sự hoàn hảo và chính xác" } },
  { id: 10, text: "Khi làm việc, bạn ưu tiên:", options: { A: "Kết quả cuối cùng", B: "Sự tương tác với con người", C: "Sự hợp tác và quy trình", D: "Chất lượng và độ chính xác" } },
  { id: 11, text: "Bạn sợ điều gì nhất?", options: { A: "Bị người khác kiểm soát", B: "Bị mọi người xa lánh", C: "Mất đi sự ổn định an toàn", D: "Bị chỉ trích vì sai lầm" } },
  { id: 12, text: "Khi có sự thay đổi bất ngờ, bạn sẽ:", options: { A: "Thích nghi nhanh và nắm quyền kiểm soát", B: "Vui vẻ chấp nhận nếu nó thú vị", C: "Cảm thấy lo lắng và cần thời gian", D: "Phân tích xem nó ảnh hưởng thế nào" } },
  { id: 13, text: "Bạn muốn người khác đánh giá mình là:", options: { A: "Người mạnh mẽ, tài năng", B: "Người thú vị, đáng yêu", C: "Người tốt bụng, đáng tin", D: "Người thông minh, cẩn trọng" } },
  { id: 14, text: "Khi tranh luận, bạn thường:", options: { A: "Cố gắng áp đảo để thắng", B: "Dùng lời lẽ thuyết phục đối phương", C: "Nhường nhịn để giữ hòa khí", D: "Dùng lý lẽ và bằng chứng cụ thể" } },
  { id: 15, text: "Bạn thích làm việc với người sếp như thế nào?", options: { A: "Trao quyền và đi thẳng vào vấn đề", B: "Thân thiện và biết khích lệ", C: "Nhẹ nhàng và hỗ trợ nhân viên", D: "Rõ ràng và có quy trình cụ thể" } },
  { id: 16, text: "Phong cách ra quyết định của bạn:", options: { A: "Nhanh chóng và quyết liệt", B: "Dựa vào trực giác và cảm xúc", C: "Tham khảo ý kiến người khác", D: "Cân nhắc kỹ lưỡng mọi rủi ro" } },
  { id: 17, text: "Khi rảnh rỗi, bạn thích:", options: { A: "Tham gia các môn thể thao đối kháng", B: "Tụ tập bạn bè vui chơi", C: "Nghỉ ngơi bên gia đình", D: "Đọc sách hoặc tìm hiểu kiến thức" } },
  { id: 18, text: "Nếu bạn là đội trưởng, bạn sẽ:", options: { A: "Chỉ đạo mọi người làm việc", B: "Cổ vũ tinh thần cả nhóm", C: "Cùng làm việc với mọi người", D: "Phân chia công việc chi tiết" } },
  { id: 19, text: "Bạn thường giải quyết vấn đề bằng cách:", options: { A: "Hành động ngay lập tức", B: "Thảo luận để tìm giải pháp sáng tạo", C: "Làm theo những cách đã quen thuộc", D: "Nghiên cứu kỹ các dữ liệu liên quan" } },
  { id: 20, text: "Mục tiêu sống của bạn là:", options: { A: "Thành công và dẫn đầu", B: "Hạnh phúc và được yêu mến", C: "Bình yên và ổn định", D: "Hoàn thiện và đúng đắn" } },
  { id: 21, text: "Câu nào mô tả đúng nhất về bạn?", options: { A: "Tôi muốn mọi việc theo ý mình", B: "Tôi muốn mọi người cùng vui", C: "Tôi muốn giúp đỡ mọi người", D: "Tôi muốn làm mọi việc thật chuẩn" } },
];
