import React from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, User, Flame } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { user, activeTab, setTab } = useGame();

  if (!user) return null;

  return (
    <nav className="bottom-nav-container">
      {/* Learn Tab */}
      <button
        className={`nav-button ${activeTab === 'learn' ? 'active' : ''}`}
        onClick={() => setTab('learn')}
      >
        <BookOpen className="nav-icon" />
        <span className="nav-label">Aprender</span>
      </button>

      {/* Elite / Premium Tab */}
      <button
        className={`nav-button elite-button ${activeTab === 'elite' ? 'active' : ''}`}
        onClick={() => setTab('elite')}
      >
        <Flame className="nav-icon spark" />
        <span className="nav-label">Plan Elite</span>
      </button>

      {/* Profile Tab */}
      <button
        className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setTab('profile')}
      >
        <User className="nav-icon" />
        <span className="nav-label">Perfil</span>
      </button>

      <style>{`
        .bottom-nav-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background-color: var(--bg-card);
          border-top: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 10;
        }

        .nav-button {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          width: 30%;
          height: 100%;
          gap: 4px;
          transition: all var(--transition-fast);
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          stroke-width: 2px;
          transition: transform var(--transition-fast);
        }

        .nav-label {
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Active State */
        .nav-button.active {
          color: var(--color-primary);
        }

        .nav-button.active .nav-icon {
          transform: scale(1.1);
        }

        /* Elite Plan Tab styling (stands out) */
        .elite-button {
          color: var(--text-secondary);
        }

        .elite-button.active {
          color: var(--color-streak) !important;
        }

        .spark {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            filter: drop-shadow(0 0 0 rgba(249, 115, 22, 0.4));
          }
          70% {
            filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8));
          }
          100% {
            filter: drop-shadow(0 0 0 rgba(249, 115, 22, 0));
          }
        }
      `}</style>
    </nav>
  );
};
