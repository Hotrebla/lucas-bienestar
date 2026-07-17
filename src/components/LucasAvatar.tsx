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
  // Vibrant Comic Book Color Palette (BSE Style)
  const colors = {
    outline: '#062011',        // Solid dark outline (almost black)
    maskBase: '#0d321d',       // Sleek dark emerald mask
    maskHighlight: '#10b981',  // Emerald highlight
    muscleBase: '#15803d',     // Mid-tone muscle green
    muscleHighlight: '#4ade80',// Bright neon muscle highlight
    muscleShadow: '#0f4425',   // Muscle shade green
    eyeGlow: '#a3e635',        // Slanted glowing eyes (yellow-green lime)
    eyeSad: '#38bdf8',         // Blue-sky sad eyes
    eyeExcited: '#facc15',     // Golden excited eyes
  };

  // Animation variants
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
      y: [0, -7, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    sad: {
      y: [0, 3, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const activeVariant = expression === 'excited' ? 'excited' : expression === 'sad' ? 'sad' : 'idle';

  // Render eyes based on expression
  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy curved glowing eyes */}
            <path
              d="M 32 46 C 36 38, 42 38, 45 44 C 41 43, 36 44, 32 46 Z"
              fill={colors.eyeGlow}
              filter="url(#neon-glow)"
            />
            <path
              d="M 68 46 C 64 38, 58 38, 55 44 C 59 43, 64 44, 68 46 Z"
              fill={colors.eyeGlow}
              filter="url(#neon-glow)"
            />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Drooping sad glowing eyes (blue-green tone) */}
            <path
              d="M 32 48 Q 39 45, 43 51 Q 38 48, 32 48"
              fill={colors.eyeSad}
              filter="url(#neon-glow)"
            />
            <path
              d="M 68 48 Q 61 45, 57 51 Q 62 48, 68 48"
              fill={colors.eyeSad}
              filter="url(#neon-glow)"
            />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Thinking expression - left eye normal, right eye squinting */}
            <path
              d="M 31 44 Q 38 36, 43 43 C 38 42, 34 43, 31 44"
              fill={colors.eyeGlow}
              filter="url(#neon-glow)"
            />
            <path
              d="M 69 46 Q 63 44, 57 46 Q 63 46, 69 46"
              fill={colors.eyeGlow}
              filter="url(#neon-glow)"
              opacity="0.8"
            />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Bright golden slanted eyes */}
            <path
              d="M 30 43 Q 38 31, 45 41 Q 38 42, 30 43 Z"
              fill={colors.eyeExcited}
              filter="url(#neon-glow-strong)"
            />
            <path
              d="M 70 43 Q 62 31, 55 41 Q 62 42, 70 43 Z"
              fill={colors.eyeExcited}
              filter="url(#neon-glow-strong)"
            />
          </>
        );
      case 'default':
      default:
        return (
          <>
            {/* Slanted glowing eyes */}
            <path
              d="M 31 44 Q 38 33, 44 42 Q 38 42, 31 44 Z"
              fill={colors.eyeGlow}
              filter="url(#neon-glow)"
            />
            <path
              d="M 69 44 Q 62 33, 56 42 Q 63 42, 69 44 Z"
              fill={colors.eyeGlow}
              filter="url(#neon-glow)"
            />
          </>
        );
    }
  };

  // Render accessories based on role
  const renderAccessories = () => {
    switch (role) {
      case 'chef':
        return (
          // Chef Hat sitting on cowl
          <g>
            <path
              d="M 35 16 L 65 16 L 67 9 L 33 9 Z"
              fill="#ffffff"
              stroke={colors.outline}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 30 9 Q 18 -5, 36 -3 Q 40 -12, 50 -10 Q 60 -12, 64 -3 Q 82 -5, 70 9 Z"
              fill="#ffffff"
              stroke={colors.outline}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M 34 12.5 L 66 12.5" stroke="#ef4444" strokeWidth="2.5" />
          </g>
        );
      case 'coach':
        return (
          // Whistle around muscular neck
          <g>
            <path d="M 37 72 C 37 81, 63 81, 63 72" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <path d="M 46 79 L 54 79 L 53 88 L 47 88 Z" fill="#cbd5e1" stroke={colors.outline} strokeWidth="2.5" />
          </g>
        );
      case 'zen':
        return (
          // Concentric meditation circles in background
          <g>
            <circle cx="50" cy="46" r="39" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
            <circle cx="50" cy="46" r="44" fill="none" stroke="#a3e635" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          </g>
        );
      case 'motivator':
      default:
        if (expression === 'excited') {
          return (
            <g>
              {/* Green Super Saiyan glowing flames in background */}
              <path
                d="M 15 45 L 8 15 L 24 25 L 38 3 L 48 20 L 58 3 L 72 25 L 88 15 L 82 45 Z"
                fill="none"
                stroke={colors.muscleHighlight}
                strokeWidth="2"
                opacity="0.7"
              />
              <path
                d="M 23 40 L 20 20 L 32 28 L 48 8 L 62 28 L 76 20 L 73 40 Z"
                fill="none"
                stroke={colors.eyeGlow}
                strokeWidth="1.5"
                opacity="0.9"
              />
            </g>
          );
        }
        return null;
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
        variants={animated ? (floatVariants as any) : undefined}
        animate={animated ? activeVariant : undefined}
      >
        <defs>
          {/* Intense Neon Glow filters */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="1" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core muscular color shading gradients */}
          <linearGradient id="muscle-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.muscleHighlight} />
            <stop offset="40%" stopColor={colors.muscleBase} />
            <stop offset="100%" stopColor={colors.muscleShadow} />
          </linearGradient>

          <linearGradient id="mask-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.maskHighlight} />
            <stop offset="25%" stopColor={colors.maskBase} />
            <stop offset="100%" stopColor="#02140b" />
          </linearGradient>
        </defs>

        {/* Outer Shadow */}
        <ellipse cx="50" cy="94" rx="28" ry="4" fill="#02140b" opacity="0.35" />

        {/* Background accessories (flames, zen aura) */}
        {renderAccessories()}

        {/* 1. Shoulders & Torso (V-Shape Body) */}
        {/* Draw main muscular neck, shoulders, and chest outline */}
        <path
          d="M 12 88 C 12 74, 18 64, 30 63 C 35 59, 39 55, 41 53 L 59 53 C 61 55, 65 59, 70 63 C 82 64, 88 74, 88 88 Z"
          fill="url(#muscle-grad)"
          stroke={colors.outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Deltoids / Shoulder lines */}
        <path
          d="M 13 88 C 14 77, 22 72, 30 63"
          fill="none"
          stroke={colors.outline}
          strokeWidth="3"
        />
        <path
          d="M 87 88 C 86 77, 78 72, 70 63"
          fill="none"
          stroke={colors.outline}
          strokeWidth="3"
        />

        {/* Pectoral division & definitions */}
        <path
          d="M 50 62 L 50 82"
          stroke={colors.outline}
          strokeWidth="3"
        />

        {/* Left Pectoral curve */}
        <path
          d="M 30 63 Q 36 78, 50 78"
          fill="none"
          stroke={colors.outline}
          strokeWidth="3"
        />
        {/* Right Pectoral curve */}
        <path
          d="M 70 63 Q 64 78, 50 78"
          fill="none"
          stroke={colors.outline}
          strokeWidth="3"
        />

        {/* Pectoral highlights (creates depth) */}
        <path d="M 33 66 Q 38 72, 47 72" stroke={colors.muscleHighlight} strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M 67 66 Q 62 72, 53 72" stroke={colors.muscleHighlight} strokeWidth="2.5" fill="none" opacity="0.6" />

        {/* Six-pack Abs mapping */}
        <path d="M 40 82 Q 50 80, 60 82" stroke={colors.outline} strokeWidth="2.5" fill="none" />
        <path d="M 38 87 Q 50 85, 62 87" stroke={colors.outline} strokeWidth="2.5" fill="none" />
        <path d="M 37 92 Q 50 90, 63 92" stroke={colors.outline} strokeWidth="2.5" fill="none" />

        {/* 2. Sleek Mask Head (Aggressive Superhero shape) */}
        {/* Tapered head shape: wide brow, defined jaw */}
        <path
          d="M 27 42 C 27 22, 33 14, 50 14 C 67 14, 73 22, 73 42 C 73 57, 63 63, 50 63 C 37 63, 27 57, 27 42 Z"
          fill="url(#mask-grad)"
          stroke={colors.outline}
          strokeWidth="3.2"
        />

        {/* Mask brow/head highlights (V-shape shine on forehead) */}
        <path
          d="M 31 38 C 31 24, 38 18, 50 18 C 62 18, 69 24, 69 38"
          fill="none"
          stroke={colors.maskHighlight}
          strokeWidth="2.5"
          opacity="0.6"
        />

        {/* Cheekbone/Jaw outlines for premium feel */}
        <path d="M 31 48 Q 50 59, 69 48" fill="none" stroke={colors.outline} strokeWidth="2.2" opacity="0.8" />
        <path d="M 35 56 Q 50 63, 65 56" fill="none" stroke={colors.outline} strokeWidth="2.5" />

        {/* Glowing Eyes */}
        {renderEyes()}

        {/* Forehead reflection */}
        <path d="M 46 22 L 54 22" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
};
