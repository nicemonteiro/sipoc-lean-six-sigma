import React, { useState } from "react";
import { COFFEE_CASE_PROJECT, COFFEE_CASE_STEPS } from "../data/coffeeCase";
import { SipocTableView } from "./SipocTableView";
import {
  Coffee,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Users,
  Maximize2,
  Table,
} from "lucide-react";

interface CoffeeCaseStudyProps {
  onStartCustomSipoc: () => void;
}

export const CoffeeCaseStudy: React.FC<CoffeeCaseStudyProps> = ({
  onStartCustomSipoc,
}) => {
  const [activeView, setActiveView] = useState<"narrative" | "table">("narrative");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const activeStep = COFFEE_CASE_STEPS[currentStepIndex];

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <section className="bg-[#1E293B] text-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Coffee className="w-3.5 h-3.5" />
              Estudo de Caso Prático
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Processo de Fazer Café: <span className="text-emerald-400">Nice, Claudia e Sara</span>
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Acompanhe o raciocínio completo da apresentação de Lean Six Sigma, desde a distinção de processo até a tabela final com as 7 etapas (P1 a P7).
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-2 bg-[#0F172A] p-1.5 rounded-2xl border border-slate-700 self-start lg:self-auto">
            <button
              id="btn-view-narrative"
              onClick={() => setActiveView("narrative")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === "narrative"
                  ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Passo a Passo Visual</span>
            </button>

            <button
              id="btn-view-table"
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === "table"
                  ? "bg-emerald-500 text-[#0F172A] font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Tabela SIPOC Completa</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Summary Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-700/80 text-xs">
          <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
              1. Nome do Processo
            </span>
            <p className="text-slate-200 font-medium">Preparar e servir café durante reunião de estudos</p>
          </div>
          <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
              2. Gatilho (Trigger)
            </span>
            <p className="text-slate-200 font-medium">O pedido do café (antes dele, ninguém fazia nada)</p>
          </div>
          <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-700">
            <span className="text-sky-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
              3. Start Point
            </span>
            <p className="text-slate-200 font-medium">Levantar a demanda e definir o responsável (P1)</p>
          </div>
          <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
              4. End Point
            </span>
            <p className="text-slate-200 font-medium">Servir o café / Servir as xícaras (P7)</p>
          </div>
        </div>
      </section>

      {/* Narrative Interactive Step-by-Step */}
      {activeView === "narrative" ? (
        <div className="space-y-8">
          {/* Step Navigation Pill Bar */}
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              {COFFEE_CASE_STEPS.map((step, idx) => {
                const isSelected = idx === currentStepIndex;
                return (
                  <button
                    key={step.id}
                    id={`btn-coffee-step-${idx}`}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500 text-[#0F172A] font-black shadow-sm"
                        : "bg-[#0F172A] hover:bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {step.stepNumber}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-prev-coffee-step"
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 border border-slate-700 cursor-pointer"
                title="Etapa anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="btn-next-coffee-step"
                onClick={() => setCurrentStepIndex((prev) => Math.min(COFFEE_CASE_STEPS.length - 1, prev + 1))}
                disabled={currentStepIndex === COFFEE_CASE_STEPS.length - 1}
                className="p-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 border border-slate-700 cursor-pointer"
                title="Próxima etapa"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Card for Active Step */}
          <div className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="bg-[#0F172A] text-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-[#0F172A]">
                    Etapa {activeStep.stepNumber}
                  </span>
                  {currentStepIndex === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Start Point
                    </span>
                  )}
                  {currentStepIndex === COFFEE_CASE_STEPS.length - 1 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      End Point
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeStep.process}
                </h2>
              </div>

              <div className="text-xs text-slate-400 sm:text-right">
                <span className="block font-medium text-slate-300">Lean Six Sigma Coffee Workflow</span>
                <span>Passo {currentStepIndex + 1} de {COFFEE_CASE_STEPS.length}</span>
              </div>
            </div>

            {/* S-I-P-O-C Deep Inspection for this specific step */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* S - Suppliers */}
              <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm flex items-center justify-center">
                    S
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase">Suppliers</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-2">Quem fornece o input?</h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeStep.suppliers.map((sup, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-[#1E293B] p-2.5 rounded-lg border border-slate-700">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{sup}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* I - Inputs */}
              <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm flex items-center justify-center">
                    I
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Inputs (Substantivos)</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-2">O que precisa chegar?</h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeStep.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-[#1E293B] p-2.5 rounded-lg border border-slate-700">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="font-medium text-white">{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* O - Outputs */}
              <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm flex items-center justify-center">
                    O
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase">Outputs (Estados)</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-2">O que passa a existir?</h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeStep.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-[#1E293B] p-2.5 rounded-lg border border-slate-700">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* C - Customers */}
              <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold text-sm flex items-center justify-center">
                    C
                  </span>
                  <span className="text-[11px] font-semibold text-sky-400 uppercase">Customers</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-2">Quem recebe a saída?</h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeStep.customers.map((cust, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-[#1E293B] p-2.5 rounded-lg border border-slate-700">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{cust}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Context Note from presentation */}
            <div className="bg-[#0F172A] border-t border-slate-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Personagens:</span>
                <span>Nice, Claudia e Sara (Estudo de Lean Six Sigma em equipe)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="btn-coffee-see-full-table"
                  onClick={() => setActiveView("table")}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Ver tabela com as 7 etapas juntas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Table View */
        <div className="space-y-4">
          <SipocTableView
            title={COFFEE_CASE_PROJECT.title}
            type={COFFEE_CASE_PROJECT.type}
            trigger={COFFEE_CASE_PROJECT.trigger}
            startPoint={COFFEE_CASE_PROJECT.startPoint}
            endPoint={COFFEE_CASE_PROJECT.endPoint}
            notes={COFFEE_CASE_PROJECT.notes}
            steps={COFFEE_CASE_STEPS}
            showExportControls={true}
          />
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-lg">Inspirado pelo exemplo do café?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Agora construa o SIPOC de qualquer outro processo (vendas, RH, suporte, logística) com ajuda da nossa IA.
          </p>
        </div>

        <button
          id="btn-coffee-cta-builder"
          onClick={onStartCustomSipoc}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Iniciar Construtor SIPOC</span>
        </button>
      </div>
    </div>
  );
};
