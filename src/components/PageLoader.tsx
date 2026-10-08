import React, { useState, useEffect } from 'react';
import { NightonLogo } from './NightonLogo';

interface PageLoaderProps {
  onComplete?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'showing' | 'fading' | 'done'>('showing');

  useEffect(() => {
    // Stage 1: Logo appears and pulses subtly (800ms)
    const fadeTimer = setTimeout(() => {
      setStage('fading');
    }, 850);

    // Stage 2: Preloader fades out completely (approx 1.1s total)
    const doneTimer = setTimeout(() => {
      setStage('done');
      if (onComplete) onComplete();
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (stage === 'done') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070b14] transition-opacity duration-350 ease-out select-none ${
        stage === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
      aria-hidden="true"
    >
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* Centered Logo with smooth entrance */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 transition-all duration-700 ease-out"
        style={{
          transform: stage === 'showing' ? 'scale(1)' : 'scale(1.03)',
          opacity: 1,
        }}
      >
        <NightonLogo size="lg" tone="light" />
        
        {/* Subtle sleek loading line */}
        <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-blue-500 rounded-full w-full animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
