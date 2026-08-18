import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());app.use((req, res, next) => {
  const allowedOrigin = process.env.APP_URL || 'https://etheraclub.com';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});


  // API Routes
  app.get("/api/health", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({ status: "ok", geminiConfigured: hasKey });
  });

  // 1. Process Name Validator & Suggester
  app.post("/api/gemini/validate-name", async (req, res) => {
    try {
      const { rawName } = req.body;
      if (!rawName || typeof rawName !== "string") {
        return res.status(400).json({ error: "Nome do processo é obrigatório." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback rule-based
        const isAreaName = !rawName.trim().includes(" ") || /^(RH|TI|Financeiro|Vendas|Compras|Recrutamento|Logística|Qualidade)$/i.test(rawName.trim());
        return res.json({
          isAction: !isAreaName,
          feedback: isAreaName 
            ? "Atenção: Na metodologia Lean Six Sigma/SIPOC, o processo deve ser nomeado com [Verbo no Infinitivo] + [Objeto], evitando nomes de áreas ou substantivos isolados."
            : "Excelente! O nome descreve uma ação com clareza.",
          suggestions: isAreaName ? [
            `Executar ${rawName.toLowerCase()}`,
            `Gerenciar e padronizar ${rawName.toLowerCase()}`,
            `Planejar e realizar ${rawName.toLowerCase()}`
          ] : [rawName]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Analise o seguinte nome proposto para um processo em um SIPOC (Lean Six Sigma): "${rawName}".
Regra fundamental de SIPOC: Deve ser formulado como AÇÃO com VERBO no infinitivo + OBJETO (ex: "Preparar e servir café durante reunião de estudos"). 
ERRO COMUM: Nomear com nome de departamento ou área (ex: "Recrutamento", "Compras", "Café").

Responda em formato JSON com o seguinte schema:
- isAction: booleano (true se segue Verbo + Objeto, false se parece nome de área ou substantivo vago)
- feedback: explicação curta e amigável em português simples (máx 2 frases)
- suggestions: lista com 3 sugestões ideais de nomes de processo usando Verbo + Objeto para o que o usuário provavelmente quis dizer.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isAction: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["isAction", "feedback", "suggestions"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in validate-name:", err);
      res.status(500).json({ error: "Falha ao validar nome com IA. Tente novamente." });
    }
  });

  // 2. Trigger Suggester
  app.post("/api/gemini/suggest-triggers", async (req, res) => {
    try {
      const { processName, userIdea } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          triggers: [
            {
              text: userIdea ? `Recebimento da solicitação: "${userIdea}"` : "Chegada de pedido oficial do solicitante",
              explanation: "Gatilho clássico: o evento externo que interrompe a inércia."
            },
            {
              text: "Identificação de necessidade ou agendamento prévio",
              explanation: "Disparo baseado em cronograma ou evento programado."
            },
            {
              text: "Constatação de falta ou acionamento por limite de estoque/capacidade",
              explanation: "Gatilho de reposição ou contingência operacional."
            }
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Você é um especialista em Lean Six Sigma e mapeamento de processos (SIPOC).
O usuário forneceu a seguinte ideia inicial para o GATILHO (Trigger/Primeiro Input) do processo: "${userIdea}".
${processName ? `Nome do processo: "${processName}".` : ''}

Sua tarefa é gerar 3 opções de formulação do Gatilho:
1. Uma versão direta e natural baseada na ideia do usuário.
2. Uma versão formalizada de evento físico/sensorial ou sinalizador claro (ex: "Sinal do alarme do celular acionado", "Percepção de necessidade fisiológica").
3. Uma versão focada no evento externo que inicia a ação imediata.

REGRAS RÍGIDAS:
- Mantenha total coerência com o tema informado pelo usuário ("${userIdea}").
- NÃO invente termos corporativos fora de contexto como "estoque mínimo", "cronograma" ou "suprimentos" a menos que o tema seja explicitamente sobre compras/suprimentos.

Responda exclusivamente no formato JSON esperado.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              triggers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Frase do gatilho (curta e substantiva)" },
                    explanation: { type: Type.STRING, description: "Por que este é um gatilho válido no Lean Six Sigma" },
                  },
                  required: ["text", "explanation"],
                },
              },
            },
            required: ["triggers"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in suggest-triggers:", err);
      res.status(500).json({ error: "Falha ao gerar sugestões de gatilho." });
    }
  });

  // 3. Start Point & End Point Suggester
  app.post("/api/gemini/suggest-points", async (req, res) => {
    try {
      const { processName, trigger, userStartIdea, userEndIdea } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          startPoints: [
            {
              text: userStartIdea || "Levantar a demanda e definir o responsável",
              explanation: "Primeira ação que o dono do processo controla diretamente em resposta ao gatilho."
            },
            {
              text: "Recepcionar e registrar a solicitação inicial",
              explanation: "Formaliza o início da execução com verbo de ação."
            },
            {
              text: "Conferir pré-requisitos e autorizar início",
              explanation: "Validação inicial dos insumos antes de executar."
            }
          ],
          endPoints: [
            {
              text: userEndIdea || "Entregar o resultado final ao cliente e registrar conclusão",
              explanation: "Onde a entrega sai da mão de quem executa e chega na mão de quem recebe."
            },
            {
              text: "Disponibilizar o produto/serviço para uso do destinatário",
              explanation: "Transferência clara de posse/responsabilidade."
            },
            {
              text: "Coletar confirmação de recebimento do solicitante",
              explanation: "Garante o encerramento do ciclo com feedback do cliente."
            }
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Você é um instrutor especialista em Lean Six Sigma e SIPOC.
Processo: "${processName}"
Gatilho (Trigger): "${trigger}"
Ideia do usuário para Start Point: "${userStartIdea || "Livre"}"
Ideia do usuário para End Point: "${userEndIdea || "Livre"}"

Regras cruciais:
1. START POINT:
- Pergunta: "Qual é a primeira ação que acontece em resposta ao gatilho?"
- É a PRIMEIRA AÇÃO que o dono do processo controla.
- Sempre expressa em [Verbo de Ação] + [Objeto].
- Exemplo do café: "Levantar a demanda e definir o responsável".

2. END POINT:
- Pergunta: "Qual é a última coisa que sai do processo para alguém de fora?"
- O processo termina onde a entrega sai da mão de quem executa e chega na mão de quem recebe.
- Sempre expressa em [Verbo de Ação] + [Objeto].
- Exemplo do café: "Servir o café" / "Servir as xícaras".

Gere 3 opções de Start Point e 3 opções de End Point para este processo.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              startPoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["text", "explanation"],
                },
              },
              endPoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["text", "explanation"],
                },
              },
            },
            required: ["startPoints", "endPoints"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in suggest-points:", err);
      res.status(500).json({ error: "Falha ao sugerir marcos de início e fim." });
    }
  });

  // 4. Generate Full SIPOC Flow (Steps P1..Pn with S, I, P, O, C)
  app.post("/api/gemini/suggest-steps", async (req, res) => {
    try {
      const { processName, trigger, startPoint, endPoint, contextNotes } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          steps: [
            {
              stepNumber: "P1",
              process: startPoint || "Levantar a demanda e definir o responsável",
              inputs: ["Solicitação inicial", "Requisitos especificados", "Disponibilidade da equipe"],
              outputs: ["Demanda mapeada", "Responsável designado"],
              suppliers: ["Solicitante / Cliente", "Gestão interna"],
              customers: ["Responsável designado (Etapa seguinte P2)"],
            },
            {
              stepNumber: "P2",
              process: "Reunir e conferir recursos e insumos",
              inputs: ["Insumos necessários", "Equipamentos / ferramentas"],
              outputs: ["Recursos validados e preparados"],
              suppliers: ["Estoque / Fornecedores"],
              customers: ["Operador da execução (P3)"],
            },
            {
              stepNumber: "P3",
              process: "Executar a transformação principal",
              inputs: ["Recursos preparados", "Instruções de trabalho"],
              outputs: ["Produto/Serviço intermediário processado"],
              suppliers: ["Etapa P2"],
              customers: ["Etapa P4 (Finalização)"],
            },
            {
              stepNumber: "P4",
              process: endPoint || "Servir / Entregar resultado final ao cliente",
              inputs: ["Produto/Serviço finalizado", "Canal de entrega"],
              outputs: ["Entrega concluída conforme demanda"],
              suppliers: ["Etapa anterior (P3)"],
              customers: ["Cliente final"],
            },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Você é um Master Black Belt em Lean Six Sigma.
Crie um mapeamento SIPOC completo, pedagógico e de alto rigor técnico para o processo:
- Nome do Processo: "${processName}"
- Gatilho (Trigger): "${trigger}"
- Start Point (P1): "${startPoint}"
- End Point (Último P): "${endPoint}"
- Contexto adicional: "${contextNotes || "Padrão de excelência operacional"}"

REGRAS RÍGIDAS DE SIPOC:
1. P (Process): Deve conter entre 4 a 7 etapas no total, sequenciais (P1 até Pn), começando com o Start Point e terminando com o End Point. Cada etapa deve ser [Verbo de Ação no Infinitivo] + [Objeto].
2. I (Inputs): SUBSTANTIVOS sempre! Ex: material, documento, informação, pessoa em determinado estado. Nunca colocar verbos no input.
3. O (Outputs): Estado ou informação ou produto que existe depois da ação que NÃO existia antes (ex: "Demanda definida", "Água aquecida no ponto", "Café coado").
4. S (Suppliers): Quem entrega o input correspondente (Pessoa, área, empresa externa ou a etapa anterior).
5. C (Customers): Quem recebe cada output (Dentro do processo, o cliente de cada etapa interna é a etapa seguinte; na última etapa é o cliente final/solicitante).

Gere o array estruturado de passos 'steps'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.STRING, description: "ex: P1, P2, P3..." },
                    process: { type: Type.STRING, description: "Ação (Verbo + Objeto)" },
                    inputs: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Substantivos (materiais, informações, documentos)",
                    },
                    outputs: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Estados ou entregas geradas",
                    },
                    suppliers: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Fornecedores de cada input (pessoas, etapas anteriores ou externos)",
                    },
                    customers: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Destinatários de cada output (próxima etapa ou cliente final)",
                    },
                  },
                  required: ["stepNumber", "process", "inputs", "outputs", "suppliers", "customers"],
                },
              },
            },
            required: ["steps"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in suggest-steps:", err);
      res.status(500).json({ error: "Falha ao gerar etapas do SIPOC." });
    }
  });

  // 5. Intelligent Assistant for Step Audit / Coaching
  app.post("/api/gemini/coach-feedback", async (req, res) => {
    try {
      const { currentSipoc } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          score: 90,
          strengths: ["Estrutura lógica bem encadeada", "Verbos no infinitivo bem empregados"],
          improvements: ["Garanta que todos os inputs sejam rigorosamente substantivos sem verbos embutidos."],
          summaryText: "Seu SIPOC está muito bem estruturado e segue os fundamentos do Lean Six Sigma!"
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Você é um instrutor e auditor Lean Six Sigma especialista em SIPOC.
Avalie o seguinte mapeamento SIPOC criado pelo aluno:
${JSON.stringify(currentSipoc, null, 2)}

Critérios de auditoria:
1. Processo vs Projeto: está claro que é uma rotina repetível observável?
2. Nomeação: Verbo + Objeto em todas as etapas de Processo?
3. Gatilho (Trigger): É o primeiro input e não a primeira ação?
4. Start Point e End Point: Início na primeira ação controlada e Fim na entrega de valor ao cliente?
5. Inputs: São estritamente substantivos (material, informação, documento)?
6. Outputs: Representam estados alcançados ou entregas geradas?
7. Encadeamento Suppliers -> Inputs -> Process -> Outputs -> Customers (etapa N abastece etapa N+1).

Retorne um JSON com score de 0 a 100, pontos fortes (strengths), sugestões de melhoria pontuais (improvements) e uma mensagem motivadora (summaryText).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              summaryText: { type: Type.STRING },
            },
            required: ["score", "strengths", "improvements", "summaryText"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in coach-feedback:", err);
      res.status(500).json({ error: "Falha na auditoria do SIPOC." });
    }
  });

  // Vite Middleware / Static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
