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
  // Theme colors for Lucas based on role
  const getThemeColors = () => {
    switch (role) {
      case 'chef':
        return { primary: '#f97316', secondary: '#ffedd5', accent: '#ea580c' }; // Orange
      case 'coach':
        return { primary: '#3b82f6', secondary: '#dbeafe', accent: '#2563eb' }; // Blue
      case 'zen':
        return { primary: '#10b981', secondary: '#d1fae5', accent: '#059669' }; // Green
      case 'motivator':
      default:
        return { primary: '#6366f1', secondary: '#e0e7ff', accent: '#4f46e5' }; // Indigo
    }
  };

  const colors = getThemeColors();

  // Animation variants
  const floatVariants: any = {
    idle: {
      y: [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    excited: {
      y: [0, -12, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
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

  // Render facial features based on expression
  const renderFace = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy Eyes: ^^ */}
            <path d="M 28 42 Q 33 36 38 42" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 62 42 Q 67 36 72 42" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Big Smile */}
            <path d="M 38 56 Q 50 68 62 56" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="#f43f5e" />
            {/* Blush cheeks */}
            <circle cx="24" cy="48" r="5" fill="#f43f5e" opacity="0.3" />
            <circle cx="76" cy="48" r="5" fill="#f43f5e" opacity="0.3" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad Eyes: / \ */}
            <path d="M 28 45 L 38 41" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 62 41 L 72 45" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            {/* Frown Mouth */}
            <path d="M 42 60 Q 50 52 58 60" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Teardrop */}
            <motion.path
              d="M 30 48 Q 30 58 26 58 Q 22 58 26 48 Z"
              fill="#38bdf8"
              animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Uneven eyebrows */}
            <path d="M 26 34 L 38 32" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 62 30 Q 67 26 74 34" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="32" cy="42" r="4.5" fill="#1e293b" />
            <circle cx="68" cy="42" r="4.5" fill="#1e293b" />
            {/* Unsure Mouth */}
            <path d="M 44 56 Q 50 58 56 53" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Stars/Sparkle in eyes */}
            <g fill="#1e293b">
              <path d="M 32 34 L 34 40 L 40 42 L 34 44 L 32 50 L 30 44 L 24 42 L 30 40 Z" fill="#fbbf24" />
              <path d="M 68 34 L 70 40 L 76 42 L 70 44 L 68 50 L 66 44 L 60 42 L 66 40 Z" fill="#fbbf24" />
            </g>
            {/* Giant open mouth */}
            <path d="M 36 54 Q 50 72 64 54 Z" fill="#f43f5e" stroke="#1e293b" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="22" cy="48" r="6" fill="#f43f5e" opacity="0.4" />
            <circle cx="78" cy="48" r="6" fill="#f43f5e" opacity="0.4" />
          </>
        );
      case 'default':
      default:
        return (
          <>
            {/* Normal Eyes with reflection */}
            <g fill="#1e293b">
              <circle cx="32" cy="42" r="5" />
              <circle cx="68" cy="42" r="5" />
            </g>
            <circle cx="30" cy="40" r="1.5" fill="#ffffff" />
            <circle cx="66" cy="40" r="1.5" fill="#ffffff" />
            {/* Simple happy mouth */}
            <path d="M 42 54 Q 50 62 58 54" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  // Render hat/accessories based on role
  const renderAccessories = () => {
    switch (role) {
      case 'chef':
        return (
          // Chef Hat
          <g>
            {/* Hat base */}
            <path d="M 30 22 L 70 22 L 72 14 L 28 14 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="4" strokeLinejoin="round" />
            {/* Puffy top */}
            <path
              d="M 26 14 Q 16 -4 34 -2 Q 38 -12 50 -10 Q 62 -12 66 -2 Q 84 -4 74 14 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Red band line */}
            <path d="M 29.5 18 L 70.5 18" stroke="#ef4444" strokeWidth="3.5" />
          </g>
        );
      case 'coach':
        return (
          // Coach Accessories: Sweatband & Whistle
          <g>
            {/* Sweatband */}
            <rect x="23" y="16" width="54" height="10" rx="3" fill="#ef4444" stroke="#1e293b" strokeWidth="4" />
            <rect x="42" y="18" width="16" height="6" fill="#ffffff" />
            {/* Whistle on chest */}
            <path d="M 46 80 L 54 80 L 52 92 L 48 92 Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="3" />
            <path d="M 50 66 L 50 80" stroke="#1e293b" strokeWidth="2.5" />
          </g>
        );
      case 'zen':
        return (
          // Zen Lotus flower on head & Halo
          <g>
            {/* Halo behind head */}
            <circle cx="50" cy="46" r="42" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
            {/* Lotus Flower on top */}
            <path d="M 50 14 Q 45 4 50 0 Q 55 4 50 14" fill="#f43f5e" stroke="#1e293b" strokeWidth="3" />
            <path d="M 50 14 Q 38 6 42 12 Q 46 16 50 14" fill="#fda4af" stroke="#1e293b" strokeWidth="2.5" />
            <path d="M 50 14 Q 62 6 58 12 Q 54 16 50 14" fill="#fda4af" stroke="#1e293b" strokeWidth="2.5" />
          </g>
        );
      case 'motivator':
      default:
        // Flame hair or crown for motivation
        if (expression === 'excited') {
          return (
            <g>
              {/* Flame crown */}
              <path
                d="M 24 24 L 32 10 L 42 20 L 50 4 L 58 20 L 68 10 L 76 24 Z"
                fill="#fbbf24"
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M 32 24 L 38 16 L 44 22 L 50 10 L 56 22 L 62 16 L 68 24 Z"
                fill="#f97316"
                stroke="#1e293b"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>
          );
        }
        return (
          // Cute hair tuft
          <path d="M 50 20 Q 56 10 50 4 Q 44 10 50 20" fill={colors.accent} stroke="#1e293b" strokeWidth="3" />
        );
    }
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        variants={animated ? floatVariants : undefined}
        animate={animated ? activeVariant : undefined}
      >
        {/* Shadow underneath */}
        <ellipse cx="50" cy="94" rx="35" ry="6" fill="#e2e8f0" opacity="0.6" />

        {/* Lucas Body/Base */}
        <motion.path
          d="M 20 80 Q 20 62 30 58 Q 50 50 70 58 Q 80 62 80 80 Z"
          fill={colors.secondary}
          stroke="#1e293b"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Outer Head */}
        <circle
          cx="50"
          cy="46"
          r="28"
          fill={colors.secondary}
          stroke="#1e293b"
          strokeWidth="4"
        />

        {/* Inner Face Mask (adds depth) */}
        <path
          d="M 26 46 A 24 24 0 0 0 74 46 Z"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* Accessories */}
        {renderAccessories()}

        {/* Face (eyes, mouth, cheeks) */}
        {renderFace()}

        {/* Little hands */}
        <g>
          <circle cx="24" cy="74" r="6.5" fill={colors.primary} stroke="#1e293b" strokeWidth="3" />
          <circle cx="76" cy="74" r="6.5" fill={colors.primary} stroke="#1e293b" strokeWidth="3" />
        </g>
      </motion.svg>
    </div>
  );
};
