'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { appleGradients } from '@/lib/gradients';

type MeshVariant = keyof typeof appleGradients.mesh;

interface MeshGradientProps {
  variant?: MeshVariant;
  className?: string;
  animate?: boolean;
  opacity?: number;
}

export function MeshGradient({ 
  variant = 'mixed', 
  className, 
  animate = true,
  opacity = 1
}: MeshGradientProps) {
  const gradient = appleGradients.mesh[variant];

  const borderRadiusKeyframes = [
    '60% 40% 30% 70%/60% 30% 70% 40%',
    '50% 50% 50% 50%',
    '60% 40% 30% 70%/60% 30% 70% 40%',
  ];

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -inset-4"
        style={{
          background: gradient,
          filter: 'blur(100px)',
          transform: 'translateZ(0)',
        }}
        animate={animate ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
          borderRadius: borderRadiusKeyframes,
        } : {}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute -inset-8"
        style={{
          background: variant === 'mixed' 
            ? 'radial-gradient(ellipse at 30% 20%, var(--accent-200) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, var(--ink-200) 0%, transparent 50%)'
            : gradient,
          filter: 'blur(150px)',
          opacity: 0.5,
          transform: 'translateZ(0)',
        }}
        animate={animate ? {
          scale: [1, 1.05, 1],
          rotate: [0, -3, 0],
        } : {}}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      />
    </div>
  );
}

interface AuroraGradientProps {
  className?: string;
  colors?: string[];
  animate?: boolean;
  opacity?: number;
}

export function AuroraGradient({ 
  className, 
  colors = ['var(--accent-300)', 'var(--accent-100)', 'var(--ink-200)'],
  animate = true,
  opacity = 1
}: AuroraGradientProps) {
  const borderRadiusKeyframes = [
    '60% 40% 30% 70%',
    '50% 50% 50% 50%',
    '40% 60% 70% 30%',
    '60% 40% 30% 70%',
  ];

  return (
    <div
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[200px]"
          style={{
            width: '60%',
            height: '60%',
            background: color,
            opacity: 0.3,
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            transform: 'translateZ(0)',
          }}
          animate={animate ? {
            scale: [1, 1.2, 1],
            x: [0, 50, -30, 0],
            y: [0, -30, 40, 0],
            opacity: [0.3, 0.5, 0.2, 0.3],
            borderRadius: borderRadiusKeyframes,
          } : {}}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}