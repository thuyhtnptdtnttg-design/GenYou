
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import MenuScreen from './components/MenuScreen';
import MBTIIntroScreen from './components/MBTIIntroScreen';
import QuizScreen from './components/QuizScreen';
import HollandQuizScreen from './components/HollandQuizScreen';
import IQQuizScreen from './components/IQQuizScreen';
import EQQuizScreen from './components/EQQuizScreen';
import DISCQuizScreen from './components/DISCQuizScreen';
import PassportScreen from './components/PassportScreen';
import HollandPassportScreen from './components/HollandPassportScreen';
import IQPassportScreen from './components/IQPassportScreen';
import EQPassportScreen from './components/EQPassportScreen';
import DISCPassportScreen from './components/DISCPassportScreen';
import ChillZoneScreen from './components/ChillZoneScreen';
import SOSMoodScreen from './components/SOSMoodScreen';
import SOSResourcesScreen from './components/SOSResourcesScreen';
import StudyHubScreen from './components/StudyHubScreen';
import StudyHubFlashcards from './components/StudyHubFlashcards';
import StudyHubSpeaking from './components/StudyHubSpeaking';
import StudyHubWriting from './components/StudyHubWriting';
import StudyHubSummary from './components/StudyHubSummary';
import BrainCandyScreen from './components/BrainCandyScreen';
import ComprehensiveReportScreen from './components/ComprehensiveReportScreen';
import AdminDashboard from './components/AdminDashboard';
import LearningPassportScreen from './components/LearningPassportScreen';
import { ScreenState, StudentResult } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [currentUser, setCurrentUser] = useState<{name: string, id: string, grade: string}>({ name: '', id: '', grade: '' });
  const [result, setResult] = useState<StudentResult | null>(null);

  const handleStart = (name: string, studentId: string) => {
    const gradeMatch = studentId.match(/GEN-(.*?)-/);
    const grade = gradeMatch ? gradeMatch[1] : '';
    setCurrentUser({ name, id: studentId, grade });
    setScreen('home');
  };

  const handleGoToTests = () => setScreen('menu');
  const handleGoToChill = () => setScreen('chillzone');
  const handleGoToSOS = () => setScreen('sos_mood');
  const handleGoToSOSResources = () => setScreen('sos_resources');
  const handleGoToStudyHub = () => setScreen('studyhub');
  const handleGoToBrainCandy = () => setScreen('braincandy');
  const handleGoToLearningPassport = () => setScreen('learning_passport');

  const handleSelectMBTI = () => setScreen('intro_mbti');
  const handleStartMBTIQuiz = () => setScreen('quiz_mbti');
  const handleSelectHolland = () => setScreen('quiz_holland');
  const handleSelectIQ = () => setScreen('quiz_iq');
  const handleSelectEQ = () => setScreen('quiz_eq');
  const handleSelectDISC = () => setScreen('quiz_disc');
  const handleSelectReport = () => setScreen('comprehensive_report');

  const handleCompleteMBTI = (res: StudentResult) => {
    setResult(res);
    setScreen('passport_mbti');
  };

  const handleCompleteHolland = (res: StudentResult) => {
    setResult(res);
    setScreen('passport_holland');
  };

  const handleCompleteIQ = (res: StudentResult) => {
    setResult(res);
    setScreen('passport_iq');
  };

  const handleCompleteEQ = (res: StudentResult) => {
    setResult(res);
    setScreen('passport_eq');
  };

  const handleCompleteDISC = (res: StudentResult) => {
    setResult(res);
    setScreen('passport_disc');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
    setResult(null);
  };

  const handleBackToHome = () => {
    setScreen('home');
    setResult(null);
  };
  
  const handleFullReset = () => {
      setScreen('welcome');
      setResult(null);
      setCurrentUser({ name: '', id: '', grade: '' });
  };

  const handleSelectStudyTool = (tool: string) => {
    if (tool === 'flashcards') setScreen('studyhub_flashcards');
    if (tool === 'speaking') setScreen('studyhub_speaking');
    if (tool === 'writing') setScreen('studyhub_writing');
    if (tool === 'summary') setScreen('studyhub_summary');
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-gray-800">
      {screen === 'welcome' && (
        <WelcomeScreen 
          onStart={handleStart} 
          onAdmin={() => setScreen('admin')} 
        />
      )}

      {screen === 'home' && (
        <HomeScreen 
          studentName={currentUser.name}
          studentGrade={currentUser.grade}
          onSelectGenYou={handleGoToLearningPassport} // Giờ đây GenYou dẫn về Journey Passport
          onSelectChill={handleGoToChill}
          onSelectSOS={handleGoToSOS}
          onSelectStudyHub={handleGoToStudyHub}
          onSelectBrainCandy={handleGoToBrainCandy}
          onLogout={handleFullReset}
        />
      )}

      {screen === 'learning_passport' && (
        <LearningPassportScreen 
          studentName={currentUser.name}
          onBack={handleBackToHome}
        />
      )}

      {screen === 'studyhub' && (
        <StudyHubScreen 
          onBack={handleBackToHome}
          onSelectTool={handleSelectStudyTool}
        />
      )}

      {screen === 'studyhub_flashcards' && <StudyHubFlashcards onBack={handleGoToStudyHub} />}
      {screen === 'studyhub_speaking' && <StudyHubSpeaking onBack={handleGoToStudyHub} />}
      {screen === 'studyhub_writing' && <StudyHubWriting onBack={handleGoToStudyHub} />}
      {screen === 'studyhub_summary' && <StudyHubSummary onBack={handleGoToStudyHub} />}

      {screen === 'braincandy' && (
        <BrainCandyScreen 
          studentName={currentUser.name}
          studentId={currentUser.id}
          onBack={handleBackToHome}
        />
      )}

      {screen === 'sos_mood' && (
        <SOSMoodScreen 
          onBack={handleBackToHome}
          onGoToResources={handleGoToSOSResources}
        />
      )}

      {screen === 'sos_resources' && (
        <SOSResourcesScreen 
          onBack={() => setScreen('sos_mood')}
        />
      )}

      {screen === 'menu' && (
        <MenuScreen 
          studentName={currentUser.name}
          onSelectMBTI={handleSelectMBTI}
          onSelectHolland={handleSelectHolland}
          onSelectIQ={handleSelectIQ}
          onSelectEQ={handleSelectEQ}
          onSelectDISC={handleSelectDISC}
          onSelectChill={handleGoToChill}
          onSelectReport={handleSelectReport}
          onBack={handleBackToHome}
        />
      )}

      {screen === 'intro_mbti' && (
        <MBTIIntroScreen 
          onStart={handleStartMBTIQuiz}
          onBack={handleBackToMenu}
        />
      )}
      
      {screen === 'quiz_mbti' && (
        <QuizScreen 
          studentName={currentUser.name}
          studentId={currentUser.id}
          onComplete={handleCompleteMBTI}
          onCancel={handleBackToMenu}
        />
      )}

      {screen === 'passport_mbti' && result && (
        <PassportScreen 
          result={result} 
          onRetake={handleBackToMenu} 
        />
      )}

      {screen === 'quiz_holland' && (
        <HollandQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteHolland}
            onCancel={handleBackToMenu}
        />
      )}

      {screen === 'passport_holland' && result && (
          <HollandPassportScreen
            result={result}
            onRetake={handleBackToMenu}
          />
      )}

      {screen === 'quiz_iq' && (
        <IQQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteIQ}
            onCancel={handleBackToMenu}
        />
      )}

      {screen === 'passport_iq' && result && (
          <IQPassportScreen
            result={result}
            onRetake={handleBackToMenu}
          />
      )}

      {screen === 'quiz_eq' && (
        <EQQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteEQ}
            onCancel={handleBackToMenu}
        />
      )}

      {screen === 'passport_eq' && result && (
          <EQPassportScreen
            result={result}
            onRetake={handleBackToMenu}
          />
      )}

      {screen === 'quiz_disc' && (
        <DISCQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteDISC}
            onCancel={handleBackToMenu}
        />
      )}

      {screen === 'passport_disc' && result && (
          <DISCPassportScreen
            result={result}
            onRetake={handleBackToMenu}
          />
      )}

      {screen === 'chillzone' && (
        <ChillZoneScreen 
            onBack={handleBackToHome}
        />
      )}

      {screen === 'comprehensive_report' && (
          <ComprehensiveReportScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onBack={handleBackToMenu}
          />
      )}

      {screen === 'admin' && (
        <AdminDashboard 
          onBack={handleFullReset} 
        />
      )}
    </div>
  );
};

export default App;
