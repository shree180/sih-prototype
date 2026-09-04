import { Variants, Transition } from 'framer-motion';

export const easings = {
  apple: [0.25, 0.1, 0.25, 1] as const,
  appleSpring: [0.34, 1.56, 0.64, 1] as const,
  easeOut: [0.23, 1, 0.32, 1] as const,
  easeInOut: [0.42, 0, 0.58, 1] as const,
};

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
};

export const scrollAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.slow, ease: easings.apple },
  } as Variants,

  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: durations.normal, ease: easings.apple },
  } as Variants,

  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: durations.slow, ease: easings.apple },
  } as Variants,

  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: durations.slow, ease: easings.apple },
  } as Variants,

  // NOTE: parents in this codebase use initial="hidden" whileInView="visible",
  // so children MUST expose hidden/visible keys (not initial/animate) or they
  // never transition and stay invisible.
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: durations.normal, ease: easings.apple },
    },
  } as Variants,
};

export const parallax3D = {
  slow: { y: [-50, 50], rotateX: [-3, 3], rotateY: [-2, 2] },
  medium: { y: [-100, 100], rotateX: [-5, 5], rotateY: [-3, 3] },
  fast: { y: [-150, 150], rotateX: [-8, 8], rotateY: [-5, 5] },
};

export const hoverEffects = {
  lift: {
    whileHover: { y: -4, scale: 1.02, transition: { duration: durations.fast, ease: easings.apple } },
    whileTap: { scale: 0.98, transition: { duration: durations.instant } },
  },
  
  glow: {
    whileHover: { 
      boxShadow: '0 20px 40px rgba(217, 119, 6, 0.2), 0 0 60px rgba(217, 119, 6, 0.1)',
      transition: { duration: durations.fast, ease: easings.apple } 
    },
  },
  
  scale: {
    whileHover: { scale: 1.05, transition: { duration: durations.fast, ease: easings.appleSpring } },
    whileTap: { scale: 0.95, transition: { duration: durations.instant } },
  },
  
  rotate3D: {
    whileHover: { 
      rotateX: 5, 
      rotateY: -5, 
      transition: { duration: durations.normal, ease: easings.apple } 
    },
  },
  
  card: {
    whileHover: { 
      y: -8, 
      boxShadow: '0 25px 50px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(217, 119, 6, 0.1)',
      transition: { duration: durations.normal, ease: easings.apple } 
    },
    whileTap: { scale: 0.98, transition: { duration: durations.instant } },
  },
};

export const scrollReveal = {
  text: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: durations.slow, ease: easings.apple },
  },
  
  image: {
    initial: { opacity: 0, scale: 1.05 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: durations.slower, ease: easings.apple },
  },
  
  counter: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: durations.normal, ease: easings.appleSpring },
  },
};

export const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: durations.normal, ease: easings.apple },
};

export const magneticHover = {
  strength: 0.3,
  radius: 100,
};

export const cursorFollow = {
  ease: easings.apple,
  duration: durations.fast,
};

export type ScrollAnimationKey = keyof typeof scrollAnimations;
export type HoverEffectKey = keyof typeof hoverEffects;
export type ParallaxSpeed = keyof typeof parallax3D;