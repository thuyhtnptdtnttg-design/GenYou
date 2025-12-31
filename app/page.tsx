
'use client';

import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import HomeScreen from '../components/HomeScreen';
import MenuScreen from '../components/MenuScreen';
import MBTIIntroScreen from '../components/MBTIIntroScreen';
import QuizScreen from '../components/QuizScreen';
import HollandQuizScreen from '../components/HollandQuizScreen';
import IQQuizScreen from '../components/IQQuizScreen';
import EQQuizScreen from '../components/EQQuizScreen';
import DISCQuizScreen from '../components/DISCQuizScreen';
import PassportScreen from '../components/PassportScreen';
import HollandPassportScreen from '../components/HollandPassportScreen';
import IQPassportScreen from '../components/IQPassportScreen';
import EQPassportScreen from '../components/EQPassportScreen';
import DISCPassportScreen from '../components/DISCPassportScreen';
import ChillZoneScreen from '../components/ChillZoneScreen';
import SOSMoodScreen from '../components/SOSMoodScreen';
import SOSResourcesScreen from '../components/SOSResourcesScreen';
import StudyHubScreen from '../components/StudyHubScreen';
import StudyHubFlashcards from '../components/StudyHubFlashcards';
import StudyHubSpeaking from '../components/StudyHubSpeaking';
import StudyHubWriting from '../components/StudyHubWriting';
import StudyHubSummary from '../components/StudyHubSummary';
import StudyHubHomeworkSolver from '../components/StudyHubHomeworkSolver';
import BrainCandyScreen from '../components/BrainCandyScreen';
import ComprehensiveReportScreen from '../components/ComprehensiveReportScreen';
import LearningPassportReflection from '../components/LearningPassportReflection';
import AdminDashboard from '../components/AdminDashboard';
import { ScreenState, StudentResult } from '../types';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [currentUser, setCurrentUser] = useState({ 
    name: 'Bạn Học', 
    id: 'GEN-GUEST-001', 
    grade: 'THPT' 
  });
  const [result, setResult] = useState<StudentResult | null>(null);

  const handleStart = (name: string, studentId: string) => {
    const gradeMatch = studentId.match(/GEN-(.*?)-/);
    const grade = gradeMatch ? gradeMatch[1] : 'THPT';
    setCurrentUser({ name, id: studentId, grade });
    setScreen('home');
  };

  const handleSelectStudyTool = (tool: string) => {
    const map: Record<string, ScreenState> = {
      flashcards: 'studyhub_flashcards',
      speaking: 'studyhub_speaking',
      writing: 'studyhub_writing',
      summary: 'studyhub_summary',
      homework: 'studyhub_homework'
    };
    if (map[tool]) setScreen(map[tool]);
  };

  return (
    <main className="min-h-screen">
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} onAdmin={() => setScreen('admin')} />}
      {screen === 'home' && (
        <HomeScreen 
          studentName={currentUser.name}
          studentGrade={currentUser.grade}
          onSelectGenYou={() => setScreen('menu')}
          onSelectChill={() => setScreen('chillzone')}
          onSelectSOS={() => setScreen('sos_mood')}
          onSelectStudyHub={() => setScreen('studyhub')}
          onSelectBrainCandy={() => setScreen('braincandy')}
          onSelectPassport={() => setScreen('passport_reflection')}
          onLogout={() => setScreen('admin')}
        />
      )}

      {screen === 'passport_reflection' && <LearningPassportReflection studentName={currentUser.name} onBack={() => setScreen('home')} />}
      {screen === 'studyhub' && <StudyHubScreen onBack={() => setScreen('home')} onSelectTool={handleSelectStudyTool} />}
      {screen === 'studyhub_flashcards' && <StudyHubFlashcards onBack={() => setScreen('studyhub')} />}
      {screen === 'studyhub_speaking' && <StudyHubSpeaking onBack={() => setScreen('studyhub')} />}
      {screen === 'studyhub_writing' && <StudyHubWriting onBack={() => setScreen('studyhub')} />}
      {screen === 'studyhub_summary' && <StudyHubSummary onBack={() => setScreen('studyhub')} />}
      {screen === 'studyhub_homework' && <StudyHubHomeworkSolver onBack={() => setScreen('studyhub')} />}
      {screen === 'braincandy' && <BrainCandyScreen studentName={currentUser.name} studentId={currentUser.id} onBack={() => setScreen('home')} />}
      {screen === 'sos_mood' && <SOSMoodScreen onBack={() => setScreen('home')} onGoToResources={() => setScreen('sos_resources')} />}
      {screen === 'sos_resources' && <SOSResourcesScreen onBack={() => setScreen('sos_mood')} />}
      {screen === 'menu' && (
        <MenuScreen 
          studentName={currentUser.name} 
          onSelectMBTI={() => setScreen('intro_mbti')} 
          onSelectHolland={() => setScreen('quiz_holland')} 
          onSelectIQ={() => setScreen('quiz_iq')} 
          onSelectEQ={() => setScreen('quiz_eq')} 
          onSelectDISC={() => setScreen('quiz_disc')} 
          onSelectChill={() => setScreen('chillzone')} 
          onSelectReport={() => setScreen('comprehensive_report')} 
          onBack={() => setScreen('home')} 
        />
      )}
      {screen === 'intro_mbti' && <MBTIIntroScreen onStart={() => setScreen('quiz_mbti')} onBack={() => setScreen('menu')} />}
      {screen === 'quiz_mbti' && <QuizScreen studentName={currentUser.name} studentId={currentUser.id} onComplete={(res) => { setResult(res); setScreen('passport_mbti'); }} onCancel={() => setScreen('menu')} />}
      {screen === 'passport_mbti' && result && <PassportScreen result={result} onRetake={() => setScreen('menu')} />}
      {screen === 'quiz_holland' && <HollandQuizScreen studentName={currentUser.name} studentId={currentUser.id} onComplete={(res) => { setResult(res); setScreen('passport_holland'); }} onCancel={() => setScreen('menu')} />}
      {screen === 'passport_holland' && result && <HollandPassportScreen result={result} onRetake={() => setScreen('menu')} />}
      {screen === 'quiz_iq' && <IQQuizScreen studentName={currentUser.name} studentId={currentUser.id} onComplete={(res) => { setResult(res); setScreen('passport_iq'); }} onCancel={() => setScreen('menu')} />}
      {screen === 'passport_iq' && result && <IQPassportScreen result={result} onRetake={() => setScreen('menu')} />}
      {screen === 'quiz_eq' && <EQQuizScreen studentName={currentUser.name} studentId={currentUser.id} onComplete={(res) => { setResult(res); setScreen('passport_eq'); }} onCancel={() => setScreen('menu')} />}
      {screen === 'passport_eq' && result && <EQPassportScreen result={result} onRetake={() => setScreen('menu')} />}
      {screen === 'quiz_disc' && <DISCQuizScreen studentName={currentUser.name} studentId={currentUser.id} onComplete={(res) => { setResult(res); setScreen('passport_disc'); }} onCancel={() => setScreen('menu')} />}
      {screen === 'passport_disc' && result && <DISCPassportScreen result={result} onRetake={() => setScreen('menu')} />}
      {screen === 'chillzone' && <ChillZoneScreen onBack={() => setScreen('home')} />}
      {screen === 'comprehensive_report' && <ComprehensiveReportScreen studentName={currentUser.name} studentId={currentUser.id} onBack={() => setScreen('menu')} />}
      {screen === 'admin' && <AdminDashboard onBack={() => setScreen('home')} />}
    </main>
  );
}
