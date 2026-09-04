'use client';

import { appleGradients } from '@/lib/gradients';
import { cn } from '@/lib/utils';

type GradientVariant = keyof typeof appleGradients.text;

interface GradientTextProps {
  children: React.ReactNode;
  variant?: GradientVariant;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export function GradientText({ 
  children, 
  variant = 'primary', 
  className, 
  as: Component = 'span' 
}: GradientTextProps) {
  const gradientStyle = appleGradients.text[variant];
  
  return (
    <Component 
      className={cn(
        'inline-block',
        className
      )}
      style={{ 
        background: gradientStyle.split('; ')[0].replace('background: ', ''),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundImage: gradientStyle.split('; ')[0].replace('background: ', ''),
      } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}

export function GradientBorder({ 
  children, 
  variant = 'primary', 
  className,
  radius = 'rounded-xl'
}: {
  children: React.ReactNode;
  variant?: GradientVariant;
  className?: string;
  radius?: string;
}) {
  const gradient = appleGradients.primary;
  
  return (
    <div 
      className={cn(
        'relative',
        radius,
        className
      )}
      style={{
        background: 'var(--surface-primary)',
        border: '2px solid transparent',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        backgroundImage: `linear-gradient(var(--surface-primary), var(--surface-primary)), ${gradient}`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}