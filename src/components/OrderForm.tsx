import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  Send,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

interface OrderFormProps {
  lang: Language;
  prefilledService?: string;
  prefilledBudget?: string;
  prefilledNotes?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  lang,
  prefilledService = '',
  prefilledBudget = '',
  prefilledNotes = '',
}) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    serviceType: 'Сайт для бизнеса',
    description: '',
    budget: '1 000 000 - 2 000 000 сум',
  });

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<{ botUsername?: string; needsStart?: boolean } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<typeof formData | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Sync props when user clicks "Discuss" from services or calculator
  useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({
        ...prev,
        serviceType: prefilledService,
      }));
    }
  }, [prefilledService]);

  useEffect(() => {
    if (prefilledBudget) {
      setFormData((prev) => ({
        ...prev,
        budget: prefilledBudget,
      }));
    }
  }, [prefilledBudget]);

  useEffect(() => {
    if (prefilledNotes) {
      setFormData((prev) => ({
        ...prev,
        description: prev.description
          ? `${prev.description}\n${prefilledNotes}`
          : prefilledNotes,
      }));
    }
  }, [prefilledNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setErrorMessage(null);

    // 1. Mandatory fields validation
    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.serviceType.trim() ||
      !formData.description.trim()
    ) {
      setValidationError(t.order.validationError);
      return;
    }

    // 2. Anti-spam client-side debounce
    const now = Date.now();
    if (now - lastSubmitTime < 4000) {
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(now);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          contact: formData.contact.trim(),
          serviceType: formData.serviceType.trim(),
          description: formData.description.trim(),
          budget: formData.budget.trim(),
          honeypot: honeypot.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        // Save locally in localStorage for backup
        const existing = JSON.parse(localStorage.getItem('nighton_orders') || '[]');
        existing.push({
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('nighton_orders', JSON.stringify(existing));

        setLastSubmission({ ...formData });
        setIsSuccess(true);
        // Clear form fields
        setFormData({
          name: '',
          contact: '',
          serviceType: 'Сайт для бизнеса',
          description: '',
          budget: '',
        });
      } else {
        // Error from Telegram integration or server
        if (data?.needsStart) {
          setBotInfo({ botUsername: data.botUsername, needsStart: true });
        }
        setErrorMessage(data?.error || t.order.errorMessage);
      }
    } catch {
      // Network or connection error: show clean, privacy-safe error
      setErrorMessage(t.order.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setValidationError(null);
    setFormData({
      name: '',
      contact: '',
      serviceType: 'Сайт для бизнеса',
      description: '',
      budget: '1 000 000 - 2 000 000 сум',
    });
  };

  const isUz = lang === 'uz';

  const getTelegramUrl = () => {
    if (!lastSubmission) {
      return 'https://t.me/prvt_umarx';
    }
    const text = encodeURIComponent(
      isUz
        ? `👋 NIGHTON saytidan yangi ariza:\n` +
          `👤 Ism: ${lastSubmission.name}\n` +
          `📞 Kontakt: ${lastSubmission.contact}\n` +
          `🎯 Loyiha: ${lastSubmission.serviceType}\n` +
          `💰 Byudjet: ${lastSubmission.budget}\n` +
          `📝 Tavsif: ${lastSubmission.description || 'Ko‘rsatilmadi'}`
        : `👋 Заявка с сайта NIGHTON:\n` +
          `👤 Имя: ${lastSubmission.name}\n` +
          `📞 Контакт: ${lastSubmission.contact}\n` +
          `🎯 Проект: ${lastSubmission.serviceType}\n` +
          `💰 Бюджет: ${lastSubmission.budget}\n` +
          `📝 Описание: ${lastSubmission.description || 'Не указано'}`
    );
    return `https://t.me/prvt_umarx?text=${text}`;
  };

  return (
    <section id="contact" ref={ref} className="py-24 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with reveal */}
        <div
          className={`text-center max-w-2xl mx-auto mb-14 space-y-4 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {t.order.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.order.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.order.subtitle}
          </p>
        </div>

        {/* Form Container with smooth entrance */}
        <div
          className={`rounded-3xl bg-[#0c1427]/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.99]'
          }`}
        >
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {t.order.successTitle}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  {t.order.successDesc}
                </p>
              </div>

              {/* Instant Telegram forward button */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 max-w-md mx-auto space-y-3">
                <p className="text-xs text-blue-200">
                  {isUz
                    ? 'Javobni tezlashtirmoqchimisiz? Tayyor ariza matnini to‘g‘ridan-to‘g‘ri Telegramga yuboring:'
                    : 'Хотите ускорить ответ? Отправьте готовый текст заявки напрямую в Telegram:'}
                </p>
                <a
                  href={getTelegramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isUz
                      ? 'Telegramda takrorlash (@prvt_umarx)'
                      : 'Дублировать в Telegram (@prvt_umarx)'}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.order.sendAnother}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t.order.nameLabel} <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={t.order.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:bg-white/[0.07] text-white text-sm outline-none transition-all placeholder:text-slate-500"
                  />
                </div>

                {/* Contact Field (Telegram / Phone) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t.order.contactLabel} <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder={t.order.contactPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:bg-white/[0.07] text-white text-sm outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Service Type Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t.order.serviceLabel}
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0c1427] border border-white/10 focus:border-blue-500 text-white text-sm outline-none transition-all cursor-pointer"
                  >
                    {isUz ? (
                      <>
                        <option value="Shaxsiy sayt">Shaxsiy sayt (500k so‘mdan)</option>
                        <option value="Landing Page">Landing Page (700k so‘mdan)</option>
                        <option value="Biznes uchun sayt">Biznes uchun sayt (1 mln so‘mdan)</option>
                        <option value="Telegram Bot">Telegram Bot (500k so‘mdan)</option>
                        <option value="MVP">Startap uchun MVP (1.5 mln so‘mdan)</option>
                        <option value="AI-integratsiyalar">AI-integratsiyalar (kelishilgan holda)</option>
                        <option value="Boshqa">Boshqa / Maxsus loyiha</option>
                      </>
                    ) : (
                      <>
                        <option value="Персональный сайт">Персональный сайт (от 500k сум)</option>
                        <option value="Landing Page">Landing Page (от 700k сум)</option>
                        <option value="Сайт для бизнеса">Сайт для бизнеса (от 1 млн сум)</option>
                        <option value="Telegram Bot">Telegram Bot (от 500k сум)</option>
                        <option value="MVP">MVP стартапа (от 1.5 млн сум)</option>
                        <option value="AI-интеграции">AI-интеграции (индивидуально)</option>
                        <option value="Другое">Другое / Комплексный проект</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Approximate Budget */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t.order.budgetLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder={
                      isUz
                        ? 'Misol: 1 000 000 so‘m yoki $500 gacha'
                        : 'Пример: 1 000 000 сум или до $500'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:bg-white/[0.07] text-white text-sm outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Hidden anti-spam honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="_hp_trap"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Brief Project Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t.order.descriptionLabel} <span className="text-blue-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t.order.descriptionPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:bg-white/[0.07] text-white text-sm outline-none transition-all placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* Validation Warning Alert */}
              {validationError && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm animate-in fade-in duration-200">
                  {validationError}
                </div>
              )}

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs sm:text-sm space-y-3 animate-in fade-in duration-200">
                  <div className="font-medium text-rose-300">{errorMessage}</div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {botInfo?.needsStart && (
                      <a
                        href={`https://t.me/${botInfo.botUsername || 'nightonuz_bot'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-medium border border-sky-400/30 transition-all text-xs"
                      >
                        <span>Нажать «Start» в @{botInfo.botUsername || 'nightonuz_bot'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href="https://t.me/prvt_umarx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 underline font-medium"
                    >
                      <span>Написать напрямую: @prvt_umarx</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? t.order.sendingBtn : t.order.submitBtn}</span>
                </button>
              </div>

              {/* Telegram fallback prompt */}
              <div className="pt-4 border-t border-white/[0.08] text-center">
                <p className="text-xs text-slate-400">
                  {t.order.quickTelegramOption}{' '}
                  <a
                    href="https://t.me/prvt_umarx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 ml-1"
                  >
                    @prvt_umarx
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
