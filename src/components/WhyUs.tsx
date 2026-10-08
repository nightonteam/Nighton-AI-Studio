import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Zap, Palette, Bot, UserCheck } from 'lucide-react';

interface WhyUsProps {
  lang: Language;
}

export const WhyUs: React.FC<WhyUsProps> = ({ lang }) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getAdvantageIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Zap className="w-6 h-6 text-blue-400" />;
      case 1:
        return <Palette className="w-6 h-6 text-sky-400" />;
      case 2:
        return <Bot className="w-6 h-6 text-emerald-400" />;
      case 3:
        return <UserCheck className="w-6 h-6 text-indigo-400" />;
      default:
        return <Zap className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section id="why-us" ref={ref} className="py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 space-y-4 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {t.whyUs.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.whyUs.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 4 Advantages Grid with Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyUs.items.map((item, index) => (
            <div
              key={index}
              className={`group rounded-2xl bg-[#0c1427]/80 hover:bg-[#0f1a33] border border-white/[0.08] hover:border-blue-500/40 p-7 space-y-4 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-xl hover:shadow-blue-500/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                willChange: 'transform, opacity',
              }}
            >
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 w-fit group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-110">
                {getAdvantageIcon(index)}
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                {item.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

