import React, { useState, useEffect } from "react";
import { Header, NavTab } from "./components/Header";
import { ConceptsView } from "./components/ConceptsView";
import { CoffeeCaseStudy } from "./components/CoffeeCaseStudy";
import { SipocBuilder } from "./components/SipocBuilder";
import { QuizView } from "./components/QuizView";
import { RoadmapView } from "./components/RoadmapView";
import { Sparkles, BookOpen, Coffee, HelpCircle, GitBranch, Layers } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("concepts");
  const [geminiActive, setGeminiActive] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.geminiConfigured === "boolean") {
          setGeminiActive(data.geminiConfigured);
        }
      })
      .catch(() => {
        setGeminiActive(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        geminiActive={geminiActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {currentTab === "concepts" && (
          <ConceptsView
            onGoToBuilder={() => setCurrentTab("builder")}
            onGoToCase={() => setCurrentTab("case")}
          />
        )}

        {currentTab === "case" && (
          <CoffeeCaseStudy
            onStartCustomSipoc={() => setCurrentTab("builder")}
          />
        )}

        {currentTab === "builder" && <SipocBuilder />}

        {currentTab === "quiz" && (
          <QuizView onGoToBuilder={() => setCurrentTab("builder")} />
        )}

        {currentTab === "roadmap" && (
          <RoadmapView onGoToSipoc={() => setCurrentTab("concepts")} />
        )}
      </main>

      {/* Modern Sophisticated Dark Footer */}
      <footer className="bg-[#1E293B] text-slate-400 text-xs py-6 border-t border-slate-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-6 h-6 rounded-md bg-emerald-500 text-[#0F172A] font-black text-xs flex items-center justify-center">
              Σ
            </div>
            <span className="font-semibold text-slate-100">Lean Six Sigma Studio</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Módulo SIPOC Interativo com Gemini AI</span>
          </div>

          <div className="flex items-center gap-5 text-slate-400 text-xs">
            <button
              onClick={() => setCurrentTab("concepts")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Conceitos
            </button>
            <button
              onClick={() => setCurrentTab("case")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Estudo do Café
            </button>
            <button
              onClick={() => setCurrentTab("builder")}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-medium text-emerald-400"
            >
              Construtor IA
            </button>
            <button
              onClick={() => setCurrentTab("quiz")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Quiz
            </button>
            <button
              onClick={() => setCurrentTab("roadmap")}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Trilha Lean
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase tracking-widest font-mono">
            <span>Status:</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
