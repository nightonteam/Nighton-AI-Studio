import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { NightonLogo } from './NightonLogo';
import { Send, Mail, Copy, Check, ArrowUpRight, Github, Instagram } from 'lucide-react';

interface ContactsFooterProps {
  lang: Language;
}

export const ContactsFooter: React.FC<ContactsFooterProps> = ({ lang }) => {
  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nightoncontacts@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isUz = lang === 'uz';

  return (
    <footer ref={ref} className="border-t border-white/[0.08] bg-[#050810] pt-16 pb-12 text-slate-400">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <NightonLogo size="md" tone="light" />
            <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
              {t.footer.tagline}{' '}
              {isUz
                ? 'Ekspertlar, bloggerlar va biznes uchun tezkor saytlar, Telegram botlar va AI yechimlarni ishlab chiqamiz.'
                : 'Разрабатываем быстрые сайты, Telegram-ботов и AI-решения для экспертов, блогеров и бизнеса.'}
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Designed & engineered with precision.
            </div>
          </div>

          {/* Quick Contact Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              {isUz ? 'To‘g‘ridan-to‘g‘ri aloqa' : 'Прямая связь'}
            </div>

            {/* Telegram */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Telegram:</span>
              <a
                href="https://t.me/prvt_umarx"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>{t.footer.telegram}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Email:</span>
              <a
                href="mailto:nightoncontacts@gmail.com"
                className="text-slate-200 hover:text-white transition-colors"
              >
                {t.footer.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer hover:scale-110 active:scale-95"
                title={isUz ? 'Emailni nusxalash' : 'Копировать email'}
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {copied && (
              <div className="text-xs text-emerald-400 font-medium animate-in fade-in duration-150">
                {t.footer.copySuccess}
              </div>
            )}
          </div>

          {/* Socials & Studio Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              {isUz ? 'Ijtimoiy tarmoqlar' : 'Социальные сети'}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/prvt_umarx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all hover:scale-110 active:scale-95"
                title="Telegram"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4 text-sky-400" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-pink-600/20 hover:border-pink-500/30 transition-all hover:scale-110 active:scale-95"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110 active:scale-95"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-slate-300" />
              </a>
            </div>
            <div className="text-xs text-slate-500 pt-1">
              Узбекистан · Ташкент / Remote Global
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} NIGHTON Studio. {t.footer.rights}
          </div>
          <div className="flex items-center gap-6">
            <span>Telegram: @prvt_umarx</span>
            <span aria-hidden="true">·</span>
            <span>nightoncontacts@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

