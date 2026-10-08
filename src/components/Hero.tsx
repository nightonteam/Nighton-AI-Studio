import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { ArrowUpRight, Sparkles, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { NightonLogo } from './NightonLogo';

interface HeroProps {
  lang: Language;
  onOrderClick: () => void;
  onPortfolioClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOrderClick,
  onPortfolioClick,
}) => {
  const t = translations[lang];
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isUz = lang === 'uz';

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient Lighting & Futuristic Backdrop with subtle parallax */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10 transition-transform duration-75 ease-out"
        style={{ transform: `translate3d(-50%, ${scrollY * 0.12}px, 0)` }}
      />
      <div
        className="absolute top-48 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10 transition-transform duration-75 ease-out"
        style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
      />
      <div
        className="absolute top-64 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 transition-transform duration-75 ease-out"
        style={{ transform: `translate3d(0, ${scrollY * 0.05}px, 0)` }}
      />

      {/* Grid pattern overlay subtle */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Small tagline badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium tracking-wide shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>{t.hero.tagline}</span>
            </div>

            {/* Main Headline with smooth upward reveal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-450 fill-mode-both">
              <button
                onClick={onOrderClick}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <span>{t.hero.orderBtn}</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onPortfolioClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium text-base border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <span>{t.hero.portfolioBtn}</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-left animate-in fade-in duration-700 delay-600 fill-mode-both">
              <div className="flex items-center gap-2 group cursor-default">
                <Zap className="w-4 h-4 text-blue-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  {t.hero.speedTag}
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  {t.hero.transparentTag}
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  {t.hero.directContactTag}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Craft Interactive Studio Showcase Console */}
          <div className="lg:col-span-5 animate-in fade-in zoom-in-95 duration-800 delay-300 fill-mode-both">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              {/* Outer decorative glow border with subtle hover response */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/40 via-sky-500/20 to-indigo-600/40 opacity-70 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

              {/* Console Container */}
              <div className="relative rounded-2xl bg-[#0c1427]/90 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden p-6 space-y-6 transition-transform duration-500 group-hover:-translate-y-1">
                {/* Header of studio preview */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <NightonLogo size="sm" tone="light" />
                    <span className="text-xs font-mono text-slate-400">digital.studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-300">
                      {isUz ? 'Buyurtmalar qabul qilinmoqda' : 'Приём заказов открыт'}
                    </span>
                  </div>
                </div>

                {/* Quick Snapshot Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-500/20">
                    <div className="text-xs text-slate-400">
                      {isUz ? 'Dastlabki namuna' : 'Первый драфт'}
                    </div>
                    <div className="text-lg font-bold text-white mt-1">
                      {isUz ? '48 soat' : '48 часов'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:border-emerald-500/20">
                    <div className="text-xs text-slate-400">PageSpeed</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">98 / 100</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-500/20">
                    <div className="text-xs text-slate-400">
                      {isUz ? 'Boshlang‘ich narx' : 'Старт цен'}
                    </div>
                    <div className="text-lg font-bold text-blue-400 mt-1">
                      {isUz ? '500k so‘m' : '500k сум'}
                    </div>
                  </div>
                </div>

                {/* Live Feature Preview card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/20 space-y-3 transition-colors duration-300 hover:border-blue-500/40">
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Digital & AI Capabilities
                    </span>
                    <span className="text-slate-400 font-mono">v2026.1</span>
                  </div>
                  <p className="text-sm text-slate-200">
                    {isUz
                      ? 'Tezkor shaxsiy saytlar, mijozlarni darhol qabul qiluvchi Telegram botlar, startaplar uchun MVP va Gemini AI integratsiyalari.'
                      : 'Быстрые персональные сайты, Telegram-боты с моментальным сбором лидов, MVP для стартапов и интеграции Gemini AI.'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:border-blue-400/40 transition-colors">React 19</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:border-blue-400/40 transition-colors">Telegram Bot API</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:border-blue-400/40 transition-colors">Fast MVP</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:border-blue-400/40 transition-colors">Gemini LLM</span>
                  </div>
                </div>

                {/* Direct quick action inside console */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{isUz ? 'Asoschi Telegrami:' : 'Telegram основателя:'}</span>
                  <a
                    href="https://t.me/prvt_umarx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                  >
                    <span>@prvt_umarx</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
