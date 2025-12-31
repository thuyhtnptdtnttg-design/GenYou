
'use server';

import { complexAnalysisService, fastResponseService } from "../../lib/ai-services";
import { Type } from "@google/genai";

// Orchestrator cho Writing & Homework
export async function solveHomeworkAction(imageBase64: string | null, description: string) {
  try {
    const text = await complexAnalysisService.solveHomework(imageBase64, description);
    return { success: true, text };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function assessWritingAction(text: string, imageBase64: string | null) {
  try {
    const feedback = await complexAnalysisService.assessWriting(text, imageBase64);
    return { success: true, text: feedback };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Orchestrator cho BrainCandy & Flashcards
export async function generateBrainCandyLessonAction(categoryName: string, subjectName: string, topic: string) {
  try {
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        part1_core: { type: Type.ARRAY, items: { type: Type.STRING } },
        part2_examples: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { example: { type: Type.STRING }, solution: { type: Type.STRING } } } },
        flashcards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { front: { type: Type.STRING }, back: { type: Type.STRING } } } },
        quiz: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, answer: { type: Type.STRING }, explanation: { type: Type.STRING }, isSituational: { type: Type.BOOLEAN } } } }
      }
    };
    const prompt = `Tạo bài học BrainCandy cho ${categoryName}, Nhóm: ${subjectName}, Chủ đề: ${topic}.`;
    const data = await fastResponseService.generateLearningContent(prompt, schema);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Orchestrator cho Speaking
export async function scoreSpeakingAction(transcription: string, targetText?: string) {
  try {
    const data = await fastResponseService.evaluateSpeaking(transcription, targetText);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Orchestrator cho Chatbot
export async function getSOSMoodAction(userMsg: string, history: any[]) {
  try {
    const text = await fastResponseService.chatSupport(
      userMsg, 
      history, 
      "Bạn là SOS Mood, người bạn lắng nghe thấu hiểu học sinh THPT. Hãy phản hồi ấm áp."
    );
    return { success: true, text };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
