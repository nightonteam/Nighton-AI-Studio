import React, { useState, useEffect } from 'react';
import { NightonLogo } from './NightonLogo';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Menu, X, ArrowUpRight, Send } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOrderClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.portfolio, href: '#portfolio' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.whyUs, href: '#why-us' },
    { label: t.nav.calculator, href: '#calculator' },
    { label: t.nav.contacts, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-[#070b14]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/50 py-3 sm:py-3.5'
          : 'bg-[#070b14]/40 backdrop-blur-md border-b border-white/[0.03] py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="group flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
          aria-label="NIGHTON Home"
        >
          <NightonLogo size="md" tone="light" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="hover:text-white transition-colors relative py-1 group/link cursor-pointer"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-200 group-hover/link:w-full" />
            </button>
          ))}
        </nav>

        {/* Right CTA & Controls */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900/80 p-0.5 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'ru'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('uz')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'uz'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UZ
            </button>
          </div>

          {/* Telegram Quick Icon */}
          <a
            href="https://t.me/prvt_umarx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-blue-500/40 transition-all"
            title="Telegram: @prvt_umarx"
            aria-label="Telegram: @prvt_umarx"
          >
            <Send className="w-4 h-4 text-sky-400" />
          </a>

          {/* Primary Action Button */}
          <button
            onClick={onOrderClick}
            className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 transition-all cursor-pointer active:scale-95"
          >
            <span>{t.nav.orderBtn}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger & Lang Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === 'ru' ? 'uz' : 'ru')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-slate-300 cursor-pointer"
          >
            {lang.toUpperCase()}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#070b14]/98 border-b border-white/10 shadow-2xl backdrop-blur-2xl px-5 py-6 space-y-4 animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-left py-2 px-3 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOrderClick();
              }}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.nav.orderBtn}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="https://t.me/prvt_umarx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-medium text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Написать в Telegram (@prvt_umarx)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
