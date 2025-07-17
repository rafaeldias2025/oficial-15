import React from 'react';

interface ColoredCardProps {
  variant: 'steps' | 'heart' | 'calories' | 'sleep' | 'active' | 'distance';
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const ColoredCard: React.FC<ColoredCardProps> = ({ 
  variant, 
  children, 
  selected = false, 
  onClick,
  className = ""
}) => {
  const getColors = (variant: string) => {
    const colorMap = {
      steps: {
        bg: 'var(--metric-steps-light)',
        border: 'var(--metric-steps-border)',
        accent: 'var(--metric-steps)'
      },
      heart: {
        bg: 'var(--metric-heart-light)',
        border: 'var(--metric-heart-border)',
        accent: 'var(--metric-heart)'
      },
      calories: {
        bg: 'var(--metric-calories-light)',
        border: 'var(--metric-calories-border)',
        accent: 'var(--metric-calories)'
      },
      sleep: {
        bg: 'var(--metric-sleep-light)',
        border: 'var(--metric-sleep-border)',
        accent: 'var(--metric-sleep)'
      },
      active: {
        bg: 'var(--metric-active-light)',
        border: 'var(--metric-active-border)',
        accent: 'var(--metric-active)'
      },
      distance: {
        bg: 'var(--metric-distance-light)',
        border: 'var(--metric-distance-border)',
        accent: 'var(--metric-distance)'
      }
    };
    
    return colorMap[variant as keyof typeof colorMap] || colorMap.steps;
  };

  const colors = getColors(variant);

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: 'var(--radius-xl)',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    boxShadow: selected ? `0 0 0 2px ${colors.accent}` : 'var(--shadow)',
    transform: selected ? 'scale(1.05)' : 'scale(1)',
    position: 'relative' as const
  };

  const hoverStyle: React.CSSProperties = {
    boxShadow: 'var(--shadow-lg)',
    transform: 'scale(1.02)'
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      className={`${className} transition-custom`}
      onMouseEnter={(e) => {
        if (!selected) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          Object.assign(e.currentTarget.style, {
            boxShadow: 'var(--shadow)',
            transform: 'scale(1)'
          });
        }
      }}
    >
      {children}
    </div>
  );
};

export default ColoredCard;
