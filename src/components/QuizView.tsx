import React, { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";

interface Question {
  id: number;
  question: string;
  explanation: string;
  options: {
    letter: string;
    text: string;
    isCorrect: boolean;
  }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "De acordo com o método SIPOC, como deve ser nomeado um processo?",
    explanation: "O processo deve sempre indicar uma ação clara com Verbo no Infinitivo + Objeto. Evite usar nomes de áreas ou substantivos como 'Recrutamento' ou 'Compras'.",
    options: [
      { letter: "A", text: "Com o nome do departamento responsável (ex: 'Recrutamento')", isCorrect: false },
      { letter: "B", text: "Com [Verbo no Infinitivo] + [Objeto] descrevendo a ação (ex: 'Preparar e servir café')", isCorrect: true },
      { letter: "C", text: "Com a sigla da ferramenta utilizada (ex: 'ERP SAP')", isCorrect: false },
      { letter: "D", text: "Com o nome do cliente final (ex: 'Diretoria Executiva')", isCorrect: false },
    ],
  },
  {
    id: 2,
    question: "O que é o Gatilho (Trigger) de um processo no Lean Six Sigma?",
    explanation: "O gatilho responde à pergunta: 'Antes de quê ninguém estava fazendo nada?'. Ele é sempre o primeiro INPUT recebido e NUNCA a primeira etapa executada.",
    options: [
      { letter: "A", text: "A primeira ação que o operador executa (ex: ligar o fogão)", isCorrect: false },
      { letter: "B", text: "O primeiro INPUT que interrompe a inércia (ex: 'O pedido do café')", isCorrect: true },
      { letter: "C", text: "O relatório final entregue à diretoria", isCorrect: false },
      { letter: "D", text: "O nome do software onde os dados são inseridos", isCorrect: false },
    ],
  },
  {
    id: 3,
    question: "Qual é a definição exata de Start Point (Marco Inicial)?",
    explanation: "Start Point é a primeira ação que acontece em resposta ao gatilho e que está sob o controle direto do dono do processo.",
    options: [
      { letter: "A", text: "A primeira ação que o dono do processo controla diretamente", isCorrect: true },
      { letter: "B", text: "A data em que a empresa foi fundada", isCorrect: false },
      { letter: "C", text: "O primeiro insumo comprado do mercado fornecedor", isCorrect: false },
      { letter: "D", text: "A aprovação do orçamento anual pelo CFO", isCorrect: false },
    ],
  },
  {
    id: 4,
    question: "Como devem ser formulados os Inputs (Entradas) na tabela SIPOC?",
    explanation: "Inputs são sempre SUBSTANTIVOS: materiais, documentos, informações ou pessoas em determinado estado. Nunca use verbos na coluna de Inputs.",
    options: [
      { letter: "A", text: "Sempre com verbos de ação no imperativo (ex: 'compre água')", isCorrect: false },
      { letter: "B", text: "Exclusivamente valores monetários em reais", isCorrect: false },
      { letter: "C", text: "Sempre SUBSTANTIVOS: material, documento, informação ou estado", isCorrect: true },
      { letter: "D", text: "Com o cargo do funcionário que executa a tarefa", isCorrect: false },
    ],
  },
  {
    id: 5,
    question: "Dentro do fluxo do SIPOC, quem é o Cliente (Customer) de cada etapa intermediária?",
    explanation: "Dentro do processo, o cliente de cada etapa interna é a etapa seguinte (P n+1), até que a última etapa entregue o valor ao cliente final.",
    options: [
      { letter: "A", text: "Sempre e exclusivamente o consumidor final externo da empresa", isCorrect: false },
      { letter: "B", text: "A etapa seguinte (cliente interno do fluxo)", isCorrect: true },
      { letter: "C", text: "O fornecedor da matéria-prima", isCorrect: false },
      { letter: "D", text: "O fiscal da auditoria de qualidade", isCorrect: false },
    ],
  },
];

export const QuizView: React.FC<{ onGoToBuilder: () => void }> = ({ onGoToBuilder }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, letter: string) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: letter }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selected === correctOption?.letter) {
        correct++;
      }
    });
    return correct;
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  const score = calculateScore();
  const allAnswered = Object.keys(userAnswers).length === QUIZ_QUESTIONS.length;

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#1E293B] p-6 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Quiz de Fixação: Domínio do SIPOC
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
          Teste seus conhecimentos práticos sobre as regras de ouro do Lean Six Sigma apresentadas no estudo de caso.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, qIdx) => {
          const selectedLetter = userAnswers[q.id];
          const isAnswered = Boolean(selectedLetter);

          return (
            <div
              key={q.id}
              className="bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500 text-[#0F172A] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  {qIdx + 1}
                </span>
                <h3 className="font-bold text-white text-base sm:text-lg leading-snug">
                  {q.question}
                </h3>
              </div>

              <div className="space-y-2.5 pt-2">
                {q.options.map((opt) => {
                  const isSelected = selectedLetter === opt.letter;
                  let optStyle = "bg-[#0F172A] hover:bg-slate-800/80 border-slate-700 text-slate-200";

                  if (showResults) {
                    if (opt.isCorrect) {
                      optStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-400";
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = "bg-rose-950/50 border-rose-500 text-rose-200 font-semibold";
                    } else {
                      optStyle = "opacity-40 bg-[#0F172A] border-slate-800 text-slate-500";
                    }
                  } else if (isSelected) {
                    optStyle = "bg-emerald-500 text-[#0F172A] border-emerald-400 font-bold shadow-md";
                  }

                  return (
                    <button
                      key={opt.letter}
                      id={`quiz-q${q.id}-opt-${opt.letter}`}
                      onClick={() => handleSelectOption(q.id, opt.letter)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isSelected && !showResults ? "bg-[#0F172A] text-emerald-400" : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}>
                        {opt.letter}
                      </span>
                      <span className="text-xs sm:text-sm mt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className="mt-4 p-4 rounded-2xl bg-[#0F172A] border border-slate-700 text-xs text-slate-300">
                  <span className="font-bold text-emerald-400 block mb-1">Explicação Técnica:</span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit / Results Bar */}
      <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {!showResults ? (
          <>
            <span className="text-xs text-slate-400 font-medium">
              {Object.keys(userAnswers).length} de {QUIZ_QUESTIONS.length} respondidas
            </span>
            <button
              id="btn-submit-quiz"
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0F172A] font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              Verificar Respostas
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-[#0F172A] flex items-center justify-center font-black shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  Resultado: {score} de {QUIZ_QUESTIONS.length} acertos!
                </h4>
                <p className="text-xs text-slate-400">
                  {score === 5
                    ? "Parabéns! Você dominou os fundamentos do SIPOC com excelência."
                    : "Bom esforço! Revise os pontos na aba Conceitos ou pratique no Construtor."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-quiz-retry"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer</span>
              </button>
              <button
                id="btn-quiz-go-builder"
                onClick={onGoToBuilder}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Praticar no Construtor
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
