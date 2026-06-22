import React from 'react';
import { useGame } from '../context/GameContext';
import { Star, Heart, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, setTab } = useGame();

  if (!user) return null;

  return (
    <header className="header-container">
      {/* Level Info */}
      <div className="header-stat" onClick={() => setTab('profile')}>
        <Star className="stat-icon xp" />
        <span className="stat-text">
          Nivel <strong className="highlight">{user.level}</strong>
        </span>
      </div>

      {/* Streak */}
      <div className="header-stat" onClick={() => setTab('profile')}>
        <motion.div
          animate={user.currentStreak > 0 ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Flame className={`stat-icon streak ${user.currentStreak > 0 ? 'active' : ''}`} />
        </motion.div>
        <span className="stat-text">
          <strong className="highlight">{user.currentStreak}</strong> {user.currentStreak === 1 ? 'día' : 'días'}
        </span>
      </div>

      {/* Hearts/Lives */}
      <div className="header-stat" onClick={() => setTab('elite')}>
        <motion.div
          animate={user.hearts <= 1 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Heart className={`stat-icon hearts ${user.hearts > 0 ? 'active' : ''}`} />
        </motion.div>
        <span className="stat-text">
          <strong className="highlight">{user.hearts}</strong>
        </span>
      </div>

      <style>{`
        .header-container {
          height: var(--header-height);
          background-color: var(--bg-card);
          border-bottom: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 16px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.9);
        }

        @media (prefers-color-scheme: dark) {
          .header-container {
            background-color: rgba(30, 41, 59, 0.9);
          }
        }

        .header-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 12px;
          transition: background-color var(--transition-fast);
        }

        .header-stat:hover {
          background-color: var(--bg-app);
        }

        .stat-icon {
          width: 22px;
          height: 22px;
          stroke-width: 2.5px;
          color: var(--text-muted);
        }

        .stat-icon.xp {
          color: var(--color-xp);
          fill: var(--color-xp);
        }

        .stat-icon.streak.active {
          color: var(--color-streak);
          fill: var(--color-streak);
          filter: drop-shadow(0 2px 4px rgba(249, 115, 22, 0.4));
        }

        .stat-icon.hearts.active {
          color: var(--color-hearts);
          fill: var(--color-hearts);
          filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.4));
        }

        .highlight {
          color: var(--text-primary);
          font-size: 1rem;
        }
      `}</style>
    </header>
  );
};
