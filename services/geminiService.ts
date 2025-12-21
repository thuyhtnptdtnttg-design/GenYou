
import { GoogleGenAI } from "@google/genai";
import { StudentResult, InteractionRecord, PassportReflection } from "../types";

export const getStudyAdvice = async (mbtiType: string, studentName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const modelId = 'gemini-3-flash-preview';
    const prompt = `
      Bạn là GenYou-bot, một trợ lý học tập vui vẻ cho học sinh cấp 3.
      Học sinh "${studentName}" có MBTI là "${mbtiType}".
      Đưa ra 3 lời khuyên học tập ngắn gọn, thiết thực. Sử dụng emoji. Format text thuần, gạch đầu dòng (-).
    `;
    const response = await ai.models.generateContent({ model: modelId, contents: prompt });
    return response.text || "Bot đang nghỉ ngơi xíu!";
  } catch (error) { return "Hiện tại Bot không thể kết nối."; }
};

export const getComprehensiveAnalysis = async (name: string, results: Record<string, StudentResult | null>): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let context = `Học sinh tên: ${name}.\nĐã hoàn thành các bài test sau:\n`;
    if (results.MBTI) context += `- MBTI: ${results.MBTI.mbtiType}\n`;
    if (results.HOLLAND) context += `- Holland: ${results.HOLLAND.hollandCode}\n`;
    if (results.IQ) context += `- IQ: ${results.IQ.iqClassification}\n`;
    if (results.EQ) context += `- EQ: ${results.EQ.eqClassification}\n`;
    if (results.DISC) context += `- DISC: Nhóm ${results.DISC.discType}\n`;

    const prompt = `Bạn là chuyên gia tư vấn hướng nghiệp GenYou. Hãy phân tích tổng hợp hồ sơ của học sinh này. Format Markdown. Ghi nhận nỗ lực.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return response.text || "Không thể tạo phân tích.";
  } catch (e) { return "Lỗi kết nối AI."; }
};

export const getSOSMoodResponse = async (userMsg: string, history: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const contents = history.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] }));
    contents.push({ role: 'user', parts: [{ text: userMsg }] });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: { systemInstruction: "Bạn là SOS Mood, lắng nghe thấu hiểu học sinh." }
    });
    return response.text || "Mình đang lắng nghe...";
  } catch (error) { return "Hệ thống đang bận."; }
};

export const analyzePassportJourney = async (name: string, interactions: InteractionRecord[]): Promise<PassportReflection> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const historyText = interactions.map(i => `${new Date(i.timestamp).toLocaleDateString()}: ${i.module} - ${i.activityType} (${i.duration}s, ${i.state})`).join('\n');
    
    const prompt = `Bạn là Learning Passport AI. Hãy phân tích hành trình của học sinh ${name}.
    Dữ liệu tương tác:
    ${historyText}

    Nhiệm vụ:
    1. Tính chuỗi ngày học tập (streak).
    2. Đánh giá sự đa dạng hoạt động.
    3. Đánh giá mức độ cân bằng (Học vs Thư giãn).
    4. Trao 1 danh hiệu khích lệ: {Người học bền bỉ, Nhà thám hiểm tri thức, Người biết lắng nghe bản thân, Học tập có cân bằng, Tinh thần tự học tích cực}.
    5. Viết lời nhắn động viên (không áp lực).

    Trả về JSON:
    {
      "learningStreak": number,
      "habitConsistency": "Ổn định" | "Đang phát triển",
      "balanceScore": number (0-100),
      "awardedTitle": { "name": "string", "description": "Ý nghĩa giáo dục", "reason": "Tại sao được trao" },
      "timelineHighlights": ["string - 3 điểm sáng"],
      "aiEncouragement": "string"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text);
  } catch (e) {
    return {
      learningStreak: 1, habitConsistency: "Đang phát triển", balanceScore: 50,
      awardedTitle: { name: "Người bạn của tri thức", description: "Dành cho người bắt đầu hành trình", reason: "Bạn đã tham gia hệ thống" },
      timelineHighlights: ["Bắt đầu hành trình"], aiEncouragement: "Mọi hành trình vạn dặm đều bắt đầu từ một bước chân."
    };
  }
};
