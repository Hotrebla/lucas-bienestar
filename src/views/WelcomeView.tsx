import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LucasAvatar } from '../components/LucasAvatar';
import { Sparkles } from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { login } = useGame();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    setError('');
    login(name, email);
  };

  return (
    <div className="welcome-container">
      <div className="hero-section">
        <LucasAvatar role="motivator" expression="happy" size={160} />
        <h1 className="welcome-title">
          ¡Aprende con <span className="highlight-text">Lucas</span>!
        </h1>
        <p className="welcome-subtitle">
          Nutrición, entrenamiento y hábitos saludables de forma divertida y adictiva.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-card card">
        <h2 className="form-title">Crea tu Perfil</h2>
        <p className="form-subtitle">Para guardar tu racha y tus puntos de experiencia (XP).</p>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label htmlFor="name" className="input-label">Tu Nombre</label>
          <input
            type="text"
            id="name"
            placeholder="Ej: Alberto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email" className="input-label">Tu Correo Electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-input"
            required
          />
        </div>

        <button type="submit" className="btn btn-success submit-btn">
          ¡Empezar a Jugar! <Sparkles size={18} />
        </button>
      </form>

      <style>{`
        .welcome-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          min-height: 100vh;
          gap: 32px;
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-app) 100%);
        }

        .hero-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          max-width: 90%;
        }

        .welcome-title {
          font-size: 2.2rem;
          margin-top: 12px;
          color: var(--text-primary);
        }

        .highlight-text {
          color: var(--color-primary);
          position: relative;
        }

        .welcome-subtitle {
          font-size: 1rem;
          max-width: 320px;
          margin: 0 auto;
        }

        .form-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border-width: 3px;
        }

        .form-title {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .form-subtitle {
          font-size: 0.85rem;
          margin-top: -12px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .input-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .text-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 2px solid var(--border-color);
          background-color: var(--bg-app);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .text-input:focus {
          border-color: var(--color-primary);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.1rem;
          margin-top: 10px;
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          padding: 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: left;
          border-left: 4px solid var(--color-error);
        }
      `}</style>
    </div>
  );
};
