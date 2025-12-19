
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
  mbtiType?: string;
  mbtiScores?: any;
  hollandCode?: string;
  hollandScores?: any;
  iqScore?: number;
  iqClassification?: string;
  eqScore?: number;
  eqClassification?: string;
  eqSkills?: any;
  discType?: string;
  discScores?: any;
  timestamp: number;
}

export type ModuleName = 'GenYou' | 'BrainCandy' | 'StudyHub' | 'SOSMood' | 'ChillZone';
export type ActivityType = 'Học tập' | 'Ôn luyện' | 'Thư giãn' | 'Tự nhìn lại';
export type CompletionStatus = 'Hoàn thành' | 'Một phần';
export type PostState = 'Tích cực' | 'Bình thường' | 'Cần nghỉ ngơi';

export interface InteractionLog {
  timestamp: number;
  module: ModuleName;
  activityType: ActivityType;
  duration: number; // seconds
  status: CompletionStatus;
  state: PostState;
}

export type ScreenState = 
  | 'welcome' | 'home' | 'menu' 
  | 'intro_mbti' | 'quiz_mbti' | 'quiz_holland' | 'quiz_iq' | 'quiz_eq' | 'quiz_disc' 
  | 'passport_mbti' | 'passport_holland' | 'passport_iq' | 'passport_eq' | 'passport_disc' 
  | 'learning_passport' // Màn hình Passport tổng hợp mới
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
  code: string;
  name: string;
  description: string;
  jobs: string[];
  color: string;
  icon: string;
}

export interface DISCProfile {
  code: string;
  name: string;
  description: string;
  characteristics: string[];
  jobs: string[];
  color: string;
  icon: string;
}
