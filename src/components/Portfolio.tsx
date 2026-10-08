import React, { useState } from 'react';
import { Language, ProjectItem } from '../types';
import { translations } from '../i18n/translations';
import { portfolioProjects } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowUpRight, X, Sparkles, CheckCircle2, Layers } from 'lucide-react';

interface PortfolioProps {
  lang: Language;
  onOrderSimilar: (projectName: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  lang,
  onOrderSimilar,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'web' | 'bot' | 'ai'>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const t = translations[lang];
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const filteredProjects = portfolioProjects.filter((project) => {
    if (selectedFilter === 'all') return true;
    return project.category === selectedFilter;
  });

  const isUz = lang === 'uz';

  const getProjectTitle = (p: ProjectItem) => (isUz && p.titleUz ? p.titleUz : p.title);
  const getProjectType = (p: ProjectItem) => (isUz && p.typeUz ? p.typeUz : p.type);
  const getProjectShortDesc = (p: ProjectItem) => (isUz && p.shortDescriptionUz ? p.shortDescriptionUz : p.shortDescription);
  const getProjectFullDesc = (p: ProjectItem) => (isUz && p.fullDescriptionUz ? p.fullDescriptionUz : p.fullDescription);
  const getProjectMetrics = (p: ProjectItem) => (isUz && p.metricsUz ? p.metricsUz : p.metrics);
  const getProjectFeatures = (p: ProjectItem) => (isUz && p.featuresUz ? p.featuresUz : p.features);

  return (
    <section id="portfolio" ref={ref} className="py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with smooth reveal */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 space-y-4 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {t.portfolio.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.portfolio.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* Filter Segmented Bar with smooth click feedback */}
        <div
          className={`flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-2 transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="p-1 rounded-xl bg-white/[0.04] border border-white/10 flex gap-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.portfolio.filterAll}
            </button>
            <button
              onClick={() => setSelectedFilter('web')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedFilter === 'web'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.portfolio.filterWeb}
            </button>
            <button
              onClick={() => setSelectedFilter('bot')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedFilter === 'bot'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.portfolio.filterBot}
            </button>
            <button
              onClick={() => setSelectedFilter('ai')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedFilter === 'ai'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.portfolio.filterAi}
            </button>
          </div>
        </div>

        {/* Projects Grid with Stagger & Image Zoom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group rounded-2xl bg-[#0c1427]/80 border border-white/[0.08] hover:border-blue-500/40 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-2xl hover:shadow-blue-500/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                willChange: 'transform, opacity',
              }}
            >
              {/* Visual Preview Banner with smooth zoom on hover */}
              <div
                className={`relative h-48 w-full bg-gradient-to-br ${project.previewColor} p-6 flex flex-col justify-between overflow-hidden border-b border-white/[0.08]`}
              >
                {/* Tech texture with subtle zoom */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Top header of card preview */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 tracking-wider">
                    {getProjectType(project)}
                  </span>
                  {project.isDemo && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {t.portfolio.demoBadge}
                    </span>
                  )}
                </div>

                {/* Center visual abstract preview mockup with slight hover lift */}
                <div className="relative z-10 space-y-1.5 max-w-[85%] transition-transform duration-500 group-hover:translate-x-1">
                  <div className="h-2 w-24 bg-white/40 rounded-full" />
                  <div className="h-2 w-40 bg-white/20 rounded-full" />
                  <div className="h-5 flex items-center gap-2 mt-3">
                    <span className="text-xs font-semibold text-white/90">
                      {getProjectMetrics(project)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                    {getProjectTitle(project)}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {getProjectShortDesc(project)}
                  </p>
                </div>

                {/* Tags (clean typography with separators per design constitution) */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {project.tags.map((tag, idx) => (
                    <React.Fragment key={idx}>
                      <span>{tag}</span>
                      {idx < project.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Action button with micro-interactions */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-blue-600 text-slate-200 hover:text-white border border-white/10 hover:border-blue-500 text-sm font-semibold transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer group/btn hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{t.portfolio.viewBtn}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-250 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c1427] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                  {getProjectType(activeModalProject)}
                </span>
                {activeModalProject.isDemo && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {t.portfolio.demoBadge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {getProjectTitle(activeModalProject)}
              </h3>
            </div>

            {/* Detailed Description */}
            <p className="text-slate-300 text-base leading-relaxed">
              {getProjectFullDesc(activeModalProject)}
            </p>

            {/* Key Features */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                {t.portfolio.keyFeatures}
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {getProjectFeatures(activeModalProject).map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-300">
                  {isUz ? 'Natija / Ko‘rsatkichlar' : 'Результат / Показатели'}
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {getProjectMetrics(activeModalProject)}
                </div>
              </div>
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/10">
              <button
                onClick={() => setActiveModalProject(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              >
                {t.portfolio.closeBtn}
              </button>
              <button
                onClick={() => {
                  const title = getProjectTitle(activeModalProject);
                  setActiveModalProject(null);
                  onOrderSimilar(title);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isUz ? 'Shunga o‘xshash loyiha buyurtma qilish' : 'Хочу похожий проект'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
