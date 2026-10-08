import React, { useState } from 'react';
import { Language } from './types';
import { NightonIntro } from './components/NightonIntro';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';
import { WhyUs } from './components/WhyUs';
import { CostCalculator } from './components/CostCalculator';
import { OrderForm } from './components/OrderForm';
import { TelegramCTA } from './components/TelegramCTA';
import { ContactsFooter } from './components/ContactsFooter';

export default function App() {
  const [lang, setLang] = useState<Language>('ru');

  // Form prefill state transferred from services/calculator
  const [prefilledService, setPrefilledService] = useState('');
  const [prefilledBudget, setPrefilledBudget] = useState('');
  const [prefilledNotes, setPrefilledNotes] = useState('');

  const scrollToContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const portfolioElem = document.getElementById('portfolio');
    if (portfolioElem) {
      portfolioElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceId: string) => {
    const serviceNameMap: Record<
      string,
      { title: { ru: string; uz: string }; budget: { ru: string; uz: string } }
    > = {
      personal: {
        title: { ru: 'Персональный сайт', uz: 'Shaxsiy sayt' },
        budget: { ru: 'от 500 000 сум', uz: '500 000 so‘mdan' },
      },
      landing: {
        title: { ru: 'Landing Page', uz: 'Landing Page' },
        budget: { ru: 'от 700 000 сум', uz: '700 000 so‘mdan' },
      },
      business: {
        title: { ru: 'Сайт для бизнеса', uz: 'Biznes uchun sayt' },
        budget: { ru: 'от 1 000 000 сум', uz: '1 000 000 so‘mdan' },
      },
      bot: {
        title: { ru: 'Telegram Bot', uz: 'Telegram Bot' },
        budget: { ru: 'от 500 000 сум', uz: '500 000 so‘mdan' },
      },
      mvp: {
        title: { ru: 'MVP', uz: 'MVP' },
        budget: { ru: 'от 1 500 000 сум', uz: '1 500 000 so‘mdan' },
      },
      ai: {
        title: { ru: 'AI-интеграции', uz: 'AI-integratsiyalar' },
        budget: { ru: 'индивидуально', uz: 'kelishilgan holda' },
      },
    };

    const target = serviceNameMap[serviceId];
    if (target) {
      setPrefilledService(lang === 'uz' ? target.title.uz : target.title.ru);
      setPrefilledBudget(lang === 'uz' ? target.budget.uz : target.budget.ru);
    }
    scrollToContact();
  };

  const handleGetQuote = (quoteData: {
    serviceName: string;
    hasDesign: boolean;
    hasContent: boolean;
    urgency: string;
    estimatedCost: string;
  }) => {
    setPrefilledService(quoteData.serviceName);
    setPrefilledBudget(quoteData.estimatedCost);
    setPrefilledNotes(
      lang === 'uz'
        ? `Kalkulyator: Dizayn: ${quoteData.hasDesign ? 'Bor' : 'Kerak'}, Kontent: ${
            quoteData.hasContent ? 'Bor' : 'Kerak'
          }, Muddat: ${quoteData.urgency}`
        : `Калькулятор: Дизайн: ${quoteData.hasDesign ? 'Есть' : 'Нужен'}, Контент: ${
            quoteData.hasContent ? 'Есть' : 'Нужен'
          }, Срок: ${quoteData.urgency}`
    );
    scrollToContact();
  };

  const handleOrderSimilar = (projectName: string) => {
    setPrefilledNotes(
      lang === 'uz'
        ? `Portfoliodagi "${projectName}" kabi shunga o‘xshash loyiha kerak.`
        : `Хочу аналогичный проект как "${projectName}" из портфолио.`
    );
    scrollToContact();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Signature NIGHTON Day-to-Night Intro Animation */}
      <NightonIntro lang={lang} />

      {/* Desktop custom cursor follower (disabled on mobile) */}
      <CustomCursor />

      {/* Sticky Navigation Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onOrderClick={scrollToContact}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          lang={lang}
          onOrderClick={scrollToContact}
          onPortfolioClick={scrollToPortfolio}
        />

        {/* Services Section */}
        <Services
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* Portfolio Section */}
        <Portfolio
          lang={lang}
          onOrderSimilar={handleOrderSimilar}
        />

        {/* Process Section */}
        <Process lang={lang} />

        {/* Why NIGHTON Section */}
        <WhyUs lang={lang} />

        {/* Interactive Cost Calculator */}
        <CostCalculator
          lang={lang}
          onGetQuote={handleGetQuote}
        />

        {/* Big Order Form Section */}
        <OrderForm
          lang={lang}
          prefilledService={prefilledService}
          prefilledBudget={prefilledBudget}
          prefilledNotes={prefilledNotes}
        />

        {/* Telegram Direct CTA Section */}
        <TelegramCTA lang={lang} />
      </main>

      {/* Footer & Contacts */}
      <ContactsFooter lang={lang} />
    </div>
  );
}

