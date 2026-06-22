import React from 'react';
import { useGame } from '../context/GameContext';
import { LucasAvatar } from '../components/LucasAvatar';
import { CheckCircle, Heart, Shield, Sparkles, ExternalLink } from 'lucide-react';

export const EliteView: React.FC = () => {
  const { refillHearts, user } = useGame();
  
  // Get external redirection URL from environment variable
  const conversionUrl = import.meta.env.VITE_CONVERSION_URL || 'https://bienestarsinexcusas.com/plan-elite';

  const handleCtaClick = () => {
    window.open(conversionUrl, '_blank');
  };

  return (
    <div className="elite-container animate-fadeIn">
      {/* Animated Header */}
      <div className="elite-hero card">
        <div className="fire-glow" />
        <LucasAvatar role="motivator" expression="excited" size={130} />
        <h1 className="elite-title">
          <span className="fire-text">PLAN ELITE</span>
        </h1>
        <p className="elite-subtitle">El Ecosistema de Bienestar Sin Excusas</p>
      </div>

      {/* Lives restoration section */}
      {user && user.hearts < 5 && (
        <div className="lives-card card">
          <div className="lives-header">
            <Heart size={32} fill="var(--color-hearts)" color="var(--color-hearts)" className="animate-pulse" />
            <div>
              <h3>¿Te quedaste sin vidas?</h3>
              <p>Rellena tus corazones para seguir jugando.</p>
            </div>
          </div>
          <button className="btn btn-success refill-btn" onClick={refillHearts}>
            Rellenar Corazones gratis (Demo)
          </button>
        </div>
      )}

      {/* Pitch Card */}
      <div className="pitch-card card">
        <h2 className="pitch-heading">
          Lleva tu salud al siguiente nivel <Sparkles size={20} className="sparkle-icon" />
        </h2>
        <p className="pitch-desc">
          Jugar te enseña la teoría, pero el **Plan Elite de 28 Días** te da el plan práctico y personalizado para transformar tu cuerpo y tu salud con asesoría directa.
        </p>

        <div className="features-list">
          <div className="feature-item">
            <CheckCircle className="feature-check" />
            <span>Plan de alimentación 100% personalizado.</span>
          </div>
          <div className="feature-item">
            <CheckCircle className="feature-check" />
            <span>Rutina de entrenamiento adaptada a tu nivel y lugar de entrenamiento.</span>
          </div>
          <div className="feature-item">
            <CheckCircle className="feature-check" />
            <span>Contacto directo por WhatsApp con tu coach de Bienestar Sin Excusas.</span>
          </div>
          <div className="feature-item">
            <CheckCircle className="feature-check" />
            <span>Acceso a recetas exclusivas de Lucas Chef.</span>
          </div>
        </div>

        <button className="btn btn-primary cta-btn" onClick={handleCtaClick}>
          Conoce el Plan Elite <ExternalLink size={18} />
        </button>
      </div>

      <div className="guarantee-box">
        <Shield size={16} />
        <span>Garantía de Satisfacción de Bienestar Sin Excusas</span>
      </div>

      <style>{`
        .elite-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          gap: 20px;
          background-color: var(--bg-card);
          overflow-y: auto;
        }

        .elite-hero {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
          border-color: var(--color-streak);
          border-width: 3px;
        }

        @media (prefers-color-scheme: light) {
          .elite-hero {
            background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%);
          }
        }

        .fire-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 60%);
          pointer-events: none;
          animation: rotate-glow 20s infinite linear;
        }

        @keyframes rotate-glow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .elite-title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          margin-top: 10px;
        }

        .fire-text {
          background: linear-gradient(90deg, #f97316, #ef4444, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .elite-subtitle {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: -6px;
        }

        /* Lives refill section */
        .lives-card {
          width: 100%;
          border-color: var(--color-hearts);
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background-color: rgba(239, 68, 68, 0.03);
        }

        .lives-header {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }

        .lives-header h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .lives-header p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .refill-btn {
          width: 100%;
          padding: 12px;
          font-size: 0.95rem;
        }

        /* Pitch card */
        .pitch-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
          border-width: 2.5px;
        }

        .pitch-heading {
          font-size: 1.3rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sparkle-icon {
          color: var(--color-xp);
        }

        .pitch-desc {
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 6px 0;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .feature-check {
          color: var(--color-success);
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          margin-top: 2px;
        }

        .cta-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.1rem;
          background-color: var(--color-streak);
          box-shadow: 0 4px 0 #c2410c;
        }

        .cta-btn:active {
          box-shadow: 0 0px 0 #c2410c;
        }

        .guarantee-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
