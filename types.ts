
export interface Question {
  id: number;
  textA: string;
  textB: string;
  category: 'EI' | 'SN' | 'TF' | 'JP';
}

export interface HollandQuestion {
  id: number;
  text: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
}

export interface IQQuestion {
  id: number;
  text: string;
  options: string[]; // 4 options
  correctAnswer: string; // The exact string of the correct option
  category: 'Logic' | 'Math' | 'Spatial';
}

export interface EQQuestion {
  id: number;
  text: string;
  category: 'SelfAwareness' | 'SelfManagement' | 'SocialAwareness' | 'RelationshipSkills' | 'SelfMotivation';
}

export interface DISCQuestion {
  id: number;
  text: string;
  options: {
    A: string; // D
    B: string; // I
    C: string; // S
    D: string; // C
  };
}

export type TestType = 'MBTI' | 'HOLLAND' | 'IQ' | 'EQ' | 'DISC';

export interface StudentResult {
  id: string;
  name: string;
  studentId?: string;
  type: TestType;
  
  // MBTI Specific
  mbtiType?: string; // e.g., "ENFP"
  mbtiScores?: {
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
  };

  // Holland Specific
  hollandCode?: string; // e.g., "RIA"
  hollandScores?: {
    R: number; I: number; A: number;
    S: number; E: number; C: number;
  };

  // IQ Specific
  iqScore?: number; // 0-14
  iqClassification?: string; // e.g. "IQ Khá"

  // EQ Specific
  eqScore?: number; // 14-70
  eqClassification?: string; // e.g. "EQ Tốt"
  eqSkills?: {
    SelfAwareness: number;
    SelfManagement: number;
    SocialAwareness: number;
    RelationshipSkills: number;
    SelfMotivation: number;
  };

  // DISC Specific
  discType?: string; // D, I, S, or C
  discScores?: {
    D: number;
    I: number;
    S: number;
    C: number;
  };

  timestamp: number;
  studyAdvice?: string;
}

export type ScreenState = 
  | 'welcome' | 'home' | 'menu' 
  | 'intro_mbti' | 'quiz_mbti' | 'quiz_holland' | 'quiz_iq' | 'quiz_eq' | 'quiz_disc' 
  | 'passport_mbti' | 'passport_holland' | 'passport_iq' | 'passport_eq' | 'passport_disc' 
  | 'admin' | 'comprehensive_report' | 'chillzone' | 'sos_mood' | 'sos_resources'
  | 'studyhub' | 'studyhub_flashcards' | 'studyhub_speaking' | 'studyhub_writing' | 'studyhub_summary'
  | 'braincandy';

export interface MBTIProfile {
  type: string;
  name: string;
  description: string[];
  color: string;
  icon: string;
}

export interface HollandProfile {
  code: string; // R, I, A, S, E, C
  name: string;
  description: string;
  jobs: string[];
  color: string;
  icon: string;
}

export interface DISCProfile {
  code: string; // D, I, S, C
  name: string; // Dominance, Influence, etc.
  description: string;
  characteristics: string[];
  jobs: string[];
  color: string;
  icon: string;
}
