
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import QuizScreen from './components/QuizScreen'; // MBTI Quiz
import HollandQuizScreen from './components/HollandQuizScreen';
import IQQuizScreen from './components/IQQuizScreen';
import EQQuizScreen from './components/EQQuizScreen';
import DISCQuizScreen from './components/DISCQuizScreen';
import PassportScreen from './components/PassportScreen'; // MBTI Passport
import HollandPassportScreen from './components/HollandPassportScreen';
import IQPassportScreen from './components/IQPassportScreen';
import EQPassportScreen from './components/EQPassportScreen';
import DISCPassportScreen from './components/DISCPassportScreen';
import ComprehensiveReportScreen from './components/ComprehensiveReportScreen';
import AdminDashboard from './components/AdminDashboard';
import { ScreenState, StudentResult } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [currentUser, setCurrentUser] = useState<{name: string, id: string}>({ name: '', id: '' });
  const [result, setResult] = useState<StudentResult | null>(null);

  // 1. Welcome -> Menu
  const handleStart = (name: string, studentId: string) => {
    setCurrentUser({ name, id: studentId });
    setScreen('menu'); 
  };

  // 2. Menu -> Quiz / Report
  const handleSelectMBTI = () => setScreen('quiz_mbti');
  const handleSelectHolland = () => setScreen('quiz_holland');
  const handleSelectIQ = () => setScreen('quiz_iq');
  const handleSelectEQ = () => setScreen('quiz_eq');
  const handleSelectDISC = () => setScreen('quiz_disc');
  const handleSelectReport = () => setScreen('comprehensive_report');

  // 3. Quiz -> Passport
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

  // 4. Back/Reset
  const handleRetake = () => {
    // Go back to menu, keep name
    setScreen('menu');
    setResult(null);
  };
  
  const handleFullReset = () => {
      setScreen('welcome');
      setResult(null);
      setCurrentUser({ name: '', id: '' });
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-gray-800">
      {screen === 'welcome' && (
        <WelcomeScreen 
          onStart={handleStart} 
          onAdmin={() => setScreen('admin')} 
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
          onSelectReport={handleSelectReport}
          onBack={handleFullReset}
        />
      )}
      
      {/* MBTI FLOW */}
      {screen === 'quiz_mbti' && (
        <QuizScreen 
          studentName={currentUser.name}
          studentId={currentUser.id}
          onComplete={handleCompleteMBTI}
          onCancel={handleRetake}
        />
      )}

      {screen === 'passport_mbti' && result && (
        <PassportScreen 
          result={result} 
          onRetake={handleRetake} 
        />
      )}

      {/* HOLLAND FLOW */}
      {screen === 'quiz_holland' && (
        <HollandQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteHolland}
            onCancel={handleRetake}
        />
      )}

      {screen === 'passport_holland' && result && (
          <HollandPassportScreen
            result={result}
            onRetake={handleRetake}
          />
      )}

      {/* IQ FLOW */}
      {screen === 'quiz_iq' && (
        <IQQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteIQ}
            onCancel={handleRetake}
        />
      )}

      {screen === 'passport_iq' && result && (
          <IQPassportScreen
            result={result}
            onRetake={handleRetake}
          />
      )}

      {/* EQ FLOW */}
      {screen === 'quiz_eq' && (
        <EQQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteEQ}
            onCancel={handleRetake}
        />
      )}

      {screen === 'passport_eq' && result && (
          <EQPassportScreen
            result={result}
            onRetake={handleRetake}
          />
      )}

      {/* DISC FLOW */}
      {screen === 'quiz_disc' && (
        <DISCQuizScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onComplete={handleCompleteDISC}
            onCancel={handleRetake}
        />
      )}

      {screen === 'passport_disc' && result && (
          <DISCPassportScreen
            result={result}
            onRetake={handleRetake}
          />
      )}

      {/* COMPREHENSIVE REPORT */}
      {screen === 'comprehensive_report' && (
          <ComprehensiveReportScreen
            studentName={currentUser.name}
            studentId={currentUser.id}
            onBack={handleRetake}
          />
      )}

      {/* ADMIN */}
      {screen === 'admin' && (
        <AdminDashboard 
          onBack={handleFullReset} 
        />
      )}
    </div>
  );
};

export default App;