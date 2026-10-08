import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Send, ArrowUpRight, Zap, MessageCircle } from 'lucide-react';

interface TelegramCTAProps {
  lang: Language;
}

export const TelegramCTA: React.FC<TelegramCTAProps> = ({ lang }) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const isUz = lang === 'uz';

  const handleChipClick = (chipText: string) => {
    const cleanText = chipText.replace(/^[^\s]+\s/, ''); // remove emoji
    const message = encodeURIComponent(
      isUz
        ? `Salom! Meni quyidagi xizmat qiziqtiradi: ${cleanText}`
        : `Привет! Меня интересует: ${cleanText}`
    );
    window.open(`https://t.me/prvt_umarx?text=${message}`, '_blank');
  };

  return (
    <section ref={ref} className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-3xl bg-gradient-to-br from-blue-950/70 via-[#0c1427] to-slate-900 border border-blue-500/30 p-8 sm:p-12 shadow-2xl overflow-hidden text-center sm:text-left transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.99]'
          }`}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-semibold border border-blue-400/30">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>{isUz ? 'Tezkor yakkama-yakka muloqot' : 'Быстрый диалог 1-на-1'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.telegramCTA.title}
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                {t.telegramCTA.subtitle}
              </p>

              {/* Quick Prompt Chips with hover micro-interactions */}
              <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                {t.telegramCTA.chips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="group px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 text-xs text-slate-300 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <span>{chip}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Direct CTA Button with enhanced scale and icon motion */}
            <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0">
              <a
                href="https://t.me/prvt_umarx"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base shadow-xl shadow-sky-500/25 hover:shadow-sky-400/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
              >
                <Send className="w-5 h-5 fill-slate-950 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span>{t.telegramCTA.btn}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-950 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="text-xs font-mono text-slate-400">
                Прямой контакт: <span className="text-sky-300 font-semibold">{t.telegramCTA.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

