import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MessageSquare, Lightbulb, Code2, Rocket, ArrowRight } from 'lucide-react';

interface ProcessProps {
  lang: Language;
}

export const Process: React.FC<ProcessProps> = ({ lang }) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getStepIcon = (num: string) => {
    switch (num) {
      case '01':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case '02':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case '03':
        return <Code2 className="w-5 h-5 text-emerald-400" />;
      case '04':
        return <Rocket className="w-5 h-5 text-sky-400" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section id="process" ref={ref} className="py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 space-y-4 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {t.process.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.process.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.process.subtitle}
          </p>
        </div>

        {/* 4 Steps Grid with Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {t.process.steps.map((step, index) => (
            <div
              key={step.number}
              className={`group relative rounded-2xl bg-[#0c1427]/80 hover:bg-[#0f1a33] border border-white/[0.08] hover:border-blue-500/40 p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-xl hover:shadow-blue-500/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 90}ms` : '0ms',
                willChange: 'transform, opacity',
              }}
            >
              {/* Step Top Bar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black font-display text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                    {step.number}
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-110">
                    {getStepIcon(step.number)}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Step Result Footer */}
              <div className="pt-4 mt-6 border-t border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Итог этапа:
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1">
                  {step.result}
                </div>
              </div>

              {/* Direction Indicator on Desktop */}
              {index < t.process.steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-blue-500/40 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

