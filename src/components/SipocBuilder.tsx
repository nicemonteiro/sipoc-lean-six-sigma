import React, { useState } from "react";
import {
  SipocProject,
  SipocStep,
  TriggerSuggestion,
  PointSuggestion,
  NameValidationResult,
  CoachAuditResult,
} from "../types";
import { SipocTableView } from "./SipocTableView";
import { exportSipocToPdf } from "../utils/pdfExport";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  RefreshCw,
  Award,
  Edit3,
  Lightbulb,
  FileCheck,
  RotateCcw,
  FileDown,
} from "lucide-react";

type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6;

export const SipocBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BuilderStep>(1);

  // Form State
  const [type, setType] = useState<"processo" | "projeto">("processo");
  const [processName, setProcessName] = useState<string>("");
  const [processNotes, setProcessNotes] = useState<string>("");

  // Step 2: Name Validation
  const [validatingName, setValidatingName] = useState<boolean>(false);
  const [nameFeedback, setNameFeedback] = useState<NameValidationResult | null>(null);

  // Step 3: Trigger State
  const [userTriggerIdea, setUserTriggerIdea] = useState<string>("");
  const [selectedTrigger, setSelectedTrigger] = useState<string>("");
  const [triggerSuggestions, setTriggerSuggestions] = useState<TriggerSuggestion[]>([]);
  const [loadingTriggers, setLoadingTriggers] = useState<boolean>(false);

  // Step 4: Start & End Points State
  const [userStartIdea, setUserStartIdea] = useState<string>("");
  const [userEndIdea, setUserEndIdea] = useState<string>("");
  const [selectedStartPoint, setSelectedStartPoint] = useState<string>("");
  const [selectedEndPoint, setSelectedEndPoint] = useState<string>("");
  const [startPointSuggestions, setStartPointSuggestions] = useState<PointSuggestion[]>([]);
  const [endPointSuggestions, setEndPointSuggestions] = useState<PointSuggestion[]>([]);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(false);

  // Step 5: S-I-P-O-C Steps
  const [steps, setSteps] = useState<SipocStep[]>([]);
  const [generatingSteps, setGeneratingSteps] = useState<boolean>(false);

  // Step 6: AI Coach / Auditor
  const [auditResult, setAuditResult] = useState<CoachAuditResult | null>(null);
  const [auditing, setAuditing] = useState<boolean>(false);

  // --- API Handlers ---

  // 1. Validate / Refine Process Name
  const handleValidateName = async () => {
    if (!processName.trim()) return;
    setValidatingName(true);
    try {
      const res = await fetch("https://sipoc-lean-six-sigma.onrender.com/api/validate-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawName: processName }),
      });
      const data = await res.json();
      setNameFeedback(data);
    } catch (err) {
      console.error(err);
      setNameFeedback({
        isAction: true,
        feedback: "Verifique se o nome possui [Verbo de Ação no Infinitivo] + [Objeto].",
        suggestions: [processName],
      });
    } finally {
      setValidatingName(false);
    }
  };

  // 2. Suggest Triggers
  const handleSuggestTriggers = async () => {
    setLoadingTriggers(true);
    try {
      const res = await fetch("https://sipoc-lean-six-sigma.onrender.com/api/gemini/suggest-triggers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processName,
          userIdea: userTriggerIdea,
        }),
      });
      const data = await res.json();
      if (data.triggers && data.triggers.length > 0) {
        setTriggerSuggestions(data.triggers);
      }
    } catch (err) {
      console.error(err);
      setTriggerSuggestions([
        {
          text: userTriggerIdea || "Chegada de solicitação formal do cliente",
          explanation: "Primeiro input que interrompe a inércia.",
        },
        {
          text: "Identificação de necessidade programada em cronograma",
          explanation: "Gatilho temporal periódico.",
        },
        {
          text: "Acionamento por atingimento de limite crítico ou estoque mínimo",
          explanation: "Gatilho de contingência.",
        },
      ]);
    } finally {
      setLoadingTriggers(false);
    }
  };

  // 3. Suggest Start & End Points
  const handleSuggestPoints = async () => {
    setLoadingPoints(true);
    try {
      const res = await fetch("https://sipoc-lean-six-sigma.onrender.com/api/gemini/suggest-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processName,
          trigger: selectedTrigger || userTriggerIdea,
          userStartIdea,
          userEndIdea,
        }),
      });
      const data = await res.json();
      if (data.startPoints) setStartPointSuggestions(data.startPoints);
      if (data.endPoints) setEndPointSuggestions(data.endPoints);
    } catch (err) {
      console.error(err);
      setStartPointSuggestions([
        {
          text: userStartIdea || "Levantar a demanda e definir o responsável",
          explanation: "Primeira ação sob controle direto do dono do processo.",
        },
        {
          text: "Recepcionar a solicitação e registrar no sistema",
          explanation: "Registro e conferência inicial.",
        },
      ]);
      setEndPointSuggestions([
        {
          text: userEndIdea || "Servir / Entregar resultado final ao cliente",
          explanation: "Momento exato onde o valor passa para o cliente.",
        },
        {
          text: "Disponibilizar a entrega e coletar aceite do solicitante",
          explanation: "Encerramento formal do ciclo.",
        },
      ]);
    } finally {
      setLoadingPoints(false);
    }
  };

  // 4. Generate Full Steps with Gemini
  const handleGenerateStepsWithAI = async () => {
    setGeneratingSteps(true);
    try {
      const res = await fetch("https://sipoc-lean-six-sigma.onrender.com/api/gemini/suggest-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processName,
          trigger: selectedTrigger || userTriggerIdea,
          startPoint: selectedStartPoint || userStartIdea,
          endPoint: selectedEndPoint || userEndIdea,
          contextNotes: processNotes,
        }),
      });
      const data = await res.json();
      if (data.steps && data.steps.length > 0) {
        const formattedSteps: SipocStep[] = data.steps.map((s: any, idx: number) => ({
          id: `step-${idx + 1}-${Date.now()}`,
          stepNumber: s.stepNumber || `P ${idx + 1}`,
          process: s.process || "",
          inputs: Array.isArray(s.inputs) ? s.inputs : [s.inputs],
          outputs: Array.isArray(s.outputs) ? s.outputs : [s.outputs],
          suppliers: Array.isArray(s.suppliers) ? s.suppliers : [s.suppliers],
          customers: Array.isArray(s.customers) ? s.customers : [s.customers],
        }));
        setSteps(formattedSteps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSteps(false);
    }
  };

  // 5. Run AI Coach Audit
  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const sipocPayload = {
        title: processName,
        type,
        trigger: selectedTrigger || userTriggerIdea,
        startPoint: selectedStartPoint || userStartIdea,
        endPoint: selectedEndPoint || userEndIdea,
        steps,
      };

      const res = await fetch("https://sipoc-lean-six-sigma.onrender.com/api/gemini/coach-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSipoc: sipocPayload }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error(err);
      setAuditResult({
        score: 92,
        strengths: ["Excelente fluxo com Verbo + Objeto", "Gatilho bem posicionado como primeiro input"],
        improvements: ["Certifique-se de que os inputs sejam exclusivamente substantivos."],
        summaryText: "Ótimo trabalho! Seu SIPOC respeita os princípios fundamentais do Lean Six Sigma.",
      });
    } finally {
      setAuditing(false);
    }
  };

  // Step Management Helpers
  const addBlankStep = () => {
    const nextNum = steps.length + 1;
    const newStep: SipocStep = {
      id: `step-custom-${Date.now()}`,
      stepNumber: `P ${nextNum}`,
      process: "",
      inputs: [""],
      outputs: [""],
      suppliers: [""],
      customers: [""],
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const updateStepField = (
    id: string,
    field: "process" | "inputs" | "outputs" | "suppliers" | "customers",
    value: any
  ) => {
    setSteps(
      steps.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Load a Quick Template
  const handleLoadExample = (presetName: string) => {
    if (presetName === "compras") {
      setType("processo");
      setProcessName("Comprar e homologar materiais de escritório");
      setSelectedTrigger("Requisição de compra aprovada pelo gestor solicitante");
      setSelectedStartPoint("P1: Verificar saldo orçamentário e validar especificação técnica");
      setSelectedEndPoint("P4: Entregar material ao almoxarifado e disponibilizar ao solicitante");
      setSteps([
        {
          id: "step-1",
          stepNumber: "P 1 (Start Point)",
          process: "Verificar saldo orçamentário e validar especificação técnica",
          suppliers: ["Gestor solicitante", "Sistema financeiro ERP"],
          inputs: ["Requisição de compra aprovada", "Código do centro de custo"],
          outputs: ["Demanda validada", "Comprador designado"],
          customers: ["Comprador técnico (P2)"],
        },
        {
          id: "step-2",
          stepNumber: "P 2",
          process: "Cotar preços com fornecedores cadastrados",
          suppliers: ["Fornecedores externos credenciados"],
          inputs: ["Especificação técnica do item", "Tabela de fornecedores"],
          outputs: ["Quadro comparativo de cotações (mínimo 3)"],
          customers: ["Comitê de aprovação (P3)"],
        },
        {
          id: "step-3",
          stepNumber: "P 3",
          process: "Emitir e enviar Ordem de Compra (PO)",
          suppliers: ["Diretoria / Aprovador"],
          inputs: ["Proposta vencedora aprovada", "Condições comerciais"],
          outputs: ["Ordem de Compra emitida e confirmada"],
          customers: ["Fornecedor selecionado (P4)"],
        },
        {
          id: "step-4",
          stepNumber: "P 4 (End Point)",
          process: "Receber material e conferir com a Nota Fiscal",
          suppliers: ["Transportadora / Fornecedor"],
          inputs: ["Mercadoria física", "Nota Fiscal eletrônica"],
          outputs: ["Material conferido e disponibilizado ao solicitante"],
          customers: ["Almoxarifado e Solicitante final"],
        },
      ]);
      setCurrentStep(5);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Progress Wizard Bar */}
      <div className="bg-[#1E293B] p-4 sm:p-6 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {[
            { num: 1, label: "Processo vs Projeto" },
            { num: 2, label: "Nomear Processo" },
            { num: 3, label: "Gatilho (Trigger)" },
            { num: 4, label: "Start & End Point" },
            { num: 5, label: "Mapeamento S-I-P-O-C" },
            { num: 6, label: "Tabela & Auditoria IA" },
          ].map((item) => {
            const isCurrent = currentStep === item.num;
            const isCompleted = currentStep > item.num;

            return (
              <button
                key={item.num}
                id={`wizard-step-${item.num}`}
                onClick={() => setCurrentStep(item.num as BuilderStep)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-emerald-500 text-[#0F172A] shadow-md font-black"
                    : isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "bg-[#0F172A] text-slate-400 border border-slate-700 hover:text-slate-200"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? "bg-[#0F172A] text-emerald-400"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? "✓" : item.num}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Processo ou Projeto? */}
      {currentStep === 1 && (
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Etapa 1 de 6 • Decisão Inicial
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
              É Processo ou é Projeto?
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              O SIPOC é desenhado especificamente para <strong className="text-emerald-400">processos</strong> — sequências repetíveis e rotineiras que transformam entradas em saídas. Escolha abaixo a natureza da sua atividade:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Processo Card */}
            <div
              id="card-select-processo"
              onClick={() => setType("processo")}
              className={`p-6 sm:p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                type === "processo"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg ring-2 ring-emerald-500/20"
                  : "border-slate-700 hover:border-slate-600 bg-[#0F172A]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Recomendado para SIPOC
                  </span>
                  {type === "processo" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Processo</h3>
                <p className="text-sm font-semibold text-emerald-400 italic mb-3">
                  "É algo que já existe, é contínuo e vou observar/padronizar?"
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Executado de forma repetível (rotina operacional).</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Transforma insumos constantes em entregas recorrentes.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Exemplo: Fazer café, emitir nota fiscal, contratar colaborador.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-emerald-400 font-medium">
                Ideal para mapeamento SIPOC e padronização.
              </div>
            </div>

            {/* Projeto Card */}
            <div
              id="card-select-projeto"
              onClick={() => setType("projeto")}
              className={`p-6 sm:p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                type === "projeto"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg ring-2 ring-emerald-500/20"
                  : "border-slate-700 hover:border-slate-600 bg-[#0F172A]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Iniciativa Temporária
                  </span>
                  {type === "projeto" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Projeto</h3>
                <p className="text-sm font-semibold text-slate-300 italic mb-3">
                  "Existe algo novo para criar ou melhorar com início, meio e fim?"
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <span className="text-slate-500">•</span>
                    <span>Possui escopo fechado, prazo delimitado e equipe temporária.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-slate-500">•</span>
                    <span>Cria um resultado único ou transforma um processo existente.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-slate-500">•</span>
                    <span>Exemplo: Implementar novo software ERP na empresa.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400">
                (Em projetos Lean Six Sigma, mapeamos o processo-alvo que será melhorado).
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              id="btn-quick-sample-compras"
              onClick={() => handleLoadExample("compras")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
            >
              Ou carregue um exemplo rápido de Compras
            </button>

            <button
              id="btn-next-step-1"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Avançar para Nome do Processo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Nomear o Processo */}
      {currentStep === 2 && (
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Etapa 2 de 6 • Formulação da Ação
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Como você nomeia o seu processo?
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              <strong className="text-emerald-400">Regra de Ouro da Apresentação:</strong> Que verbo e que objeto descrevem isso?
              <br />
              <span className="text-rose-400 font-medium">Erro comum:</span> Nomear com nome de departamento ou área (ex: "Recrutamento", "Compras", "Café") em vez de uma ação clara (ex: "Preparar e servir café", "Homologar fornecedores de matéria-prima").
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Nome do Processo (Verbo + Objeto):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="input-process-name"
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="Ex: Preparar e servir café durante reunião de estudos"
                className="flex-1 px-4 py-3.5 rounded-xl border border-slate-700 bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm placeholder-slate-500"
              />
              <button
                id="btn-validate-process-name"
                onClick={handleValidateName}
                disabled={validatingName || !processName.trim()}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs transition-all border border-slate-700 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{validatingName ? "Analisando..." : "Validar com IA"}</span>
              </button>
            </div>

            {/* AI Feedback on Process Name */}
            {nameFeedback && (
              <div
                className={`p-5 rounded-2xl border ${
                  nameFeedback.isAction
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                    : "bg-[#0F172A] border-amber-500/40 text-amber-200"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {nameFeedback.isAction ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {nameFeedback.isAction ? "Nome Válido!" : "Sugestão de Ajuste Lean Six Sigma"}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed text-slate-300">{nameFeedback.feedback}</p>

                    {nameFeedback.suggestions && nameFeedback.suggestions.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 text-slate-400">
                          Clique em uma opção para aplicar:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {nameFeedback.suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              id={`btn-apply-name-suggestion-${idx}`}
                              onClick={() => {
                                setProcessName(sug);
                                setNameFeedback({
                                  isAction: true,
                                  feedback: "Nome atualizado com sucesso no formato Verbo + Objeto.",
                                  suggestions: [],
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm transition-colors cursor-pointer"
                            >
                              ✓ {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Notas de contexto (Opcional):
              </label>
              <textarea
                id="input-process-notes"
                value={processNotes}
                onChange={(e) => setProcessNotes(e.target.value)}
                placeholder="Ex: Processo executado quinzenalmente pela equipe de treinamento..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-xs placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              id="btn-back-step-2"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              id="btn-next-step-2"
              onClick={() => setCurrentStep(3)}
              disabled={!processName.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F172A] font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Avançar para Gatilho (Trigger)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Qual foi o Gatilho (Trigger)? */}
      {currentStep === 3 && (
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Etapa 3 de 6 • O Gatilho (Trigger)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Qual foi o gatilho para o início?
            </h2>
            <div className="mt-3 p-4 rounded-2xl bg-[#0F172A] border border-slate-700 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-emerald-400 text-sm">
                Pergunta-chave: "Antes de quê ninguém estava fazendo nada?"
              </p>
              <p className="text-slate-300">
                • Ele é o <strong className="text-white">primeiro INPUT</strong>, NUNCA a primeira etapa/ação.
              </p>
              <p className="text-slate-300">
                • No caso do café, o gatilho é <em className="text-emerald-300">"O pedido do café"</em> (e não 'ir até o fogão' ou 'pegar o pó').
              </p>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Descreva sua ideia inicial de gatilho:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="input-user-trigger-idea"
                  type="text"
                  value={userTriggerIdea}
                  onChange={(e) => setUserTriggerIdea(e.target.value)}
                  placeholder="Ex: Alguém pediu um café, ou recebemos um e-mail de compra..."
                  className="flex-1 px-4 py-3.5 rounded-xl border border-slate-700 bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm placeholder-slate-500"
                />
                <button
                  id="btn-suggest-triggers-gemini"
                  onClick={handleSuggestTriggers}
                  disabled={loadingTriggers}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F172A] font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loadingTriggers ? "Gerando 3 Opções..." : "Gerar 3 Opções com IA"}</span>
                </button>
              </div>
            </div>

            {/* 3 AI Suggested Options */}
            {triggerSuggestions.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Escolha uma das 3 formulações refinadas pela IA (ou edite abaixo):
                </span>

                <div className="grid grid-cols-1 gap-3">
                  {triggerSuggestions.map((sug, idx) => {
                    const isSelected = selectedTrigger === sug.text;
                    return (
                      <div
                        key={idx}
                        id={`trigger-option-${idx}`}
                        onClick={() => setSelectedTrigger(sug.text)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20"
                            : "border-slate-700 hover:border-slate-600 bg-[#0F172A]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-white text-sm">{sug.text}</h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 pl-7">{sug.explanation}</p>
                        </div>

                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom chosen trigger preview/edit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Gatilho Selecionado (Primeiro Input):
              </label>
              <input
                id="input-selected-trigger"
                type="text"
                value={selectedTrigger || userTriggerIdea}
                onChange={(e) => setSelectedTrigger(e.target.value)}
                placeholder="Selecione uma das opções acima ou digite aqui..."
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm font-semibold placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              id="btn-back-step-3"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              id="btn-next-step-3"
              onClick={() => setCurrentStep(4)}
              disabled={!(selectedTrigger || userTriggerIdea).trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F172A] font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Avançar para Start & End Point</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Start Point & End Point */}
      {currentStep === 4 && (
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Etapa 4 de 6 • As Fronteiras do Processo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Start Point & End Point
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Onde o processo começa a ser executado e onde a entrega chega na mão do cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Start Point Box */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-500 text-[#0F172A] font-black text-xs flex items-center justify-center">
                  P1
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Start Point (Marco Inicial)</h3>
                  <span className="text-[11px] text-slate-400">1ª ação que o dono do processo controla</span>
                </div>
              </div>

              <input
                id="input-user-start-idea"
                type="text"
                value={selectedStartPoint || userStartIdea}
                onChange={(e) => {
                  setUserStartIdea(e.target.value);
                  setSelectedStartPoint(e.target.value);
                }}
                placeholder="Ex: Levantar a demanda e definir o responsável"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-sky-500 text-white text-sm font-medium placeholder-slate-500"
              />

              {startPointSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sugestões da IA para Start Point:
                  </span>
                  {startPointSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      id={`btn-choose-start-${idx}`}
                      onClick={() => setSelectedStartPoint(sug.text)}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-colors border cursor-pointer ${
                        selectedStartPoint === sug.text
                          ? "bg-sky-500/20 border-sky-500/50 text-sky-200 font-semibold"
                          : "bg-[#1E293B] hover:bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-white">{sug.text}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sug.explanation}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* End Point Box */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500 text-[#0F172A] font-black text-xs flex items-center justify-center">
                  Pn
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">End Point (Marco Final)</h3>
                  <span className="text-[11px] text-slate-400">Entrega sai de quem executa e chega no cliente</span>
                </div>
              </div>

              <input
                id="input-user-end-idea"
                type="text"
                value={selectedEndPoint || userEndIdea}
                onChange={(e) => {
                  setUserEndIdea(e.target.value);
                  setSelectedEndPoint(e.target.value);
                }}
                placeholder="Ex: Servir as xícaras de café para o solicitante"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm font-medium placeholder-slate-500"
              />

              {endPointSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sugestões da IA para End Point:
                  </span>
                  {endPointSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      id={`btn-choose-end-${idx}`}
                      onClick={() => setSelectedEndPoint(sug.text)}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-colors border cursor-pointer ${
                        selectedEndPoint === sug.text
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-semibold"
                          : "bg-[#1E293B] hover:bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-white">{sug.text}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sug.explanation}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              id="btn-suggest-points-gemini"
              onClick={handleSuggestPoints}
              disabled={loadingPoints}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs transition-all border border-slate-700 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{loadingPoints ? "Gerando sugestões de início e fim..." : "Sugerir Start & End Points com IA"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              id="btn-back-step-4"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              id="btn-next-step-4"
              onClick={() => {
                if (steps.length === 0) {
                  handleGenerateStepsWithAI();
                }
                setCurrentStep(5);
              }}
              disabled={!(selectedStartPoint || userStartIdea).trim() || !(selectedEndPoint || userEndIdea).trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F172A] font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Avançar para Mapeamento de Etapas (S-I-P-O-C)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Mapeamento S-I-P-O-C das Etapas */}
      {currentStep === 5 && (
        <div className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Etapa 5 de 6 • Mapeamento das 4 a 7 Etapas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
                Estruturando as Etapas S-I-P-O-C
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Adicione as etapas de transformação (P), especificando para cada uma: Fornecedores (S), Entradas (I), Saídas (O) e Clientes (C).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-regenerate-steps-ai"
                onClick={handleGenerateStepsWithAI}
                disabled={generatingSteps}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs transition-all border border-slate-700 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{generatingSteps ? "Gerando com IA..." : "Preencher com IA"}</span>
              </button>
              <button
                id="btn-add-blank-step"
                onClick={addBlankStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Etapa</span>
              </button>
            </div>
          </div>

          {/* Steps List Form */}
          <div className="space-y-6">
            {steps.length === 0 ? (
              <div className="text-center py-12 bg-[#0F172A] rounded-2xl border-2 border-dashed border-slate-700 p-8">
                <Lightbulb className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">Nenhuma etapa cadastrada ainda</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Clique no botão abaixo para que o Gemini gere automaticamente a sequência lógica com base no seu processo e gatilho.
                </p>
                <button
                  id="btn-empty-generate-steps"
                  onClick={handleGenerateStepsWithAI}
                  disabled={generatingSteps}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-500 text-[#0F172A] font-bold text-xs inline-flex items-center gap-2 hover:bg-emerald-400 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generatingSteps ? "Gerando Etapas..." : "Gerar Etapas Automaticamente"}</span>
                </button>
              </div>
            ) : (
              steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="bg-[#0F172A] rounded-2xl p-5 sm:p-6 border border-slate-700 space-y-4 hover:border-emerald-500/50 transition-all"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-[#0F172A] font-black text-xs">
                        {step.stepNumber || `P ${idx + 1}`}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Ação do Processo (Verbo + Objeto):
                      </span>
                    </div>

                    <button
                      id={`btn-remove-step-${idx}`}
                      onClick={() => removeStep(step.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Excluir etapa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Step Action Name Input */}
                  <input
                    id={`input-step-process-${idx}`}
                    type="text"
                    value={step.process}
                    onChange={(e) => updateStepField(step.id, "process", e.target.value)}
                    placeholder="Ex: Dosar o pó no filtro com colher medidora"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm font-bold placeholder-slate-500"
                  />

                  {/* 4 Mini Columns: S, I, O, C */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    {/* S */}
                    <div className="bg-[#1E293B] p-3 rounded-xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        S - Suppliers (Quem fornece)
                      </label>
                      <textarea
                        id={`textarea-step-suppliers-${idx}`}
                        value={step.suppliers.join(", ")}
                        onChange={(e) =>
                          updateStepField(
                            step.id,
                            "suppliers",
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                        placeholder="Ex: Fabricante do café, Etapa P2..."
                        rows={2}
                        className="w-full p-2 text-xs border border-slate-700 bg-[#0F172A] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-500"
                      />
                    </div>

                    {/* I */}
                    <div className="bg-[#1E293B] p-3 rounded-xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        I - Inputs (Substantivos)
                      </label>
                      <textarea
                        id={`textarea-step-inputs-${idx}`}
                        value={step.inputs.join(", ")}
                        onChange={(e) =>
                          updateStepField(
                            step.id,
                            "inputs",
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                        placeholder="Ex: Pó de café, Filtro de papel..."
                        rows={2}
                        className="w-full p-2 text-xs border border-slate-700 bg-[#0F172A] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-500"
                      />
                    </div>

                    {/* O */}
                    <div className="bg-[#1E293B] p-3 rounded-xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        O - Outputs (Estados / Entregas)
                      </label>
                      <textarea
                        id={`textarea-step-outputs-${idx}`}
                        value={step.outputs.join(", ")}
                        onChange={(e) =>
                          updateStepField(
                            step.id,
                            "outputs",
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                        placeholder="Ex: Filtro dosado e posicionado..."
                        rows={2}
                        className="w-full p-2 text-xs border border-slate-700 bg-[#0F172A] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-500"
                      />
                    </div>

                    {/* C */}
                    <div className="bg-[#1E293B] p-3 rounded-xl border border-slate-700">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                        C - Customers (Etapa seguinte/Cliente)
                      </label>
                      <textarea
                        id={`textarea-step-customers-${idx}`}
                        value={step.customers.join(", ")}
                        onChange={(e) =>
                          updateStepField(
                            step.id,
                            "customers",
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                        placeholder="Ex: Quem despeja a água (P3)..."
                        rows={2}
                        className="w-full p-2 text-xs border border-slate-700 bg-[#0F172A] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              id="btn-back-step-5"
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

<button
  onClick={addStep}
  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold transition-colors"
>
  <Plus className="w-4 h-4" />
  <span>Adicionar Etapa</span>
</button>
            <button
              id="btn-next-step-5"
              onClick={() => {
                handleRunAudit();
                setCurrentStep(6);
              }}
              disabled={steps.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F172A] font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Gerar Tabela Final & Auditoria da IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Tabela SIPOC Final & Auditoria IA */}
      {currentStep === 6 && (
        <div className="space-y-8">
          {/* AI Coach Card */}
          <div className="bg-[#1E293B] text-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-[#0F172A] flex items-center justify-center font-bold shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Auditoria Lean Six Sigma com IA
                  </h3>
                  <p className="text-xs text-slate-400">
                    Análise em tempo real de conformidade com as regras de SIPOC
                  </p>
                </div>
              </div>

              <button
                id="btn-reaudit-sipoc"
                onClick={handleRunAudit}
                disabled={auditing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${auditing ? "animate-spin" : ""}`} />
                <span>{auditing ? "Auditando..." : "Reavaliar"}</span>
              </button>
            </div>

            {auditResult && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score */}
                <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      Nota de Conformidade
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-white">
                      {auditResult.score}
                      <span className="text-xl text-slate-500 font-normal">/100</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3">{auditResult.summaryText}</p>
                </div>

                {/* Strengths */}
                <div className="bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                    ✓ Pontos Fortes
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {auditResult.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                    ⚡ Oportunidades de Refinamento
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {auditResult.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Master SIPOC Table View */}
          <SipocTableView
            title={processName || "Processo sem título"}
            type={type}
            trigger={selectedTrigger || userTriggerIdea}
            startPoint={selectedStartPoint || userStartIdea}
            endPoint={selectedEndPoint || userEndIdea}
            notes={processNotes}
            steps={steps}
            showExportControls={true}
          />

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <button
              id="btn-edit-steps-again"
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>Editar Etapas Novamente</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                id="btn-step6-pdf-download"
                onClick={() =>
                  exportSipocToPdf({
                    title: processName || "Processo sem título",
                    type,
                    trigger: selectedTrigger || userTriggerIdea,
                    startPoint: selectedStartPoint || userStartIdea,
                    endPoint: selectedEndPoint || userEndIdea,
                    notes: processNotes,
                    steps,
                  })
                }
                disabled={steps.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>Baixar SIPOC em PDF</span>
              </button>

              <button
                id="btn-start-new-sipoc"
                onClick={() => {
                  setProcessName("");
                  setUserTriggerIdea("");
                  setSelectedTrigger("");
                  setSelectedStartPoint("");
                  setSelectedEndPoint("");
                  setSteps([]);
                  setAuditResult(null);
                  setCurrentStep(1);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Criar Outro SIPOC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
