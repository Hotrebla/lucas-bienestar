import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Question, Slide } from '../context/GameContext';
import { LucasAvatar } from '../components/LucasAvatar';
import type { LucasRole, LucasExpression } from '../components/LucasAvatar';
import { X, Heart, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LessonView: React.FC = () => {
  const { currentLesson, user, completeLesson, loseHeart, exitLesson } = useGame();
  
  // Lesson progression states
  const [stage, setStage] = useState<'slides' | 'quiz' | 'results' | 'failed'>('slides');
  const [slideIdx, setSlideIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [localHearts, setLocalHearts] = useState(user?.hearts ?? 5);

  if (!currentLesson || !user) return null;

  const slides = currentLesson.slides;
  const quiz = currentLesson.quiz;
  const activeSlide: Slide = slides[slideIdx];
  const activeQuestion: Question = quiz[quizIdx];

  // Progression calculation
  const getProgressPercentage = () => {
    if (stage === 'slides') {
      return ((slideIdx + 1) / slides.length) * 100;
    }
    if (stage === 'quiz') {
      return ((quizIdx) / quiz.length) * 100;
    }
    return 100;
  };

  // Slide navigation
  const nextSlide = () => {
    if (slideIdx < slides.length - 1) {
      setSlideIdx(slideIdx + 1);
    } else {
      setStage('quiz');
    }
  };

  const prevSlide = () => {
    if (slideIdx > 0) {
      setSlideIdx(slideIdx - 1);
    }
  };

  // Quiz submission
  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === activeQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (!correct) {
      // Deduct heart
      const nextHearts = Math.max(0, localHearts - 1);
      setLocalHearts(nextHearts);
      loseHeart();
      if (nextHearts <= 0) {
        // Wait for user to click continue, then go to failed
      }
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (localHearts <= 0) {
      setStage('failed');
      return;
    }

    if (quizIdx < quiz.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      setStage('results');
    }
  };

  // Complete lesson
  const finishLesson = () => {
    completeLesson(currentLesson.id, localHearts);
  };

  // Helper for mascot expressions
  const getQuizMascotExpression = (): LucasExpression => {
    if (!isAnswered) return 'default';
    return isCorrect ? 'excited' : 'sad';
  };

  return (
    <div className="lesson-container-overlay">
      {/* Top Header Bar */}
      <div className="lesson-header">
        <button className="close-btn" onClick={exitLesson}>
          <X size={24} />
        </button>

        {/* Custom Progress Bar */}
        <div className="progress-track">
          <motion.div
            className="progress-bar"
            style={{
              width: `${getProgressPercentage()}%`,
              backgroundColor:
                currentLesson.category === 'nutrition'
                  ? 'var(--color-nutrition)'
                  : currentLesson.category === 'training'
                  ? 'var(--color-training)'
                  : 'var(--color-habits)',
            }}
            layout
          />
        </div>

        {/* Lives Count */}
        <div className="hearts-display">
          <Heart className="heart-icon active" />
          <span className="heart-text">{localHearts}</span>
        </div>
      </div>

      {/* Main Core View Area */}
      <div className="lesson-content">
        <AnimatePresence mode="wait">
          {/* SLIDES STAGE */}
          {stage === 'slides' && (
            <motion.div
              key={`slide-${slideIdx}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="slide-content-wrapper"
            >
              {/* Mascot showing theory */}
              <div className="avatar-speech-container">
                <LucasAvatar
                  role={activeSlide.illustrationRole as LucasRole}
                  expression={activeSlide.illustrationExpression as LucasExpression}
                  size={150}
                />
                <div className="speech-bubble-card">
                  <div className="speech-arrow-left" />
                  <h3 className="speech-title">{activeSlide.title}</h3>
                  <p className="speech-text">{activeSlide.content}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUIZ STAGE */}
          {stage === 'quiz' && (
            <motion.div
              key={`quiz-${quizIdx}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="quiz-content-wrapper"
            >
              <h2 className="question-title">{activeQuestion.question}</h2>

              {/* Lucas Reacting in real time */}
              <div className="mascot-reaction-row">
                <LucasAvatar
                  role={
                    currentLesson.category === 'nutrition'
                      ? 'chef'
                      : currentLesson.category === 'training'
                      ? 'coach'
                      : 'zen'
                  }
                  expression={getQuizMascotExpression()}
                  size={100}
                />
              </div>

              {/* Options */}
              <div className="options-grid">
                {activeQuestion.options.map((option, idx) => {
                  let optionClass = '';
                  if (selectedOption === idx) optionClass = 'selected';
                  if (isAnswered) {
                    if (idx === activeQuestion.correctAnswer) optionClass = 'correct';
                    else if (selectedOption === idx) optionClass = 'incorrect';
                    else optionClass = 'disabled';
                  }

                  return (
                    <button
                      key={idx}
                      className={`option-btn ${optionClass}`}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                    >
                      <span className="option-number">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-text">{option}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RESULTS STAGE */}
          {stage === 'results' && (
            <motion.div
              key="results-screen"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="results-content-wrapper"
            >
              <LucasAvatar role="motivator" expression="excited" size={160} />
              <h1 className="results-title">¡Lección Completada!</h1>
              <p className="results-subtitle">Has dado un paso más hacia tu bienestar saludable.</p>

              <div className="results-stats-row">
                <div className="result-stat-box">
                  <span className="stat-box-label">XP Ganados</span>
                  <div className="stat-box-value xp">
                    <Sparkles size={20} />
                    +{currentLesson.xpReward} XP
                  </div>
                </div>

                <div className="result-stat-box">
                  <span className="stat-box-label">Racha Actual</span>
                  <div className="stat-box-value streak">
                    {user.currentStreak} 🔥
                  </div>
                </div>
              </div>

              <div className="celebration-badge">
                <CheckCircle2 color="var(--color-success)" size={32} />
                <span>¡Sigue así, estás construyendo constancia!</span>
              </div>
            </motion.div>
          )}

          {/* FAILED STAGE (Out of Hearts) */}
          {stage === 'failed' && (
            <motion.div
              key="failed-screen"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="results-content-wrapper"
            >
              <LucasAvatar role="motivator" expression="sad" size={160} />
              <h1 className="results-title error">¡Te quedaste sin vidas!</h1>
              <p className="results-subtitle">
                Los errores son parte del aprendizaje. Lucas te recomienda estudiar las lecciones previas o unirte a nuestro Plan Premium para vidas infinitas.
              </p>

              <div className="cta-box card">
                <h3>¿Quieres Vidas Infinitas? ❤️♾️</h3>
                <p>Únete a nuestro servicio personalizado premium y llévate asesoramiento real al 100%.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Bottom Controls / Buttons */}
      <div className={`lesson-footer ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
        {/* Slides bottom controls */}
        {stage === 'slides' && (
          <div className="footer-slide-buttons">
            <button className="btn btn-secondary" onClick={prevSlide} disabled={slideIdx === 0}>
              <ArrowLeft size={18} /> Atrás
            </button>
            <button
              className="btn btn-primary"
              onClick={nextSlide}
              style={{
                backgroundColor:
                  currentLesson.category === 'nutrition'
                    ? 'var(--color-nutrition)'
                    : currentLesson.category === 'training'
                    ? 'var(--color-training)'
                    : 'var(--color-habits)',
                boxShadow: `0 4px 0 ${
                  currentLesson.category === 'nutrition'
                    ? '#ea580c'
                    : currentLesson.category === 'training'
                    ? '#2563eb'
                    : '#059669'
                }`
              }}
            >
              {slideIdx === slides.length - 1 ? 'Iniciar Quiz' : 'Siguiente'} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Quiz check / submit bottom panel */}
        {stage === 'quiz' && (
          <div className="footer-quiz-panel">
            {!isAnswered ? (
              <div className="footer-quiz-actions">
                <button
                  className={`btn ${selectedOption !== null ? 'btn-primary' : 'btn-disabled'}`}
                  disabled={selectedOption === null}
                  onClick={checkAnswer}
                  style={selectedOption !== null ? {
                    backgroundColor:
                      currentLesson.category === 'nutrition'
                        ? 'var(--color-nutrition)'
                        : currentLesson.category === 'training'
                        ? 'var(--color-training)'
                        : 'var(--color-habits)',
                    boxShadow: `0 4px 0 ${
                      currentLesson.category === 'nutrition'
                        ? '#ea580c'
                        : currentLesson.category === 'training'
                        ? '#2563eb'
                        : '#059669'
                    }`
                  } : {}}
                >
                  Comprobar Respuesta
                </button>
              </div>
            ) : (
              <div className="footer-feedback-panel animate-slideUp">
                <div className="feedback-message-row">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 color="var(--color-success)" size={28} />
                      <div className="feedback-text">
                        <strong className="correct-title">¡Excelente trabajo!</strong>
                        <p className="feedback-desc">¡Muy bien! Estás en lo correcto.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle color="var(--color-error)" size={28} />
                      <div className="feedback-text">
                        <strong className="incorrect-title">Incorrecto</strong>
                        <p className="feedback-desc">{activeQuestion.explanation}</p>
                      </div>
                    </>
                  )}
                </div>
                <button className={`btn ${isCorrect ? 'btn-success' : 'btn-primary'}`} onClick={nextQuestion}>
                  Continuar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results page buttons */}
        {stage === 'results' && (
          <div className="footer-slide-buttons">
            <button className="btn btn-success finish-btn" onClick={finishLesson}>
              Volver al Mapa <CheckCircle2 size={18} />
            </button>
          </div>
        )}

        {/* Failed page buttons */}
        {stage === 'failed' && (
          <div className="footer-slide-buttons">
            <button className="btn btn-secondary" onClick={exitLesson}>
              Volver al Mapa
            </button>
            <button className="btn btn-primary" onClick={exitLesson}>
              Plan Elite 🚀
            </button>
          </div>
        )}
      </div>

      <style>{`
        .lesson-container-overlay {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--mobile-width);
          height: 100vh;
          background-color: var(--bg-card);
          z-index: 100;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          border-left: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
        }

        .lesson-header {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid var(--border-color);
          gap: 12px;
        }

        .close-btn {
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }

        .progress-track {
          flex: 1;
          height: 14px;
          background-color: var(--bg-app);
          border-radius: 7px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 7px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hearts-display {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
          font-size: 1rem;
        }

        .heart-icon.active {
          color: var(--color-hearts);
          fill: var(--color-hearts);
        }

        /* Content Scrollable */
        .lesson-content {
          flex: 1;
          padding: 24px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* Slides styling */
        .slide-content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 70%;
          gap: 20px;
        }

        .avatar-speech-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .speech-bubble-card {
          width: 100%;
          background-color: var(--bg-app);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          padding: 20px;
          text-align: left;
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .speech-arrow-left {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 12px solid var(--border-color);
        }

        .speech-title {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .speech-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Quiz styling */
        .quiz-content-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .question-title {
          font-size: 1.25rem;
          color: var(--text-primary);
          text-align: left;
          font-weight: 700;
        }

        .mascot-reaction-row {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          border: 2px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.1s ease;
          box-shadow: 0 4px 0 var(--border-color);
        }

        .option-btn:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 var(--border-color);
        }

        .option-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 2px solid var(--border-color);
          font-weight: 800;
          color: var(--text-secondary);
          background-color: var(--bg-app);
        }

        /* Option Classes States */
        .option-btn.selected {
          border-color: var(--color-primary);
          box-shadow: 0 4px 0 #4f46e5;
          background-color: var(--color-primary-light);
        }
        
        .option-btn.selected .option-number {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .option-btn.correct {
          border-color: var(--color-success);
          box-shadow: 0 4px 0 #059669;
          background-color: var(--color-habits-light);
        }

        .option-btn.correct .option-number {
          border-color: var(--color-success);
          color: white;
          background-color: var(--color-success);
        }

        .option-btn.incorrect {
          border-color: var(--color-error);
          box-shadow: 0 4px 0 #b91c1c;
          background-color: rgba(239, 68, 68, 0.08);
        }

        .option-btn.incorrect .option-number {
          border-color: var(--color-error);
          color: white;
          background-color: var(--color-error);
        }

        .option-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Results styling */
        .results-content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          padding: 20px 0;
        }

        .results-title {
          font-size: 1.8rem;
          color: var(--text-primary);
        }

        .results-title.error {
          color: var(--color-error);
        }

        .results-subtitle {
          font-size: 0.95rem;
          max-width: 320px;
        }

        .results-stats-row {
          display: flex;
          width: 100%;
          gap: 16px;
          margin-top: 10px;
        }

        .result-stat-box {
          flex: 1;
          background-color: var(--bg-app);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-box-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-box-value {
          font-size: 1.15rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .stat-box-value.xp {
          color: var(--color-xp);
        }

        .stat-box-value.streak {
          color: var(--color-streak);
        }

        .celebration-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--color-habits-light);
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-success);
          margin-top: 10px;
        }

        .cta-box {
          border-width: 3px;
          border-color: var(--color-streak);
          background-color: var(--color-nutrition-light);
          text-align: left;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        /* Footer Controls */
        .lesson-footer {
          height: 100px;
          border-top: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          background-color: var(--bg-card);
        }

        .footer-slide-buttons {
          display: flex;
          width: 100%;
          justify-content: space-between;
          gap: 16px;
        }

        .finish-btn {
          width: 100%;
          padding: 16px;
        }

        .footer-slide-buttons .btn {
          flex: 1;
        }

        .footer-quiz-panel {
          width: 100%;
        }

        .footer-quiz-actions {
          display: flex;
          width: 100%;
        }

        .footer-quiz-actions .btn {
          width: 100%;
          padding: 16px;
        }

        /* Feedback footer states */
        .lesson-footer.correct {
          background-color: var(--color-habits-light);
          border-top-color: rgba(16, 185, 129, 0.3);
        }

        .lesson-footer.incorrect {
          background-color: rgba(239, 68, 68, 0.08);
          border-top-color: rgba(239, 68, 68, 0.2);
        }

        .footer-feedback-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 12px;
        }

        .feedback-message-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
          flex: 1;
        }

        .feedback-text {
          display: flex;
          flex-direction: column;
        }

        .correct-title {
          color: var(--color-success);
          font-size: 1rem;
        }

        .incorrect-title {
          color: var(--color-error);
          font-size: 1rem;
        }

        .feedback-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
