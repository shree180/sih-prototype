export const appleGradients = {
  primary: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 50%, var(--accent-300) 100%)',
  primaryDark: 'linear-gradient(135deg, var(--accent-600) 0%, var(--accent-500) 50%, var(--accent-400) 100%)',
  primaryLight: 'linear-gradient(135deg, var(--accent-400) 0%, var(--accent-300) 50%, #FDE68A 100%)',
  
  surface: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(243,245,247,0.9) 100%)',
  surfaceDark: 'linear-gradient(180deg, rgba(19,26,46,0.95) 0%, rgba(26,34,56,0.95) 100%)',
  
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.4) 100%)',
  glassDark: 'linear-gradient(135deg, rgba(10,15,30,0.8) 0%, rgba(10,15,30,0.5) 100%)',
  
  semantic: {
    success: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-400) 100%)',
    warning: 'linear-gradient(135deg, var(--warning-500) 0%, var(--warning-400) 100%)',
    danger: 'linear-gradient(135deg, var(--danger-500) 0%, var(--danger-400) 100%)',
    info: 'linear-gradient(135deg, var(--info-500) 0%, var(--info-400) 100%)',
  },
  
  hero: {
    public: 'linear-gradient(135deg, var(--ink-950) 0%, var(--ink-900) 30%, var(--ink-800) 70%, var(--accent-600) 100%)',
    publicLight: 'linear-gradient(135deg, var(--surface-page) 0%, var(--surface-secondary) 50%, var(--accent-50) 100%)',
    citizen: 'linear-gradient(135deg, var(--ink-900) 0%, var(--ink-800) 40%, var(--accent-700) 100%)',
    authority: 'linear-gradient(135deg, var(--ink-950) 0%, var(--ink-900) 50%, var(--ink-800) 100%)',
  },
  
  mesh: {
    warm: 'radial-gradient(ellipse 80% 50% at 50% -20%, var(--accent-200) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, var(--accent-100) 0%, transparent 50%)',
    cool: 'radial-gradient(ellipse 80% 50% at 50% -20%, var(--ink-300) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, var(--ink-400) 0%, transparent 50%)',
    mixed: 'radial-gradient(ellipse 100% 60% at 50% 0%, var(--accent-200) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 80% 100%, var(--ink-200) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, var(--accent-100) 0%, transparent 50%)',
  },
  
  text: {
    primary: 'background: linear-gradient(135deg, var(--ink-950) 0%, var(--ink-700) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;',
    accent: 'background: linear-gradient(135deg, var(--accent-600) 0%, var(--accent-400) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;',
    subtle: 'background: linear-gradient(135deg, var(--ink-600) 0%, var(--ink-400) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;',
  },
};

export const gradientUtils = {
  withOpacity: (gradient: string, opacity: number) => gradient.replace(/\)$/, `, ${opacity})`).replace('linear-gradient', 'linear-gradient').replace('radial-gradient', 'radial-gradient'),
  
  animate: (from: string, to: string, progress: number) => {
    return `linear-gradient(135deg, ${from}, ${to})`;
  },
};

export type AppleGradientKey = keyof typeof appleGradients;
export type SemanticGradientKey = keyof typeof appleGradients.semantic;
export type HeroGradientKey = keyof typeof appleGradients.hero;
export type MeshGradientKey = keyof typeof appleGradients.mesh;
export type TextGradientKey = keyof typeof appleGradients.text;