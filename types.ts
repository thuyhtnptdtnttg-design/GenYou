
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
  options: string[];
  correctAnswer: string;
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
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export type TestType = 'MBTI' | 'HOLLAND' | 'IQ' | 'EQ' | 'DISC';

export interface StudentResult {
  id: string;
  name: string;
  studentId?: string;
  type: TestType;
  mbtiType?: string;
  mbtiScores?: { E: number; I: number; S: number; N: number; T: number; F: number; J: number; P: number; };
  hollandCode?: string;
  hollandScores?: { R: number; I: number; A: number; S: number; E: number; C: number; };
  iqScore?: number;
  iqClassification?: string;
  eqScore?: number;
  eqClassification?: string;
  eqSkills?: { SelfAwareness: number; SelfManagement: number; SocialAwareness: number; RelationshipSkills: number; SelfMotivation: number; };
  discType?: string;
  discScores?: { D: number; I: number; S: number; C: number; };
  timestamp: number;
  studyAdvice?: string;
}

// New Interaction Tracking Types
export type ActivityType = 'Học tập' | 'Ôn luyện' | 'Thư giãn' | 'Tự nhìn lại';
export type ModuleName = 'GenYou' | 'BrainCandy' | 'StudyHub' | 'SOSMood' | 'ChillZone';
export type CompletionLevel = 'Hoàn thành' | 'Một phần';
export type MentalState = 'Tích cực' | 'Bình thường' | 'Cần nghỉ ngơi';

export interface InteractionRecord {
  id: string;
  timestamp: number;
  module: ModuleName;
  activityType: ActivityType;
  duration: number; // in seconds
  status: CompletionLevel;
  state: MentalState;
}

export interface PassportReflection {
  learningStreak: number;
  habitConsistency: string; // "Ổn định" | "Đang phát triển"
  balanceScore: number; // 0-100
  awardedTitle: {
    name: string;
    description: string;
    reason: string;
  };
  timelineHighlights: string[];
  aiEncouragement: string;
}

export type ScreenState = 
  | 'welcome' | 'home' | 'menu' 
  | 'intro_mbti' | 'quiz_mbti' | 'quiz_holland' | 'quiz_iq' | 'quiz_eq' | 'quiz_disc' 
  | 'passport_mbti' | 'passport_holland' | 'passport_iq' | 'passport_eq' | 'passport_disc' 
  | 'admin' | 'comprehensive_report' | 'chillzone' | 'sos_mood' | 'sos_resources'
  | 'studyhub' | 'studyhub_flashcards' | 'studyhub_speaking' | 'studyhub_writing' | 'studyhub_summary' | 'studyhub_homework'
  | 'braincandy' | 'passport_reflection';

export interface MBTIProfile { type: string; name: string; description: string[]; color: string; icon: string; }
export interface HollandProfile { code: string; name: string; description: string; jobs: string[]; color: string; icon: string; }
export interface DISCProfile { code: string; name: string; description: string; characteristics: string[]; jobs: string[]; color: string; icon: string; }
