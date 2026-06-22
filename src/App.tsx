import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeView } from './views/WelcomeView';
import { LearnView } from './views/LearnView';
import { ProfileView } from './views/ProfileView';
import { EliteView } from './views/EliteView';
import { LessonView } from './views/LessonView';
import './App.css';

const AppContent: React.FC = () => {
  const { user, activeTab, currentLesson } = useGame();

  // If user is not logged in, show the welcome screen
  if (!user) {
    return (
      <div className="app-container">
        <div className="mobile-view">
          <WelcomeView />
        </div>
      </div>
    );
  }

  // Active Tab Selector
  const renderActiveView = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileView />;
      case 'elite':
        return <EliteView />;
      case 'learn':
      default:
        return <LearnView />;
    }
  };

  return (
    <div className="app-container">
      <div className="mobile-view">
        {/* Persistent top stats bar */}
        <Header />

        {/* Dynamic Active view (Learn, Profile, Elite) */}
        {renderActiveView()}

        {/* Persistent bottom navigation bar */}
        <BottomNav />

        {/* Playable Lesson/Quiz Overlay Engine */}
        {currentLesson && <LessonView />}
      </div>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
