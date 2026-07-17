import React from 'react';
import { motion } from 'framer-motion';

export type LucasRole = 'chef' | 'coach' | 'zen' | 'motivator';
export type LucasExpression = 'default' | 'happy' | 'sad' | 'thinking' | 'excited';

interface LucasAvatarProps {
  role?: LucasRole;
  expression?: LucasExpression;
  size?: number;
  animated?: boolean;
}

export const LucasAvatar: React.FC<LucasAvatarProps> = ({
  role = 'motivator',
  expression = 'default',
  size = 120,
  animated = true,
}) => {
  const isLarge = size >= 90;

  // Determine styling based on expression
  let imageFilter = 'none';
  let borderColor = '#22c55e'; // Vibrant green
  let glowColor = 'rgba(34, 197, 94, 0.4)';
  let glowIntensity = '0 0 12px';
  let overlayElement: React.ReactNode = null;

  if (expression === 'sad') {
    imageFilter = 'grayscale(0.8) contrast(1.1) brightness(0.7)';
    borderColor = '#38bdf8'; // Sad blue
    glowColor = 'rgba(56, 189, 248, 0.3)';
    overlayElement = <div className="absolute inset-0 bg-sky-500/10 mix-blend-color" />;
  } else if (expression === 'excited') {
    imageFilter = 'saturate(1.3) contrast(1.15)';
    borderColor = '#fbbf24'; // Golden excited
    glowColor = 'rgba(251, 191, 36, 0.5)';
    glowIntensity = '0 0 20px';
    overlayElement = (
      <div className="excited-aura-flames">
        <div className="flame-particle" style={{ left: '20%', animationDelay: '0.1s' }} />
        <div className="flame-particle" style={{ left: '50%', animationDelay: '0s' }} />
        <div className="flame-particle" style={{ left: '80%', animationDelay: '0.2s' }} />
      </div>
    );
  } else if (expression === 'happy') {
    borderColor = '#4ade80'; // Bright lime green
    glowColor = 'rgba(74, 222, 128, 0.6)';
    glowIntensity = '0 0 16px';
  } else if (expression === 'thinking') {
    borderColor = '#a3e635'; // Yellow-green
    glowColor = 'rgba(163, 230, 53, 0.4)';
    overlayElement = (
      <div className="thinking-bubble-indicator animate-bounce">
        🤔
      </div>
    );
  }

  // Animation variants matching float
  const floatVariants = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    excited: {
      y: [0, -8, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    sad: {
      y: [0, 2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const activeVariant = expression === 'excited' ? 'excited' : expression === 'sad' ? 'sad' : 'idle';

  return (
    <motion.div
      className={`lucas-avatar-container ${isLarge ? 'avatar-large' : 'avatar-small'} ${expression}`}
      style={{
        width: size,
        height: size,
        borderColor: borderColor,
        boxShadow: `${glowIntensity} ${glowColor}, inset 0 0 8px ${glowColor}`,
      }}
      variants={animated ? (floatVariants as any) : undefined}
      animate={animated ? activeVariant : undefined}
    >
      {/* High Fidelity PNG Image (Reference image from Alberto) */}
      <img
        src={isLarge ? '/lucas-body.png' : '/lucas-head.png'}
        alt="Lucas Mascot"
        className="lucas-png-image"
        style={{ filter: imageFilter }}
      />

      {/* Role specific hat or badge overlay */}
      {role === 'chef' && (
        <div className="role-chef-hat-overlay">
          👨‍🍳
        </div>
      )}
      {role === 'coach' && (
        <div className="role-coach-whistle-overlay">
          🏋️‍♂️
        </div>
      )}
      {role === 'zen' && (
        <div className="role-zen-halo-overlay" />
      )}

      {/* Expression overlays */}
      {overlayElement}

      <style>{`
        .lucas-avatar-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-style: solid;
          background-color: #0c1c12; /* Rich dark-green backing */
          transition: all 0.3s ease;
        }

        .avatar-large {
          border-width: 3px;
          border-radius: 20px;
        }

        .avatar-small {
          border-width: 2px;
          border-radius: 50%; /* Perfect circle for small map nodes */
        }

        .lucas-png-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: filter 0.3s ease;
        }

        .avatar-small .lucas-png-image {
          object-fit: contain;
          transform: scale(1.1); /* Zoom in on head */
        }

        /* Role overlays */
        .role-chef-hat-overlay, .role-coach-whistle-overlay {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--color-primary);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          border: 1.5px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 10;
        }

        .avatar-small .role-chef-hat-overlay, .avatar-small .role-coach-whistle-overlay {
          width: 18px;
          height: 18px;
          font-size: 0.65rem;
        }

        .role-zen-halo-overlay {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px dashed rgba(74, 222, 128, 0.4);
          animation: rotate-zen 10s linear infinite;
        }

        @keyframes rotate-zen {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Thinking indicator */
        .thinking-bubble-indicator {
          position: absolute;
          top: 6px;
          right: 6px;
          font-size: 1.25rem;
          background: white;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          z-index: 10;
        }

        /* Excited Flames */
        .excited-aura-flames {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          display: flex;
          justify-content: space-around;
          pointer-events: none;
          opacity: 0.85;
          z-index: 5;
        }

        .flame-particle {
          width: 8px;
          height: 8px;
          background-color: #fbbf24;
          border-radius: 50%;
          filter: blur(1px);
          animation: riseUp 0.6s infinite ease-out;
        }

        @keyframes riseUp {
          0% {
            transform: translateY(10px) scale(1);
            opacity: 1;
            background-color: #fbbf24;
          }
          50% {
            background-color: #f97316;
          }
          100% {
            transform: translateY(-20px) scale(0.2);
            opacity: 0;
            background-color: #ef4444;
          }
        }
      `}</style>
    </motion.div>
  );
};
