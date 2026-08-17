import { SipocProject, SipocStep } from "../types";

export const COFFEE_CASE_STEPS: SipocStep[] = [
  {
    id: "step-1",
    stepNumber: "P 1",
    process: "Levantar a demanda e definir o responsável",
    suppliers: ["Claudia, Sara e Nice (quem pede)"],
    inputs: [
      "Pedido de café",
      "Preferências de cada uma (quantidade, ponto, açúcar / sem açúcar)",
      "Disponibilidade das três para preparar",
    ],
    outputs: [
      "Demanda definida (3 xícaras, com as preferências)",
      "Responsável designado (Sara)",
    ],
    customers: ["Sara (responsável designado)"],
  },
  {
    id: "step-2",
    stepNumber: "P 2",
    process: "Reunir e conferir insumos e utensílios",
    suppliers: [
      "Despensa da casa / mercado",
      "Armário de utensílios",
    ],
    inputs: [
      "Pó de café, Água",
      "Filtro de papel, Garrafa térmica, Chaleira",
      "Colher medidora, Xícaras",
    ],
    outputs: [
      "Bancada montada",
      "Disponibilidade confirmada (pó suficiente para a demanda)",
    ],
    customers: ["Quem ferve a água"],
  },
  {
    id: "step-3",
    stepNumber: "P 3",
    process: "Ferver a água",
    suppliers: [
      "Rede de abastecimento de água",
      "Fogão / gás",
    ],
    inputs: [
      "Disponibilidade confirmada",
      "Água fria, Chaleira, Fogão aceso",
    ],
    outputs: [
      "Água aquecida no ponto (fervura interrompida)",
    ],
    customers: ["Quem despeja a água"],
  },
  {
    id: "step-4",
    stepNumber: "P 4",
    process: "Dosar o pó no filtro",
    suppliers: [
      "Fabricante do café",
    ],
    inputs: [
      "Pó de café, Filtro de papel",
      "Colher medidora, Garrafa com suporte do filtro",
    ],
    outputs: [
      "Filtro dosado e posicionado sobre a garrafa",
    ],
    customers: ["Quem despeja a água"],
  },
  {
    id: "step-5",
    stepNumber: "P 5",
    process: "Despejar a água sobre o pó",
    suppliers: [
      "Etapa 3 e etapa 4",
    ],
    inputs: [
      "Água aquecida no ponto",
      "Filtro dosado e posicionado",
    ],
    outputs: [
      "Pó saturado / extração iniciada",
    ],
    customers: ["A filtragem"],
  },
  {
    id: "step-6",
    stepNumber: "P 6",
    process: "Coar o café na garrafa",
    suppliers: [
      "Gravidade e tempo (sem operador)",
    ],
    inputs: [
      "Pó saturado em extração",
      "Garrafa térmica aberta",
    ],
    outputs: [
      "Café coado na garrafa",
      "Borra e filtro usado",
    ],
    customers: ["Quem serve"],
  },
  {
    id: "step-7",
    stepNumber: "P 7 (end point)",
    process: "Servir as xícaras",
    suppliers: [
      "Armário de louças",
    ],
    inputs: [
      "Café coado na garrafa",
      "3 xícaras limpas",
      "Açúcar / adoçante",
    ],
    outputs: [
      "3 xícaras de café servidas conforme a demanda definida",
    ],
    customers: ["Claudia, Sara e Nice"],
  },
];

export const COFFEE_CASE_PROJECT: SipocProject = {
  id: "case-coffee",
  title: "Preparar e servir café durante reunião de estudos",
  type: "processo",
  trigger: "O pedido do café (antes dele, ninguém estava fazendo nada)",
  startPoint: "Levantar a demanda e definir o responsável (P1)",
  endPoint: "Servir o café / Servir as xícaras (P7)",
  notes: "Caso de estudo com Nice, Claudia e Sara em reunião de estudos de Lean Six Sigma.",
  steps: COFFEE_CASE_STEPS,
  createdAt: "2026-08-15",
};
