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
  // Color scheme matching the reference: solid green superhero with glowing eyes
  const colors = {
    outline: '#062c16',       // Thin dark green outline
    skinBase: '#22c55e',      // Main vibrant green skin
    skinHighlight: '#4ade80', // Brighter green for muscle highlights
    skinShadow: '#15803d',    // Deep green for muscle shadows
    skinDarkest: '#14532d',   // Dark green for core shadows
    eyeYellow: '#fef08a',     // Glowing yellow-white eyes core
    eyeGlow: '#eab308',       // Intense golden/yellow outer glow
  };

  // Animation variants
  const floatVariants = {
    idle: {
      y: [0, -4, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    excited: {
      y: [0, -6, 0],
      scale: [1, 1.04, 1],
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

  // Render eyes (slanted glowing yellow-white shapes)
  const renderEyes = () => {
    const eyeColor = expression === 'sad' ? '#38bdf8' : expression === 'excited' ? '#fbbf24' : colors.eyeYellow;
    const filter = expression === 'excited' ? 'url(#eye-glow-strong)' : 'url(#eye-glow-normal)';
    
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy curved glowing eyes */}
            <path d="M 36 38 C 39 33, 44 33, 46 37 C 43 36, 39 37, 36 38 Z" fill={eyeColor} filter={filter} />
            <path d="M 64 38 C 61 33, 56 33, 54 37 C 57 36, 61 37, 64 38 Z" fill={eyeColor} filter={filter} />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downward slanted eyes */}
            <path d="M 36 38 C 40 37, 44 41, 45 42 Q 40 39, 36 38" fill={eyeColor} filter={filter} />
            <path d="M 64 38 C 60 37, 56 41, 55 42 Q 60 39, 64 38" fill={eyeColor} filter={filter} />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* One eye normal, one eye squinting */}
            <path d="M 35 37 C 39 32, 44 36, 45 37 Q 39 36, 35 37" fill={eyeColor} filter={filter} />
            <path d="M 65 38 L 55 38" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" filter={filter} />
          </>
        );
      case 'excited':
      case 'default':
      default:
        return (
          <>
            {/* Standard slanted glowing eyes from reference */}
            <path d="M 35 37 Q 41 29, 46 36 Q 40 36, 35 37 Z" fill={eyeColor} filter={filter} />
            <path d="M 65 37 Q 59 29, 54 36 Q 60 36, 65 37 Z" fill={eyeColor} filter={filter} />
          </>
        );
    }
  };

  const renderAccessories = () => {
    switch (role) {
      case 'chef':
        return (
          <g>
            {/* Chef Hat resting on head */}
            <path d="M 37 13 L 63 13 L 65 7 L 35 7 Z" fill="#ffffff" stroke={colors.outline} strokeWidth="2.5" />
            <path d="M 32 7 Q 20 -6, 36 -4 Q 40 -13, 50 -11 Q 60 -13, 64 -4 Q 80 -6, 68 7 Z" fill="#ffffff" stroke={colors.outline} strokeWidth="2.5" />
            <path d="M 35 10 L 65 10" stroke="#ef4444" strokeWidth="2" />
          </g>
        );
      case 'coach':
        return (
          <g>
            {/* Black tank top straps and whistle */}
            <path d="M 23 68 L 29 88" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" />
            <path d="M 77 68 L 71 88" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" />
            {/* Whistle */}
            <path d="M 38 68 C 38 78, 62 78, 62 68" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <path d="M 46 76 L 54 76 L 53 85 L 47 85 Z" fill="#cbd5e1" stroke={colors.outline} strokeWidth="2" />
          </g>
        );
      case 'zen':
        return (
          <g>
            {/* Zen aura rings in background */}
            <circle cx="50" cy="40" r="36" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="50" cy="40" r="42" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          </g>
        );
      case 'motivator':
      default:
        if (expression === 'excited') {
          return (
            <g>
              {/* Green Super Saiyan energy flames */}
              <path d="M 12 40 L 4 10 L 22 20 L 36 -2 L 48 16 L 58 -2 L 72 20 L 88 10 L 82 40 Z" fill="none" stroke={colors.skinHighlight} strokeWidth="2" opacity="0.6" />
              <path d="M 22 35 L 18 15 L 30 22 L 48 4 L 62 22 L 74 15 L 70 35 Z" fill="none" stroke={colors.eyeGlow} strokeWidth="1.5" opacity="0.8" />
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
          {/* Neon Glow Filters */}
          <filter id="eye-glow-normal" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="eye-glow-strong" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="1.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients matching the reference: solid green with highlights */}
          <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.skinHighlight} />
            <stop offset="50%" stopColor={colors.skinBase} />
            <stop offset="100%" stopColor={colors.skinShadow} />
          </linearGradient>

          <linearGradient id="head-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.skinHighlight} />
            <stop offset="60%" stopColor={colors.skinBase} />
            <stop offset="100%" stopColor={colors.skinShadow} />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="95" rx="26" ry="3.5" fill="#000000" opacity="0.3" />

        {/* Role Background Elements */}
        {renderAccessories()}

        {/* 1. THICK NECK AND TRAPEZIUS (Reference anatomy: very wide neck and traps) */}
        <path
          d="M 32 45 L 32 65 Q 50 68, 68 65 L 68 45 Z"
          fill="url(#body-grad)"
          stroke={colors.outline}
          strokeWidth="2.5"
        />
        {/* Traps lines */}
        <path d="M 28 60 L 38 43" stroke={colors.outline} strokeWidth="2.5" fill="none" />
        <path d="M 72 60 L 62 43" stroke={colors.outline} strokeWidth="2.5" fill="none" />

        {/* 2. BROAD SHOULDERS (Massive rounded deltoids) */}
        <path
          d="M 10 90 C 10 72, 20 62, 32 60 C 42 58, 58 58, 68 60 C 80 62, 90 72, 90 90 Z"
          fill="url(#body-grad)"
          stroke={colors.outline}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* Deltoid muscle curves */}
        <path d="M 12 80 C 18 70, 28 66, 32 60" stroke={colors.outline} strokeWidth="2.5" fill="none" />
        <path d="M 88 80 C 82 70, 72 66, 68 60" stroke={colors.outline} strokeWidth="2.5" fill="none" />

        {/* 3. CHEST & PECTORALS (Reference anatomy: thick chest plates separated by central line) */}
        <path d="M 50 58 L 50 80" stroke={colors.outline} strokeWidth="2.5" />
        {/* Left pectoral shape */}
        <path d="M 32 60 Q 38 78, 50 78" fill="none" stroke={colors.outline} strokeWidth="2.8" />
        {/* Right pectoral shape */}
        <path d="M 68 60 Q 62 78, 50 78" fill="none" stroke={colors.outline} strokeWidth="2.8" />

        {/* Chest highlights */}
        <path d="M 35 63 Q 40 70, 48 70" stroke={colors.skinHighlight} strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 65 63 Q 60 70, 52 70" stroke={colors.skinHighlight} strokeWidth="2" fill="none" opacity="0.6" />

        {/* 4. SIX-PACK ABS (Reference anatomy: stacked abs below pecs) */}
        <path d="M 41 82 Q 50 81, 59 82" stroke={colors.outline} strokeWidth="2" fill="none" />
        <path d="M 39 88 Q 50 87, 61 88" stroke={colors.outline} strokeWidth="2" fill="none" />
        <path d="M 38 94 Q 50 93, 62 94" stroke={colors.outline} strokeWidth="2" fill="none" />

        {/* 5. SMOOTH GREEN HEAD (Reference: egg-like smooth head, solid green, no ears, no mask lines) */}
        <path
          d="M 32 30 C 32 15, 38 12, 50 12 C 62 12, 68 15, 68 30 C 68 45, 60 48, 50 48 C 40 48, 32 45, 32 30 Z"
          fill="url(#head-grad)"
          stroke={colors.outline}
          strokeWidth="2.8"
        />

        {/* Head lighting shine */}
        <path
          d="M 36 26 C 36 18, 40 16, 50 16 C 60 16, 64 18, 64 26"
          fill="none"
          stroke={colors.skinHighlight}
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Neck Shadow under chin */}
        <path d="M 35 44 Q 50 49, 65 44" fill="none" stroke={colors.outline} strokeWidth="2.5" opacity="0.4" />

        {/* 6. GLOWING EYES (Bright yellow/gold slanted eyes) */}
        {renderEyes()}
      </motion.svg>
    </div>
  );
};
