
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const DoodleBrain: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.5 20c-1.5-1-2.5-3-2.5-5.5 0-3 2-4 2-6 0-3.5 3-5 5.5-5S20 6.5 20 10c0 3.5-2.5 5.5-5 5.5" />
    <path d="M14 20c1.5-1 2.5-3 2.5-5.5 0-3-2-4-2-6 0-3.5-3-5-5.5-5S4 6.5 4 10c0 3.5 2.5 5.5 5 5.5" />
    <path d="M11 13a4 4 0 0 1 2 0" />
    <path d="M11 10a4 4 0 0 1 2 0" />
    <path d="M8 8c-1-1-2-1-3 0" />
    <path d="M16 8c1-1 2-1 3 0" />
  </svg>
);

export const DoodleBriefcase: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V7" />
    <path d="M8 21V7" />
    <path d="M15 7V5a3 3 0 0 0-6 0v2" />
    <path d="M12 12c.5-1 1.5-1 2 0" />
  </svg>
);

export const DoodleLightbulb: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2v1" />
    <path d="M12 14c-2-2-4-4-4-8a4 4 0 0 1 8 0c0 4-2 6-4 8z" />
    <path d="M15 17c1.5-1 2.5-2 2.5-4" />
    <path d="M9 17c-1.5-1-2.5-2-2.5-4" />
  </svg>
);

export const DoodleHeart: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    <path d="M12 7v1" />
    <path d="M15 9l-1 1" />
  </svg>
);

export const DoodleTarget: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </svg>
);
