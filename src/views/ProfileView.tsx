import React from 'react';
import { useGame } from '../context/GameContext';
import { LucasAvatar } from '../components/LucasAvatar';
import { Star, Flame, Heart, LogOut, CheckCircle2, Award } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, lessons, logout } = useGame();

  if (!user) return null;

  // Calculate completed lessons
  const totalLessons = lessons.length;
  const completedCount = Object.keys(user.history).length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="profile-container animate-fadeIn">
      {/* Avatar Card */}
      <div className="profile-hero card">
        <LucasAvatar role="motivator" expression={user.currentStreak > 1 ? 'excited' : 'default'} size={120} />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <span className="profile-level-badge">Nivel {user.level}</span>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Stat: Total XP */}
        <div className="stat-card card">
          <div className="stat-card-header">
            <Star className="stat-card-icon xp" />
            <span className="stat-card-title">Puntos XP</span>
          </div>
          <span className="stat-card-value">{user.xp} XP</span>
        </div>

        {/* Stat: Streak */}
        <div className="stat-card card">
          <div className="stat-card-header">
            <Flame className="stat-card-icon streak" />
            <span className="stat-card-title">Racha Máxima</span>
          </div>
          <span className="stat-card-value">{user.maxStreak} {user.maxStreak === 1 ? 'día' : 'días'}</span>
        </div>

        {/* Stat: Hearts */}
        <div className="stat-card card">
          <div className="stat-card-header">
            <Heart className="stat-card-icon hearts" />
            <span className="stat-card-title">Vidas</span>
          </div>
          <span className="stat-card-value">{user.hearts} / 5</span>
        </div>

        {/* Stat: Progress */}
        <div className="stat-card card">
          <div className="stat-card-header">
            <Award className="stat-card-icon progress" />
            <span className="stat-card-title">Progreso</span>
          </div>
          <span className="stat-card-value">{completionPercentage}%</span>
        </div>
      </div>

      {/* List of completed lessons */}
      <div className="history-section card">
        <h3 className="section-title">Lecciones Completadas</h3>
        {completedCount === 0 ? (
          <p className="no-history-text">Aún no has completado ninguna lección. ¡Ve al mapa para empezar!</p>
        ) : (
          <div className="history-list">
            {lessons.map((lesson) => {
              const isCompleted = !!user.history[lesson.id];
              return (
                <div key={lesson.id} className={`history-item ${isCompleted ? 'completed' : ''}`}>
                  <div className="history-item-info">
                    <CheckCircle2
                      size={20}
                      className={`history-check-icon ${isCompleted ? 'active' : ''}`}
                    />
                    <div>
                      <h4 className="history-item-title">{lesson.title}</h4>
                      <span className="history-item-category">
                        {lesson.category === 'nutrition'
                          ? 'Nutrición'
                          : lesson.category === 'training'
                          ? 'Entrenamiento'
                          : 'Hábitos'}
                      </span>
                    </div>
                  </div>
                  {isCompleted && <span className="completed-badge">Completado</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log out */}
      <button className="btn btn-secondary logout-btn" onClick={logout}>
        <LogOut size={18} /> Cerrar Sesión
      </button>

      <style>{`
        .profile-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          gap: 20px;
          background-color: var(--bg-card);
          overflow-y: auto;
        }

        .profile-hero {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          border-width: 3px;
        }

        .profile-name {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .profile-email {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: -8px;
        }

        .profile-level-badge {
          background-color: var(--color-primary);
          color: white;
          padding: 6px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-card-icon {
          width: 18px;
          height: 18px;
        }

        .stat-card-icon.xp {
          color: var(--color-xp);
          fill: var(--color-xp);
        }

        .stat-card-icon.streak {
          color: var(--color-streak);
          fill: var(--color-streak);
        }

        .stat-card-icon.hearts {
          color: var(--color-hearts);
          fill: var(--color-hearts);
        }

        .stat-card-icon.progress {
          color: var(--color-primary);
        }

        .stat-card-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .stat-card-value {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          text-align: left;
        }

        /* History styling */
        .history-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .section-title {
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .no-history-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border-radius: 12px;
          background-color: var(--bg-app);
          opacity: 0.6;
        }

        .history-item.completed {
          opacity: 1;
        }

        .history-item-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-check-icon {
          color: var(--text-muted);
        }

        .history-check-icon.active {
          color: var(--color-success);
        }

        .history-item-title {
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .history-item-category {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .completed-badge {
          background-color: var(--color-habits-light);
          color: var(--color-success);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .logout-btn {
          width: 100%;
          padding: 14px;
          margin-top: 10px;
          color: var(--color-error);
          border-color: rgba(239, 68, 68, 0.2);
          box-shadow: 0 4px 0 rgba(239, 68, 68, 0.1);
        }

        .logout-btn:active {
          box-shadow: 0 0px 0 rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};
