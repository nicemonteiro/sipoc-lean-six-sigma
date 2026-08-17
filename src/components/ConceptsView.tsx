import React, { useState } from "react";
import { SIPOC_CONCEPTS, FOUNDATIONAL_STEPS_GUIDE } from "../data/concepts";
import {
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Target,
  History,
  Workflow,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

interface ConceptsViewProps {
  onGoToBuilder: () => void;
  onGoToCase: () => void;
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({
  onGoToBuilder,
  onGoToCase,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string>("s");

  const currentConcept = SIPOC_CONCEPTS.find((c) => c.id === selectedLetter) || SIPOC_CONCEPTS[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero / Overview Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1E293B] text-slate-100 p-8 sm:p-12 border border-slate-700 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <Target className="w-3.5 h-3.5" />
            Metodologia Lean Six Sigma
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Desmistificando o <span className="text-emerald-400">SIPOC</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Uma ferramenta visual de alto nível para mapear qualquer rotina ou processo,
            garantindo que você entenda exatamente onde começa, onde termina e o valor real que entrega.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="btn-concepts-start-builder"
              onClick={onGoToBuilder}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Meu SIPOC com IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-concepts-see-case"
              onClick={onGoToCase}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold transition-all border border-slate-700 cursor-pointer text-sm"
            >
              <span>Ver Estudo de Caso do Café</span>
            </button>
          </div>
        </div>

        {/* Decorative Letters in Background */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-3 text-slate-800/80 font-black text-8xl select-none opacity-40">
          <span>S</span>
          <span>I</span>
          <span>P</span>
          <span>O</span>
          <span>C</span>
        </div>
      </section>

      {/* 3 Pillars: What is it, Who created it, Purpose */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 font-bold text-lg">
            <Workflow className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-2">O que é SIPOC?</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            É um acrônimo para <strong>Suppliers</strong> (Fornecedores), <strong>Inputs</strong> (Entradas),{" "}
            <strong>Process</strong> (Processo), <strong>Outputs</strong> (Saídas) e <strong>Customers</strong> (Clientes).
            Funciona como uma fotografia panorâmica de um processo antes de fluxogramas complexos.
          </p>
        </div>

        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-5 font-bold text-lg">
            <History className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-2">Quem criou e quando?</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Surgiu no final dos <strong>anos 1980</strong> com a Gestão da Qualidade Total (TQM) e foi
            popularizado pela <strong>Motorola</strong> e <strong>General Electric</strong> como etapa inicial
            da fase <em>Define (Definir)</em> do ciclo Lean Six Sigma DMAIC.
          </p>
        </div>

        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 font-bold text-lg">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-2">Com qual finalidade?</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Garantir <strong>clareza e consenso</strong> sobre o escopo: quem fornece o que,
            quais insumos são críticos, quais são as 4 a 7 etapas centrais e quem realmente se beneficia do resultado.
          </p>
        </div>
      </section>

      {/* Foundational Thinking Flow */}
      <section className="bg-[#1E293B] rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-md">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Passo a Passo do Raciocínio (Guia de Bolso)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
            As 5 Perguntas Essenciais antes da Tabela
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Antes de preencher o quadro, defina as fronteiras do processo respondendo a estas 5 perguntas fundamentais:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FOUNDATIONAL_STEPS_GUIDE.map((step) => (
            <div
              key={step.step}
              className="bg-[#0F172A] p-5 rounded-2xl border border-slate-700/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500 text-[#0F172A] font-bold text-xs flex items-center justify-center">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{step.title}</h3>
                <p className="text-xs font-semibold text-emerald-400 italic mb-2">"{step.question}"</p>
                <p className="text-xs text-slate-400 leading-relaxed">{step.rule}</p>
              </div>
            </div>
          ))}

          {/* Golden Summary Card */}
          <div className="bg-[#0F172A] text-slate-100 p-5 rounded-2xl border border-emerald-500/40 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Regra de Ouro</span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">Primeiro Input vs 1ª Etapa</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O <strong>Gatilho</strong> é sempre o primeiro input recebido do exterior (ex: "O pedido do café").
                O <strong>Start Point</strong> é a primeira ação que você executa e controla (ex: "Levantar a demanda e definir responsável").
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep-Dive Interactive S-I-P-O-C Columns */}
      <section className="bg-[#1E293B] rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-md">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
            Exploração Detalhada
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            As 5 Colunas do SIPOC Explicadas
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Clique em cada letra para entender a definição exata, pergunta chave, regras de formatação e erros comuns.
          </p>
        </div>

        {/* Column Selectors */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-8">
          {SIPOC_CONCEPTS.map((concept) => {
            const isSelected = concept.id === selectedLetter;
            return (
              <button
                key={concept.id}
                id={`btn-concept-tab-${concept.id}`}
                onClick={() => setSelectedLetter(concept.id)}
                className={`p-3 sm:p-4 rounded-2xl text-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md font-bold"
                    : "bg-[#0F172A]/70 hover:bg-slate-900 text-slate-400 border-slate-700"
                }`}
              >
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{concept.letter}</div>
                <div className="text-[11px] sm:text-xs font-medium truncate mt-1">
                  {concept.name.split(" ")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Concept Card Content */}
        <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 border border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-xl bg-emerald-500 text-[#0F172A] font-black text-xl flex items-center justify-center">
                  {currentConcept.letter}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentConcept.name}
                  </h3>
                  <p className="text-xs text-slate-400">{currentConcept.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] px-4 py-3 rounded-xl border border-slate-700 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Pergunta Orientadora
              </span>
              <p className="text-sm font-semibold text-slate-200 italic">
                "{currentConcept.question}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Rules & Definitions */}
            <div className="space-y-4">
              <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Forma & Regra Técnica</span>
                </div>
                <p className="text-xs font-semibold text-emerald-300 mb-2">
                  {currentConcept.formatRule}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentConcept.ruleExplanation}
                </p>
              </div>

              <div className="bg-rose-950/30 p-5 rounded-xl border border-rose-800/40">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Erros Comuns para Evitar</span>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-200">
                  {currentConcept.commonMistakes.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coffee Study Case Examples */}
            <div className="bg-[#1E293B] text-slate-100 p-6 rounded-xl border border-emerald-500/30 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <span>☕</span>
                  <span>{currentConcept.coffeeExample.title}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {currentConcept.coffeeExample.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#0F172A]/70 p-2.5 rounded-lg border border-slate-700">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-emerald-400/80">
                Veja o fluxo completo de Nice, Claudia e Sara na aba Estudo de Caso.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-[#1E293B] border border-emerald-500/30 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pronto para construir o seu SIPOC?</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Nosso assistente com Gemini 3.7 Flash vai te guiar pergunta a pergunta, sugerindo gatilhos precisos, marcos de início e fim e etapas padronizadas.
          </p>
        </div>
        <button
          id="btn-cta-builder"
          onClick={onGoToBuilder}
          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          Abrir Construtor Interativo
        </button>
      </section>
    </div>
  );
};
