import React, { useState, useEffect, useMemo } from 'react';
import { NightonLogo } from './NightonLogo';

interface NightonIntroProps {
  lang?: 'ru' | 'uz';
  onComplete?: () => void;
}

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

export const NightonIntro: React.FC<NightonIntroProps> = ({ lang = 'ru', onComplete }) => {
  // Stages:
  // 'day' -> starts pure white
  // 'dusk' -> twilight transition
  // 'night' -> deep obsidian night with stars and glow
  // 'logo' -> logo appears: blur(12px) -> sharp, scale(0.9) -> 1
  // 'subtitle' -> "DIGITAL EXPERIENCES" reveals
  // 'exiting' -> smooth upward slide & fade reveal of main website
  // 'done' -> unmounts
  const [stage, setStage] = useState<
    'day' | 'dusk' | 'night' | 'logo' | 'subtitle' | 'exiting' | 'done'
  >('day');

  // Generate deterministic stars for night sky
  const stars: Star[] = useMemo(() => {
    return [
      { id: 1, top: '12%', left: '15%', size: 2, delay: '0.1s', duration: '2.5s', opacity: 0.7 },
      { id: 2, top: '18%', left: '78%', size: 1.5, delay: '0.4s', duration: '3s', opacity: 0.6 },
      { id: 3, top: '24%', left: '42%', size: 2.5, delay: '0.2s', duration: '2.2s', opacity: 0.9 },
      { id: 4, top: '32%', left: '88%', size: 1.5, delay: '0.6s', duration: '2.8s', opacity: 0.5 },
      { id: 5, top: '15%', left: '60%', size: 2, delay: '0.3s', duration: '3.2s', opacity: 0.8 },
      { id: 6, top: '45%', left: '12%', size: 1.5, delay: '0.5s', duration: '2.4s', opacity: 0.6 },
      { id: 7, top: '68%', left: '18%', size: 2, delay: '0.2s', duration: '3s', opacity: 0.75 },
      { id: 8, top: '75%', left: '82%', size: 2.5, delay: '0.7s', duration: '2.6s', opacity: 0.85 },
      { id: 9, top: '82%', left: '35%', size: 1.5, delay: '0.4s', duration: '2.9s', opacity: 0.6 },
      { id: 10, top: '62%', left: '68%', size: 2, delay: '0.1s', duration: '2.3s', opacity: 0.7 },
      { id: 11, top: '28%', left: '26%', size: 1.5, delay: '0.8s', duration: '3.1s', opacity: 0.5 },
      { id: 12, top: '85%', left: '55%', size: 2, delay: '0.5s', duration: '2.7s', opacity: 0.7 },
      { id: 13, top: '38%', left: '72%', size: 1.5, delay: '0.3s', duration: '2.5s', opacity: 0.6 },
      { id: 14, top: '55%', left: '85%', size: 2, delay: '0.6s', duration: '3.3s', opacity: 0.8 },
      { id: 15, top: '20%', left: '92%', size: 1.5, delay: '0.2s', duration: '2.4s', opacity: 0.5 },
      { id: 16, top: '72%', left: '8%', size: 2, delay: '0.4s', duration: '2.8s', opacity: 0.7 },
      { id: 17, top: '88%', left: '22%', size: 1.5, delay: '0.7s', duration: '3.2s', opacity: 0.6 },
      { id: 18, top: '10%', left: '34%', size: 2, delay: '0.3s', duration: '2.6s', opacity: 0.75 },
    ];
  }, []);

  useEffect(() => {
    // Choreographed cinematic timeline:
    // 0ms: pure daylight (#FFFFFF)
    // 120ms: dusk begins transition to night
    const duskTimer = setTimeout(() => {
      setStage('dusk');
    }, 120);

    // 650ms: night sky deepens into #070b14, subtle stars appear
    const nightTimer = setTimeout(() => {
      setStage('night');
    }, 650);

    // 1150ms: logo begins blur-to-sharp & fade-in reveal
    const logoTimer = setTimeout(() => {
      setStage('logo');
    }, 1150);

    // 1550ms: "DIGITAL EXPERIENCES" subtitle appears under logo
    const subTimer = setTimeout(() => {
      setStage('subtitle');
    }, 1550);

    // 2250ms: smooth upward curtain lift
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 2250);

    // 2750ms: intro completes and unmounts
    const doneTimer = setTimeout(() => {
      setStage('done');
      if (onComplete) onComplete();
    }, 2750);

    // Keyboard escape listener to skip intro instantly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(duskTimer);
      clearTimeout(nightTimer);
      clearTimeout(logoTimer);
      clearTimeout(subTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const skipIntro = () => {
    setStage('exiting');
    setTimeout(() => {
      setStage('done');
      if (onComplete) onComplete();
    }, 400);
  };

  if (stage === 'done') {
    return null;
  }

  // Determine stage progression values
  const isNightOrLater = ['night', 'logo', 'subtitle', 'exiting'].includes(stage);
  const isLogoVisible = ['logo', 'subtitle', 'exiting'].includes(stage);
  const isSubtitleVisible = ['subtitle', 'exiting'].includes(stage);
  const isExiting = stage === 'exiting';

  return (
    <div
      onClick={skipIntro}
      role="banner"
      aria-label="NIGHTON Intro"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all ${
        isExiting
          ? '-translate-y-full opacity-0 duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none'
          : 'translate-y-0 opacity-100 duration-0'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* 1. Base Background: Day (pure white) to Night (#070b14) transition */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${
          stage === 'day'
            ? 'bg-white'
            : stage === 'dusk'
            ? 'bg-slate-900'
            : 'bg-[#070b14]'
        }`}
      />

      {/* 2. Twilight / Dusk Gradient overlay that softens the transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#070b14] to-[#04060a] transition-opacity duration-1000 ease-out ${
          isNightOrLater ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. Subtle Twinkling Stars (emerge as night falls) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out ${
          isNightOrLater ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white shadow-[0_0_4px_#fff]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `pulse ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* 4. Ambient nocturnal center celestial glow */}
      <div
        className={`absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/25 via-indigo-500/20 to-sky-400/15 blur-3xl pointer-events-none transition-all duration-1000 ease-out ${
          isNightOrLater
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-75'
        }`}
      />

      {/* 5. Center Branding: Logo reveal with fade + scale + blur -> sharp */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-5 text-center px-4">
        {/* Logo Container */}
        <div
          className={`transition-all duration-700 ease-out ${
            isLogoVisible
              ? 'opacity-100 scale-100 filter-none'
              : 'opacity-0 scale-90 blur-md pointer-events-none'
          }`}
          style={{ willChange: 'transform, opacity, filter' }}
        >
          {/* Subtle celestial halo behind logo icon */}
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            <NightonLogo size="xl" tone="light" />
          </div>
        </div>

        {/* Subtitle: "DIGITAL EXPERIENCES" */}
        <div
          className={`transition-all duration-600 ease-out ${
            isSubtitleVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-slate-300/80 font-mono">
            Digital Experiences
          </span>
        </div>

        {/* Delicate progress bar line */}
        <div
          className={`w-32 h-[2px] bg-white/10 rounded-full overflow-hidden transition-opacity duration-500 ${
            isLogoVisible ? 'opacity-80' : 'opacity-0'
          }`}
        >
          <div className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 rounded-full w-full animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* 6. Subtle Discreet Skip Hint */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        className="absolute bottom-8 right-8 z-20 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-400 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Skip intro"
      >
        {lang === 'uz' ? 'O‘tkazib yuborish ✕' : 'Пропустить ✕'}
      </button>
    </div>
  );
};
