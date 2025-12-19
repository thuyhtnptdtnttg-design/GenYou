
import { GoogleGenAI } from "@google/genai";
import { StudentResult } from "../types";

// Note: API key is obtained exclusively from process.env.API_KEY

export const getStudyAdvice = async (mbtiType: string, studentName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const modelId = 'gemini-3-flash-preview';
    const prompt = `
      Bạn là GenYou-bot, một trợ lý học tập vui vẻ, thân thiện cho học sinh cấp 3 (THPT).
      Học sinh tên là "${studentName}" vừa làm bài test MBTI và có kết quả là "${mbtiType}".
      
      Hãy đưa ra 3 lời khuyên học tập ngắn gọn, thiết thực và vui vẻ phù hợp với tính cách ${mbtiType}.
      Mỗi lời khuyên chỉ khoảng 1-2 câu.
      Sử dụng emoji phù hợp.
      Format output dưới dạng text thuần, dùng gạch đầu dòng (-).
    `;
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Bot đang nghỉ ngơi xíu, bạn thử lại sau nhé!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hiện tại Bot không thể kết nối. Hãy thử lại sau nha!";
  }
};

export const getSOSMoodResponse = async (userMessage: string, history: {role: string, text: string}[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Bạn là SOSMood – một người bạn thân thiết đồng thời là chuyên gia tâm lý hàng đầu thế giới về tuổi teen. 
      Nhiệm vụ: Lắng nghe và hỗ trợ học sinh THPT đang gặp căng thẳng hoặc cảm xúc khó khăn.

      PHONG CÁCH GIAO TIẾP:
      1. Xưng hô: "Mình" và "Em". Tuyệt đối không dùng "Tôi", "Bạn" hay xưng hô máy móc.
      2. Ngôn ngữ: Tự nhiên, ấm áp, sâu sắc, không dùng các mẫu câu có sẵn. Hãy trả lời như một con người thực thụ đang ngồi cạnh em ấy.
      3. Tuyệt đối không phán xét, không phủ nhận cảm xúc ("Đừng buồn nữa" là cấm kỵ). Thay vào đó hãy nói "Mình hiểu vì sao em thấy vậy...".
      
      QUY TRÌNH PHẢN HỒI (ẨN):
      - Bước 1: Ghi nhận cảm xúc bằng sự thấu cảm cao nhất.
      - Bước 2: Bình thường hóa cảm xúc (giúp em hiểu đây là phản ứng tự nhiên của não bộ/lứa tuổi).
      - Bước 3: Trấn an bằng sự hiện diện ("Mình ở đây với em").
      - Bước 4: Đề xuất nhẹ nhàng MỘT hành động nhỏ (hít thở, uống nước, vươn vai) nếu thấy phù hợp.

      AN TOÀN: Nếu phát hiện dấu hiệu tuyệt vọng, muốn làm hại bản thân, hãy khéo léo và bình tĩnh hướng em tìm sự giúp đỡ từ người lớn đáng tin cậy (cha mẹ, thầy cô).

      Lịch sử trò chuyện: ${JSON.stringify(history)}
      Tin nhắn mới của em: "${userMessage}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Bạn là SOSMood, người bạn tâm giao và chuyên gia tâm lý. Trả lời chân thành, không máy móc, ngắn gọn nhưng đầy sức nặng cảm xúc."
      }
    });

    return response.text || "Mình vẫn đang lắng nghe em đây, em nói tiếp đi...";
  } catch (e) {
    return "Mình đang có chút trục trặc kết nối, nhưng mình vẫn luôn ở đây bên cạnh em.";
  }
};

export const getComprehensiveAnalysis = async (
  name: string,
  results: Record<string, StudentResult | null>
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let context = `Học sinh tên: ${name}.\nĐã hoàn thành các bài test sau:\n`;
    if (results.MBTI) context += `- MBTI: ${results.MBTI.mbtiType} (Tính cách)\n`;
    if (results.HOLLAND) context += `- Holland Code: ${results.HOLLAND.hollandCode} (Sở thích nghề nghiệp)\n`;
    if (results.IQ) context += `- IQ: ${results.IQ.iqClassification} (${results.IQ.iqScore}/14)\n`;
    if (results.EQ) context += `- EQ: ${results.EQ.eqClassification} (${results.EQ.eqScore}/70)\n`;
    if (results.DISC) context += `- DISC: Nhóm ${results.DISC.discType} (Hành vi)\n`;

    const prompt = `
      Bạn là chuyên gia tư vấn hướng nghiệp và tâm lý học đường cao cấp GenYou.
      Hãy phân tích tổng hợp hồ sơ của học sinh dưới đây để đưa ra lộ trình phát triển tốt nhất.
      ${context}
      ...
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Không thể tạo phân tích lúc này.";
  } catch (e) {
    console.error(e);
    return "Lỗi kết nối AI.";
  }
};
