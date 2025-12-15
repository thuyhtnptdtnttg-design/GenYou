import { GoogleGenAI } from "@google/genai";
import { StudentResult } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getStudyAdvice = async (mbtiType: string, studentName: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Hãy thiết lập API Key để nhận lời khuyên từ GenYou Bot!";

  try {
    const modelId = 'gemini-2.5-flash';
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

export const getComprehensiveAnalysis = async (
  name: string,
  results: Record<string, StudentResult | null>
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Cần API Key để phân tích tổng hợp.";

  try {
    // Construct the context based on available results
    let context = `Học sinh tên: ${name}.\nĐã hoàn thành các bài test sau:\n`;

    if (results.MBTI) context += `- MBTI: ${results.MBTI.mbtiType} (Tính cách)\n`;
    if (results.HOLLAND) context += `- Holland Code: ${results.HOLLAND.hollandCode} (Sở thích nghề nghiệp)\n`;
    if (results.IQ) context += `- IQ: ${results.IQ.iqClassification} (${results.IQ.iqScore}/14)\n`;
    if (results.EQ) context += `- EQ: ${results.EQ.eqClassification} (${results.EQ.eqScore}/70)\n`;
    if (results.DISC) context += `- DISC: Nhóm ${results.DISC.discType} (Hành vi)\n`;

    const prompt = `
      Bạn là chuyên gia tư vấn hướng nghiệp và tâm lý học đường cao cấp GenYou.
      Hãy phân tích tổng hợp hồ sơ của học sinh dưới đây để đưa ra lộ trình phát triển tốt nhất.
      
      Dữ liệu học sinh:
      ${context}

      Yêu cầu đầu ra (Format Markdown, giọng văn thân thiện, khích lệ, sâu sắc):
      1. **Bức tranh tổng quan**: Mô tả ngắn gọn về con người học sinh dựa trên sự kết hợp các chỉ số (Ví dụ: MBTI kết hợp Holland nói lên điều gì? IQ và EQ bổ trợ nhau thế nào?).
      2. **Điểm mạnh "Vàng"**: 3 điểm mạnh nhất khi kết hợp các yếu tố này lại.
      3. **Định hướng nghề nghiệp tối ưu**: Gợi ý 3 ngành nghề/lĩnh vực cụ thể phù hợp nhất với TẤT CẢ các chỉ số trên. Giải thích tại sao.
      4. **Lời khuyên "xương máu"**: Một điều chỉnh nhỏ trong thói quen hoặc tư duy sẽ giúp bạn ấy thành công vượt bậc (dựa trên điểm yếu tiềm ẩn của các nhóm tính cách này).
      
      Nếu thiếu bài test nào, hãy đưa ra lời khuyên dựa trên những gì đã có, nhưng nhắc nhẹ học sinh nên làm thêm bài còn thiếu để chính xác hơn.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Không thể tạo phân tích lúc này.";
  } catch (e) {
    console.error(e);
    return "Lỗi kết nối AI.";
  }
};