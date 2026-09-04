'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { parallax3D } from '@/lib/animations';

type ParallaxSpeed = keyof typeof parallax3D;

interface ParallaxProps {
  children: React.ReactNode;
  speed?: ParallaxSpeed;
  className?: string;
  offset?: [number, number];
}

export function Parallax({ 
  children, 
  speed = 'medium', 
  className,
  offset = [0, 1]
}: ParallaxProps) {
  const { scrollY } = useScroll();
  const { y, rotateX, rotateY } = parallax3D[speed];
  
  const yTransform = useTransform(scrollY, offset, y);
  const rotateXTransform = useTransform(scrollY, offset, rotateX);
  const rotateYTransform = useTransform(scrollY, offset, rotateY);

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      style={{
        transform: 'translateZ(0)',
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          y: yTransform,
          rotateX: rotateXTransform,
          rotateY: rotateYTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}

export function ParallaxLayer({ 
  children, 
  depth = 0.5, 
  className 
}: ParallaxLayerProps) {
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 1], [0, depth * 100]);

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollProgressProps {
  children: (progress: MotionValue<number>) => React.ReactNode;
  offset?: [number, number];
}

export function ScrollProgress({ children, offset = [0, 1] }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, offset, [0, 1]);

  return <>{children(progress)}</>;
}