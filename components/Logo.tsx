import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <defs>
      <linearGradient id="industrialGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" /> {/* Amber 400 */}
        <stop offset="100%" stopColor="#b45309" /> {/* Amber 700 */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Main Industrial Hexagon Outline */}
    <path 
      d="M50 12L85 32V72L50 92L15 72V32L50 12Z" 
      stroke="url(#industrialGrad)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="drop-shadow-sm"
    />

    {/* Internal Mechanics / "S" for Surplus */}
    <path 
      d="M35 45H65M65 45L55 35M35 60H65M35 60L45 70" 
      stroke="url(#industrialGrad)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Central Connection Nodes */}
    <circle cx="35" cy="45" r="4" fill="#fbbf24" />
    <circle cx="65" cy="60" r="4" fill="#fbbf24" />

  </svg>
);