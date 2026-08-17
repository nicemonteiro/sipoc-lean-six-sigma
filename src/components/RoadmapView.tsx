import React from "react";
import { CheckCircle2, Lock, Sparkles, BookOpen, Layers, GitBranch, ArrowRight } from "lucide-react";

interface RoadmapViewProps {
  onGoToSipoc: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onGoToSipoc }) => {
  const modules = [
    {
      id: "sipoc",
      number: "01",
      title: "SIPOC: Mapeamento de Alto Nível",
      desc: "Definição de fronteiras, gatilho (trigger), fornecedores, entradas, macroprocesso, saídas e clientes.",
      status: "completed",
      phase: "Define (DMAIC)",
    },
    {
      id: "dmaic",
      number: "02",
      title: "DMAIC: O Ciclo de Melhoria Contínua",
      desc: "Define (Definir), Measure (Medir), Analyze (Analisar), Improve (Melhorar) e Control (Controlar).",
      status: "upcoming",
      phase: "Metodologia Central",
    },
    {
      id: "vsm",
      number: "03",
      title: "VSM: Mapa do Fluxo de Valor",
      desc: "Identificação visual de desperdícios (Muda), tempo de ciclo, lead time e fluxo contínuo.",
      status: "upcoming",
      phase: "Measure & Analyze",
    },
    {
      id: "root-cause",
      number: "04",
      title: "Ishikawa & 5 Porquês",
      desc: "Diagrama de Causa e Efeito (Espinha de Peixe / 6M) e técnica dos 5 Porquês para investigação de causa raiz.",
      status: "upcoming",
      phase: "Analyze",
    },
    {
      id: "fmea",
      number: "05",
      title: "Matriz Causa e Efeito & FMEA",
      desc: "Priorização de variáveis de entrada críticas (X's) e Análise de Modos de Falha e Efeitos.",
      status: "upcoming",
      phase: "Improve",
    },
    {
      id: "spc",
      number: "06",
      title: "Cartas de Controle Estatístico (CEP) & Cp/Cpk",
      desc: "Monitoramento da estabilidade do processo e cálculo de índices de capacidade Six Sigma.",
      status: "upcoming",
      phase: "Control",
    },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#1E293B] text-slate-100 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
          <GitBranch className="w-3.5 h-3.5" />
          Evolução Modular do Site
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sua Trilha de Estudos: <span className="text-emerald-400">Lean Six Sigma</span>
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Este site foi estruturado para crescer continuamente conforme você avança em cada conceito.
          O módulo <strong className="text-emerald-400">SIPOC</strong> está 100% ativo com assistente IA, e os próximos tópicos serão habilitados conforme seus novos estudos!
        </p>
      </div>

      {/* Modules Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const isDone = mod.status === "completed";

          return (
            <div
              key={mod.id}
              className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                isDone
                  ? "bg-[#1E293B] border-emerald-500/60 shadow-xl ring-2 ring-emerald-500/20"
                  : "bg-[#0F172A] border-slate-800 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {mod.phase}
                  </span>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Módulo Ativo</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Em Estudo</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-slate-500 font-mono font-bold text-xs">{mod.number}.</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {mod.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">{mod.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                {isDone ? (
                  <button
                    id={`btn-open-module-${mod.id}`}
                    onClick={onGoToSipoc}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <span>Acessar Módulo SIPOC Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    Próximo tema a ser integrado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
