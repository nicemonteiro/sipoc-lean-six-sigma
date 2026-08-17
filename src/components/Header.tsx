import React from "react";
import { BookOpen, Coffee, Sparkles, HelpCircle, GitBranch, Layers } from "lucide-react";

export type NavTab = "concepts" | "case" | "builder" | "quiz" | "roadmap";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  geminiActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  geminiActive = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-700 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-lg text-[#0F172A] shadow-md shadow-emerald-950/50">
              Σ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Lean Six Sigma <span className="text-emerald-400">Studio</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
                  SIPOC
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Portal de Aprendizado Contínuo & Assistente de Mapeamento
              </p>
            </div>
          </div>

          {/* AI Status Pill */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs">
            <div className={`w-2 h-2 rounded-full ${geminiActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" : "bg-amber-400"}`} />
            <span className="text-slate-300 font-medium flex items-center gap-1.5 text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Gemini 3.7 Flash Ativo
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-700/80 text-xs sm:text-sm">
          <button
            id="tab-concepts"
            onClick={() => onSelectTab("concepts")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              currentTab === "concepts"
                ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>O que é SIPOC & Conceitos</span>
          </button>

          <button
            id="tab-case"
            onClick={() => onSelectTab("case")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              currentTab === "case"
                ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Estudo de Caso: Fazer Café</span>
          </button>

          <button
            id="tab-builder"
            onClick={() => onSelectTab("builder")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              currentTab === "builder"
                ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Construtor com IA</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${
              currentTab === "builder" ? "bg-[#0F172A]/20 text-[#0F172A] font-bold" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              Interativo
            </span>
          </button>

          <button
            id="tab-quiz"
            onClick={() => onSelectTab("quiz")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              currentTab === "quiz"
                ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz de Fixação</span>
          </button>

          <button
            id="tab-roadmap"
            onClick={() => onSelectTab("roadmap")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              currentTab === "roadmap"
                ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Trilha Lean Six Sigma</span>
          </button>
        </div>
      </div>
    </header>
  );
};
