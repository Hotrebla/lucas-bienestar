import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Category } from '../context/GameContext';
import { LucasAvatar } from '../components/LucasAvatar';
import type { LucasRole } from '../components/LucasAvatar';
import { InstallPwaButton } from '../components/InstallPwaButton';
import { ChefHat, Dumbbell, Sparkles, Check, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const LearnView: React.FC = () => {
  const { user, lessons, startLesson } = useGame();
  const [activeCategory, setActiveCategory] = useState<Category>('nutrition');

  // Filter lessons for the active category
  const categoryLessons = lessons.filter((l) => l.category === activeCategory);

  // Find the first uncompleted lesson in the current category
  const firstIncomplete = categoryLessons.find((l) => !user?.history[l.id]) || categoryLessons[categoryLessons.length - 1];

  // Helper to determine node status
  const getNodeStatus = (lessonId: string, index: number) => {
    if (!user) return 'locked';
    if (user.history[lessonId]) return 'completed';
    
    // In our MVP, we allow playing any lesson in the active category,
    // or we can lock it if the previous one isn't completed.
    // Let's enforce sequential unlocking for a true game feel!
    if (index === 0) return 'active';
    
    const previousLesson = categoryLessons[index - 1];
    if (user.history[previousLesson.id]) {
      return 'active';
    }
    return 'locked';
  };

  // Category visual themes
  const getCategoryTheme = () => {
    switch (activeCategory) {
      case 'training':
        return {
          themeColor: 'var(--color-training)',
          bgColorLight: 'var(--color-training-light)',
          lucasRole: 'coach' as LucasRole,
          title: 'Entrenamiento',
          desc: 'RIR, técnica e intensidad con Lucas Coach 🏋️‍♂️'
        };
      case 'habits':
        return {
          themeColor: 'var(--color-habits)',
          bgColorLight: 'var(--color-habits-light)',
          lucasRole: 'zen' as LucasRole,
          title: 'Hábitos y Zen',
          desc: 'Sueño, hidratación y ansiedad con Lucas Zen 🧘‍♂️'
        };
      case 'nutrition':
      default:
        return {
          themeColor: 'var(--color-nutrition)',
          bgColorLight: 'var(--color-nutrition-light)',
          lucasRole: 'chef' as LucasRole,
          title: 'Nutrición',
          desc: 'Macronutrientes y porciones con Lucas Chef 👨‍🍳'
        };
    }
  };

  const theme = getCategoryTheme();

  // Zig-zag offsets for Duolingo path
  const getZigZagClass = (index: number) => {
    const mod = index % 3;
    if (mod === 0) return 'node-left';
    if (mod === 2) return 'node-right';
    return 'node-center';
  };

  return (
    <div className="learn-container">
      {/* Category selector */}
      <div className="category-tabs">
        <button
          className={`tab-btn ${activeCategory === 'nutrition' ? 'active nutrition' : ''}`}
          onClick={() => setActiveCategory('nutrition')}
        >
          <ChefHat size={18} />
          <span>Nutrición</span>
        </button>
        <button
          className={`tab-btn ${activeCategory === 'training' ? 'active training' : ''}`}
          onClick={() => setActiveCategory('training')}
        >
          <Dumbbell size={18} />
          <span>Entrenamiento</span>
        </button>
        <button
          className={`tab-btn ${activeCategory === 'habits' ? 'active habits' : ''}`}
          onClick={() => setActiveCategory('habits')}
        >
          <Sparkles size={18} />
          <span>Hábitos</span>
        </button>
      </div>

      <InstallPwaButton />

      {/* Path header */}
      <div className="path-header" style={{ borderColor: theme.themeColor }}>
        <h2 className="path-title">{theme.title}</h2>
        <p className="path-subtitle">{theme.desc}</p>
      </div>

      {/* Level Path Map */}
      <div className="path-map">
        {/* SVG for connecting lines */}
        <div className="connector-lines">
          <svg viewBox="0 0 100 500" width="100%" height="100%" preserveAspectRatio="none">
            {/* Draw curve path connecting nodes */}
            <path
              d="M 30,50 Q 50,130 70,210 T 30,370 T 50,450"
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {categoryLessons.map((lesson, idx) => {
          const status = getNodeStatus(lesson.id, idx);
          const isTarget = firstIncomplete?.id === lesson.id;
          const zigZagClass = getZigZagClass(idx);

          return (
            <div key={lesson.id} className={`node-row ${zigZagClass}`}>
              {/* Lucas speech bubble floating above target node */}
              {isTarget && status !== 'locked' && (
                <div className="mascot-speech-bubble">
                  <LucasAvatar role={theme.lucasRole} expression="happy" size={54} />
                  <div className="bubble-text">
                    <div className="bubble-arrow" />
                    ¡Comienza aquí!
                  </div>
                </div>
              )}

              {/* Lesson Node Button */}
              <div className="node-wrapper">
                <motion.button
                  className={`node-circle ${status}`}
                  onClick={() => status !== 'locked' && startLesson(lesson.id)}
                  style={{
                    backgroundColor: status === 'completed'
                      ? theme.themeColor
                      : status === 'active'
                      ? theme.themeColor
                      : 'var(--bg-app)',
                    borderColor: status === 'locked' ? 'var(--border-color)' : theme.themeColor,
                    boxShadow: status === 'locked' ? 'none' : `0 6px 0 ${status === 'completed' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.2)'}`
                  }}
                  whileHover={status !== 'locked' ? { scale: 1.08 } : {}}
                  whileTap={status !== 'locked' ? { scale: 0.95, y: 6 } : {}}
                >
                  {status === 'completed' ? (
                    <Check className="node-icon" size={24} strokeWidth={3} />
                  ) : status === 'locked' ? (
                    <Lock className="node-icon locked" size={20} />
                  ) : (
                    <Play className="node-icon active animate-pulse" size={22} fill="white" strokeWidth={1} />
                  )}
                </motion.button>

                {/* Node info popup / label */}
                <div className={`node-label ${status}`}>
                  <h4 className="node-label-title">{lesson.title}</h4>
                  <p className="node-label-reward">+{lesson.xpReward} XP</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .learn-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background-color: var(--bg-card);
          overflow-y: auto;
        }

        .category-tabs {
          width: 100%;
          display: flex;
          background-color: var(--bg-app);
          border-radius: 16px;
          padding: 4px;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 4px;
          border: none;
          background: none;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 12px;
          transition: all var(--transition-fast);
        }

        .tab-btn.active {
          color: #ffffff;
        }

        .tab-btn.active.nutrition {
          background-color: var(--color-nutrition);
        }

        .tab-btn.active.training {
          background-color: var(--color-training);
        }

        .tab-btn.active.habits {
          background-color: var(--color-habits);
        }

        .path-header {
          width: 100%;
          padding: 16px;
          border-radius: 20px;
          border-left: 5px solid;
          background-color: var(--bg-app);
          text-align: left;
          margin-bottom: 30px;
        }

        .path-title {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .path-subtitle {
          font-size: 0.85rem;
          margin-top: 4px;
        }

        /* Map styling */
        .path-map {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px;
          position: relative;
          padding: 20px 0 60px 0;
          min-height: 480px;
        }

        .connector-lines {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 10%;
          right: 10%;
          z-index: 1;
          opacity: 0.4;
          pointer-events: none;
        }

        .node-row {
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 2;
          position: relative;
        }

        .node-left {
          justify-content: flex-start;
          padding-left: 20%;
        }

        .node-right {
          justify-content: flex-end;
          padding-right: 20%;
        }

        .node-center {
          justify-content: center;
        }

        .node-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .node-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: 4px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          color: white;
          position: relative;
        }

        .node-circle.locked {
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .node-icon.locked {
          color: var(--text-muted);
        }

        .node-icon.active {
          animation: pulse-node 1.5s infinite;
        }

        @keyframes pulse-node {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Mascot bubble above active node */
        .mascot-speech-bubble {
          position: absolute;
          top: -75px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 5;
        }

        .bubble-text {
          background-color: var(--text-primary);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          position: relative;
          box-shadow: var(--shadow-sm);
          white-space: nowrap;
          margin-top: -8px;
          animation: bounce-bubble 2s infinite ease-in-out;
        }

        @keyframes bounce-bubble {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .bubble-arrow {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid var(--text-primary);
        }

        /* Node Labels */
        .node-label {
          margin-top: 8px;
          text-align: center;
          width: 140px;
          background-color: var(--bg-card);
          padding: 6px 10px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .node-label.locked {
          opacity: 0.6;
        }

        .node-label-title {
          font-size: 0.75rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .node-label-reward {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-xp);
        }
      `}</style>
    </div>
  );
};
