import React, { useState, useId } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Calculator, ArrowDown, Sparkles, Check } from 'lucide-react';

interface CostCalculatorProps {
  lang: Language;
  onGetQuote: (quoteData: {
    serviceName: string;
    hasDesign: boolean;
    hasContent: boolean;
    urgency: string;
    estimatedCost: string;
  }) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  lang,
  onGetQuote,
}) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const isUz = lang === 'uz';

  const serviceOptions = [
    { id: 'personal', name: isUz ? 'Shaxsiy sayt' : 'Персональный сайт', basePrice: 500000 },
    { id: 'landing', name: 'Landing Page', basePrice: 700000 },
    { id: 'business', name: isUz ? 'Biznes uchun sayt' : 'Сайт бизнеса', basePrice: 1000000 },
    { id: 'bot', name: 'Telegram Bot', basePrice: 500000 },
    { id: 'mvp', name: 'MVP', basePrice: 1500000 },
    { id: 'ai', name: isUz ? 'AI-integratsiya' : 'AI-интеграция', basePrice: 1200000 },
    { id: 'other', name: isUz ? 'Boshqa (maxsus)' : 'Другое', basePrice: 800000 },
  ];

  const [selectedService, setSelectedService] = useState('personal');
  const [hasDesign, setHasDesign] = useState<boolean>(false);
  const [hasContent, setHasContent] = useState<boolean>(false);
  const [urgency, setUrgency] = useState<'standard' | 'fast'>('standard');

  // Calculate estimated total
  const currentServiceObj =
    serviceOptions.find((s) => s.id === selectedService) || serviceOptions[0];

  let rawTotal = currentServiceObj.basePrice;

  // If no design ready, studio creates design (+200k)
  if (!hasDesign) {
    rawTotal += 200000;
  }

  // If no copywriting/content ready, studio writes structure (+150k)
  if (!hasContent) {
    rawTotal += 150000;
  }

  // If express urgency (+25%)
  if (urgency === 'fast') {
    rawTotal = Math.round(rawTotal * 1.25);
  }

  const formatPrice = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  const handleTransferToForm = () => {
    const formatted = `~${formatPrice(rawTotal)} ${t.calculator.currency}`;
    const urgencyLabel =
      urgency === 'fast'
        ? isUz
          ? 'Tezkor (3 kundan)'
          : 'Срочно (от 3 дней)'
        : isUz
        ? 'Standart (5 kundan)'
        : 'Стандартно';

    onGetQuote({
      serviceName: currentServiceObj.name,
      hasDesign,
      hasContent,
      urgency: urgencyLabel,
      estimatedCost: formatted,
    });
  };

  return (
    <section id="calculator" ref={ref} className="py-24 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with reveal */}
        <div
          className={`text-center max-w-2xl mx-auto mb-14 space-y-4 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {t.calculator.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.calculator.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Interactive Calculator Box with smooth reveal */}
        <div
          className={`rounded-3xl bg-[#0c1427]/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.99]'
          }`}
        >
          {/* Step 1: Select Service */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
              {t.calculator.serviceLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {serviceOptions.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setSelectedService(svc.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    selectedService === svc.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20 font-semibold'
                      : 'bg-white/[0.03] text-slate-300 border-white/5 hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium">{svc.name}</div>
                  <div className="text-[11px] opacity-75 mt-1 font-mono">
                    {isUz
                      ? `${formatPrice(svc.basePrice)} so‘mdan`
                      : `от ${formatPrice(svc.basePrice)} сум`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: Ready Design & Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Ready Design */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                {t.calculator.designLabel}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHasDesign(true)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    hasDesign
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  {t.calculator.yes} {isUz ? '(maket bor)' : '(есть макет)'}
                </button>
                <button
                  type="button"
                  onClick={() => setHasDesign(false)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    !hasDesign
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  {t.calculator.no} {isUz ? '(dizayn kerak)' : '(нужен дизайн)'}
                </button>
              </div>
            </div>

            {/* Ready Content */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
                {t.calculator.contentLabel}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHasContent(true)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    hasContent
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  {t.calculator.yes} {isUz ? '(matnlar tayyor)' : '(тексты готовы)'}
                </button>
                <button
                  type="button"
                  onClick={() => setHasContent(false)}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    !hasContent
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  {t.calculator.no} {isUz ? '(kopirayting kerak)' : '(нужен копирайтинг)'}
                </button>
              </div>
            </div>
          </div>

          {/* Urgency option */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">4</span>
              {t.calculator.urgencyLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setUrgency('standard')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer text-left hover:scale-[1.01] active:scale-[0.98] ${
                  urgency === 'standard'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                {t.calculator.urgencyStandard}
              </button>
              <button
                type="button"
                onClick={() => setUrgency('fast')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer text-left hover:scale-[1.01] active:scale-[0.98] ${
                  urgency === 'fast'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                {t.calculator.urgencyFast}
              </button>
            </div>
          </div>

          {/* Total Output Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-blue-400/50">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {t.calculator.estimatedTitle}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white transition-all duration-300">
                ~ {formatPrice(rawTotal)}{' '}
                <span className="text-lg font-medium text-slate-300">
                  {t.calculator.currency}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Базовый срок: {urgency === 'fast' ? '3–5 дней' : '5–10 дней'}
              </div>
            </div>

            <button
              onClick={handleTransferToForm}
              className="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-250 cursor-pointer hover:scale-[1.03] active:scale-[0.97] flex-shrink-0"
            >
              <span>{t.calculator.exactQuoteBtn}</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-250 group-hover/btn:translate-y-1" />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            {t.calculator.notice}
          </p>
        </div>
      </div>
    </section>
  );
};

