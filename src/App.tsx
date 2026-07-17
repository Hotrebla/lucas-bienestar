import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeView } from './views/WelcomeView';
import { LearnView } from './views/LearnView';
import { ProfileView } from './views/ProfileView';
import { EliteView } from './views/EliteView';
import { LessonView } from './views/LessonView';
import { LucasAvatar } from './components/LucasAvatar';
import './App.css';

const AppContent: React.FC = () => {
  const { user, activeTab, currentLesson, loadingLesson } = useGame();

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

        {/* Fullscreen Loading Overlay for AI dynamic generation */}
        {loadingLesson && (
          <div className="ai-loading-overlay">
            <div className="ai-loading-card card">
              <WelcomeLoadingAvatar />
              <div className="pulse-loader" />
              <h3 className="loading-title">Lucas está pensando...</h3>
              <p className="loading-text">
                Redactando la teoría del nivel y estructurando tu quiz interactivo. ¡Un momento por favor!
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ai-loading-overlay {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease-out;
        }

        .ai-loading-card {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding: 30px 20px;
          border-width: 3px;
          border-color: var(--color-primary);
          background-color: var(--bg-card);
        }

        .pulse-loader {
          width: 48px;
          height: 8px;
          background-color: var(--color-primary);
          border-radius: 4px;
          animation: pulse-width 1.2s infinite ease-in-out;
        }

        @keyframes pulse-width {
          0%, 100% {
            transform: scaleX(0.4);
            opacity: 0.5;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 1;
          }
        }

        .loading-title {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .loading-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Helper internal component to render Lucas Avatar with a thinking state for the loader
const WelcomeLoadingAvatar: React.FC = () => {
  // Try to determine the category theme
  // Default to motivator, or check active route
  return (
    <div className="animate-bounce">
      <img src="" style={{ display: 'none' }} alt="" /> {/* empty img to avoid warning */}
      <span style={{ display: 'none' }}>Loader</span>
      {/* We import the LucasAvatar directly */}
      <LucasAvatar role="motivator" expression="thinking" size={120} />
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
