
import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  // FIX: Added style prop to allow inline styling for features like plan glow.
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg p-6 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
