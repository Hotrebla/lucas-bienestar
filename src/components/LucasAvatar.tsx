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
  // Shading colors (muscular green theme)
  const colors = {
    cowl: '#0a2e1c',        // Deep forest green c-cowl/mask
    cowlLight: '#14532d',   // Mid green cowl highlights
    skin: '#166534',        // Main muscular skin green
    skinLight: '#22c55e',   // Muscular highlights (lime green)
    skinShadow: '#14532d',  // Muscle shadows
    glow: '#4ade80',        // Slanted eyes neon glow
    glowOuter: '#22c55e',
  };

  // Animation variants
  const floatVariants = {
    idle: {
      y: [0, -4, 0],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    excited: {
      y: [0, -8, 0],
      scale: [1, 1.03, 1],
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

  // Render eyes based on expression
  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy slanted curved eyes */}
            <path
              d="M 33 46 C 35 40, 41 40, 43 45 C 40 44, 36 45, 33 46 Z"
              fill={colors.glow}
              filter="url(#glow-filter)"
            />
            <path
              d="M 67 46 C 65 40, 59 40, 57 45 C 60 44, 64 45, 67 46 Z"
              fill={colors.glow}
              filter="url(#glow-filter)"
            />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Drooping sad glowing eyes (blue-green tone or lower opacity) */}
            <path
              d="M 34 47 Q 40 46, 42 50 Q 38 48, 34 47"
              fill="#38bdf8"
              filter="url(#glow-filter)"
              opacity="0.8"
            />
            <path
              d="M 66 47 Q 60 46, 58 50 Q 62 48, 66 47"
              fill="#38bdf8"
              filter="url(#glow-filter)"
              opacity="0.8"
            />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Left eye normal, right eye squinting */}
            <path
              d="M 31 43 Q 38 37, 43 44 Q 37 43, 31 43"
              fill={colors.glow}
              filter="url(#glow-filter)"
            />
            <path
              d="M 68 45 Q 63 43, 58 45 Q 63 45, 68 45"
              fill={colors.glow}
              filter="url(#glow-filter)"
              opacity="0.7"
            />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Super bright, larger slanted eyes */}
            <path
              d="M 30 42 Q 37 32, 44 42 Q 37 43, 30 42 Z"
              fill="#a3e635"
              filter="url(#glow-filter-strong)"
            />
            <path
              d="M 70 42 Q 63 32, 56 42 Q 63 43, 70 42 Z"
              fill="#a3e635"
              filter="url(#glow-filter-strong)"
            />
          </>
        );
      case 'default':
      default:
        return (
          <>
            {/* Standard slanted superhero glowing eyes */}
            <path
              d="M 31 44 Q 38 35, 43 43 Q 37 43, 31 44 Z"
              fill={colors.glow}
              filter="url(#glow-filter)"
            />
            <path
              d="M 69 44 Q 62 35, 57 43 Q 63 43, 69 44 Z"
              fill={colors.glow}
              filter="url(#glow-filter)"
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
              d="M 34 18 L 66 18 L 68 11 L 32 11 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 30 11 Q 20 -3, 36 -1 Q 40 -9, 50 -8 Q 60 -9, 64 -1 Q 80 -3, 70 11 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M 33 14.5 L 67 14.5" stroke="#ef4444" strokeWidth="2.5" />
          </g>
        );
      case 'coach':
        return (
          // Coach whistle on neck and strap
          <g>
            {/* Whistle strap */}
            <path d="M 38 72 C 38 80, 62 80, 62 72" fill="none" stroke="#ef4444" strokeWidth="2" />
            {/* Whistle */}
            <path d="M 47 78 L 53 78 L 52 87 L 48 87 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          </g>
        );
      case 'zen':
        return (
          // Concentric neon rings for Zen
          <g>
            <circle cx="50" cy="46" r="38" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
            <circle cx="50" cy="46" r="43" fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
          </g>
        );
      case 'motivator':
      default:
        // Flame hair or aura (excited state)
        if (expression === 'excited') {
          return (
            <g>
              {/* Green Super Saiyan energy flames in background */}
              <path
                d="M 20 40 L 15 15 L 30 25 L 42 5 L 50 20 L 58 5 L 70 25 L 85 15 L 80 40 Z"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                opacity="0.6"
              />
              <path
                d="M 28 35 L 25 18 L 36 26 L 50 10 L 64 26 L 75 18 L 72 35 Z"
                fill="none"
                stroke="#a3e635"
                strokeWidth="1.5"
                opacity="0.8"
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
          {/* Neon Glow Filters */}
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-filter-strong" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="1.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients for muscular shading */}
          <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          <linearGradient id="abs-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>

        {/* Shadow underneath */}
        <ellipse cx="50" cy="95" rx="30" ry="4" fill="#0f172a" opacity="0.3" />

        {/* Role Accessories (Flames in background if excited) */}
        {renderAccessories()}

        {/* 1. Traps & Shoulders (Muscular Silhouette Base) */}
        <path
          d="M 12 88 C 12 76, 20 68, 30 66 C 36 62, 40 58, 42 56 L 58 56 C 60 58, 64 62, 70 66 C 80 68, 88 76, 88 88 Z"
          fill="url(#body-grad)"
          stroke="#052e16"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Shoulders Deltoids lines */}
        <path d="M 18 78 Q 28 72, 30 66" stroke="#0f172a" strokeWidth="2.5" fill="none" opacity="0.5" />
        <path d="M 82 78 Q 72 72, 70 66" stroke="#0f172a" strokeWidth="2.5" fill="none" opacity="0.5" />

        {/* 2. Pectoral muscles definition */}
        <g stroke="#0f172a" strokeWidth="2.5" fill="none" opacity="0.8">
          {/* Pectoral division line */}
          <path d="M 50 64 L 50 82" />
          {/* Left Pec */}
          <path d="M 50 64 Q 36 64, 30 76 Q 38 80, 50 78" />
          {/* Right Pec */}
          <path d="M 50 64 Q 64 64, 70 76 Q 62 80, 50 78" />
        </g>

        {/* Highlight on Chest */}
        <path d="M 34 67 Q 44 67, 46 72" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 66 67 Q 56 67, 54 72" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* 3. Six-pack Abdominal muscles definition */}
        <g stroke="#052e16" strokeWidth="2" fill="none" opacity="0.7">
          {/* Ab rows */}
          <path d="M 40 82 Q 50 81, 60 82" />
          <path d="M 38 86 Q 50 85, 62 86" />
          <path d="M 37 90 Q 50 89, 63 90" />
        </g>

        {/* 4. Head Cowl (Sleek cowl shape matching photos) */}
        <path
          d="M 26 44 C 26 24, 34 16, 50 16 C 66 16, 74 24, 74 44 C 74 58, 64 64, 50 64 C 36 64, 26 58, 26 44 Z"
          fill={colors.cowl}
          stroke="#052e16"
          strokeWidth="3.5"
        />

        {/* Cowl shading highlight (gives 3D depth to head) */}
        <path
          d="M 28 40 C 28 26, 36 19, 50 19 C 64 19, 72 26, 72 40"
          fill="none"
          stroke={colors.cowlLight}
          strokeWidth="2.5"
          opacity="0.5"
        />

        {/* Shadow under jaw */}
        <path d="M 34 58 Q 50 68, 66 58" fill="none" stroke="#052e16" strokeWidth="3" />

        {/* 5. Glowing slitted eyes */}
        {renderEyes()}

        {/* Forehead reflection lines */}
        <path d="M 44 23 Q 50 21, 56 23" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.15" />
      </motion.svg>
    </div>
  );
};
