
import { GoogleGenAI, Type } from "@google/genai";

// Cấu hình tập trung cho AI Services
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Service xử lý các tác vụ phân tích phức tạp (Writing, Solving)
 * Sử dụng mô hình Pro để có độ chính xác cao nhất.
 */
export const complexAnalysisService = {
  async solveHomework(imageBase64: string | null, description: string) {
    const model = ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          ...(imageBase64 ? [{ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }] : []),
          { text: `Bạn là trợ lý giải bài tập THPT. Hãy giải chi tiết bài tập này: ${description}` }
        ]
      }
    });
    const response = await model;
    return response.text;
  },

  async assessWriting(text: string, imageBase64: string | null) {
    const model = ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          ...(imageBase64 ? [{ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }] : []),
          { text: `Chấm điểm (0-9) và nhận xét bài viết tiếng Anh sau: ${text}. Nếu đạt điểm 9, ghi rõ 'EXCELLENT'.` }
        ]
      },
      config: { systemInstruction: "Trả lời bằng Tiếng Việt, định dạng Markdown." }
    });
    const response = await model;
    return response.text;
  }
};

/**
 * Service xử lý các tác vụ nhanh, số lượng lớn (Flashcards, Quiz, Speaking)
 * Sử dụng mô hình Flash để tối ưu chi phí và tốc độ phản hồi.
 */
export const fastResponseService = {
  async generateLearningContent(prompt: string, schema: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async evaluateSpeaking(transcription: string, targetText?: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Đánh giá phát âm: "${transcription}" ${targetText ? `so với mẫu: "${targetText}"` : ""}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING },
            refinedText: { type: Type.STRING }
          },
          required: ["score", "comment"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async chatSupport(userMsg: string, history: any[], systemInstruction: string) {
    const chat = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userMsg }] }
      ],
      config: { systemInstruction }
    });
    const response = await chat;
    return response.text;
  }
};
