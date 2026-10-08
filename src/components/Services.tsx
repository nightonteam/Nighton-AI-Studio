import React from 'react';
import { Language, ServiceItem } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  Globe,
  Layout,
  Building2,
  Bot,
  Rocket,
  Cpu,
  ArrowRight,
  Check,
  Clock,
} from 'lucide-react';

interface ServicesProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({
  lang,
  onSelectService,
}) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'personal':
        return <Globe className="w-6 h-6 text-blue-400" />;
      case 'landing':
        return <Layout className="w-6 h-6 text-sky-400" />;
      case 'business':
        return <Building2 className="w-6 h-6 text-indigo-400" />;
      case 'bot':
        return <Bot className="w-6 h-6 text-teal-400" />;
      case 'mvp':
        return <Rocket className="w-6 h-6 text-amber-400" />;
      case 'ai':
        return <Cpu className="w-6 h-6 text-purple-400" />;
      default:
        return <Globe className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section id="services" ref={ref} className="py-24 relative scroll-mt-20">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 space-y-4 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {t.services.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.services.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Cards Grid with Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {t.services.items.map((service, index) => (
            <div
              key={service.id}
              className={`group relative rounded-2xl bg-[#0c1427]/80 hover:bg-[#0f1a33] border border-white/[0.08] hover:border-blue-500/40 p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-2xl hover:shadow-blue-500/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                willChange: 'transform, opacity',
              }}
            >
              <div className="space-y-5">
                {/* Header: Icon & Timeline */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-105">
                    {getServiceIcon(service.id)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{service.timeline}</span>
                  </div>
                </div>

                {/* Service Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2.5 leading-relaxed min-h-[56px]">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables list */}
                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Button with micro-interactions */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Стоимость
                  </div>
                  <div className="text-lg font-bold text-white">
                    {service.startingPrice}
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(service.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-blue-600 text-slate-200 hover:text-white border border-white/10 hover:border-blue-500 text-xs font-semibold transition-all duration-250 cursor-pointer group/btn hover:scale-[1.03] active:scale-[0.97]"
                >
                  <span>{t.services.discussBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-250 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Transparency Disclaimer */}
        <div
          className={`mt-12 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center max-w-2xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            💡 <span className="text-slate-300 font-medium">{t.services.disclaimer}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

