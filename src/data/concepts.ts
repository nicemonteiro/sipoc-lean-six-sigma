export interface SipocConcept {
  id: string;
  letter: string;
  name: string;
  subtitle: string;
  question: string;
  formatRule: string;
  ruleExplanation: string;
  coffeeExample: {
    title: string;
    details: string[];
  };
  commonMistakes: string[];
}

export const SIPOC_CONCEPTS: SipocConcept[] = [
  {
    id: "s",
    letter: "S",
    name: "Suppliers (Fornecedores)",
    subtitle: "A origem de cada entrada do processo",
    question: "Quem entrega o input?",
    formatRule: "Pessoa, área, empresa externa ou a etapa anterior do próprio processo.",
    ruleExplanation: "Cada insumo ou informação necessária deve ter uma fonte clara de fornecimento. No nível interno, a etapa P(n-1) frequentemente atua como fornecedora da etapa P(n).",
    coffeeExample: {
      title: "No caso do Café:",
      details: [
        "Claudia, Sara e Nice (quem pede a rodada)",
        "Despensa da casa / mercado",
        "Rede de água e Fogão / gás",
        "Fabricante do café",
        "Etapa 3 e etapa 4 (água quente e pó dosado)",
        "Gravidade e tempo (sem operador)",
      ],
    },
    commonMistakes: [
      "Esquecer que a etapa anterior pode ser o fornecedor direto da etapa atual.",
      "Listar o cliente final como fornecedor quando ele apenas consome o produto final.",
    ],
  },
  {
    id: "i",
    letter: "I",
    name: "Inputs (Entradas / Insumos)",
    subtitle: "O que é transformado ou utilizado",
    question: "O que precisa chegar aqui para essa ação acontecer?",
    formatRule: "Substantivo, SEMPRE. Material, documento, informação, ou pessoa em determinado estado.",
    ruleExplanation: "Inputs NUNCA devem ser verbos ou ações. São os recursos palpáveis, dados, especificações ou itens brutos necessários para disparar ou alimentar a etapa.",
    coffeeExample: {
      title: "No caso do Café:",
      details: [
        "Pedido de café",
        "Preferências de cada uma (quantidade, ponto, açúcar)",
        "Pó de café, Água fria, Filtro de papel",
        "Garrafa térmica, Chaleira, Colher medidora",
        "Água aquecida no ponto",
      ],
    },
    commonMistakes: [
      "Usar verbos como 'comprar café' ou 'ligar o fogo' dentro da coluna de Inputs.",
      "Esquecer informações intangíveis (ex: parâmetros, preferências, autorizações).",
    ],
  },
  {
    id: "p",
    letter: "P",
    name: "Process (Processo)",
    subtitle: "A sequência lógica de transformação",
    question: "Quais são as 4 a 7 macroetapas que transformam as entradas em saídas?",
    formatRule: "Verbo no Infinitivo + Objeto (ex: 'Ferver a água', 'Dosar o pó').",
    ruleExplanation: "O SIPOC captura uma visão de alto nível (macroprocesso). Deve iniciar no Start Point (primeira ação controlada) e terminar no End Point (entrega do valor ao cliente).",
    coffeeExample: {
      title: "No caso do Café (P1 a P7):",
      details: [
        "P1: Levantar a demanda e definir o responsável (Start Point)",
        "P2: Reunir e conferir insumos e utensílios",
        "P3: Ferver a água",
        "P4: Dosar o pó no filtro",
        "P5: Despejar a água sobre o pó",
        "P6: Coar o café na garrafa",
        "P7: Servir as xícaras (End Point)",
      ],
    },
    commonMistakes: [
      "Detalhar micro-passos em excesso (ex: 'abrir o armário', 'esticar o braço').",
      "Nomear etapas com substantivos de departamentos em vez de ações.",
    ],
  },
  {
    id: "o",
    letter: "O",
    name: "Outputs (Saídas / Resultados)",
    subtitle: "O que é gerado após a execução",
    question: "O que existe depois desta ação que não existia antes?",
    formatRule: "Estado, produto, informação ou documento gerado.",
    ruleExplanation: "Output pode ser um estado ou uma informação, não apenas um objeto físico (ex: 'Bancada montada', 'Água aquecida no ponto', 'Demanda definida').",
    coffeeExample: {
      title: "No caso do Café:",
      details: [
        "Demanda definida (3 xícaras com preferências)",
        "Responsável designado (Sara)",
        "Bancada montada e disponibilidade confirmada",
        "Água aquecida no ponto (fervura interrompida)",
        "Filtro dosado e posicionado",
        "3 xícaras de café servidas conforme a demanda",
      ],
    },
    commonMistakes: [
      "Repetir o nome da ação em vez do estado/resultado entregue.",
      "Esquecer subprodutos (ex: 'Borra e filtro usado' no descarte).",
    ],
  },
  {
    id: "c",
    letter: "C",
    name: "Customers (Clientes)",
    subtitle: "Quem recebe e se beneficia de cada saída",
    question: "Quem recebe cada output?",
    formatRule: "Pessoa, área, etapa seguinte ou cliente final externo.",
    ruleExplanation: "Dentro do processo, o cliente de cada etapa intermediária é a etapa seguinte (cliente interno). Na etapa final (End Point), o cliente é quem solicitou ou consome a entrega final.",
    coffeeExample: {
      title: "No caso do Café:",
      details: [
        "Sara (responsável designada na etapa P1)",
        "Quem ferve a água (cliente do P2)",
        "Quem despeja a água (cliente do P3 e P4)",
        "A filtragem (cliente do P5)",
        "Quem serve (cliente do P6)",
        "Claudia, Sara e Nice (clientes finais do café servido)",
      ],
    },
    commonMistakes: [
      "Achar que cliente só existe no final do processo, ignorando os clientes internos de cada etapa.",
    ],
  },
];

export const FOUNDATIONAL_STEPS_GUIDE = [
  {
    step: 1,
    title: "Processo vs. Projeto",
    question: "É Processo ou é Projeto?",
    rule: "Projeto: existe algo para melhorar/mudar com início, meio e fim? Processo: é algo recorrente que existe e vou observar/padronizar?",
    tag: "Decisão Fundamental",
  },
  {
    step: 2,
    title: "Nomear o Processo",
    question: "Que verbo e que objeto descrevem isso?",
    rule: "Sempre formule com Ação (Verbo + Objeto). Erro comum: usar nome de área (ex: 'Recrutamento' ou 'Compras') em vez da ação ('Preparar e servir café', 'Contratar novo colaborador').",
    tag: "Ação Clara",
  },
  {
    step: 3,
    title: "Achar o Gatilho (Trigger)",
    question: "Antes de quê ninguém estava fazendo nada?",
    rule: "O gatilho é o primeiro INPUT, NUNCA a primeira etapa ou ação executada.",
    tag: "Disparo da Rotina",
  },
  {
    step: 4,
    title: "Start Point (Marco Inicial)",
    question: "Qual é a primeira ação que acontece em resposta ao gatilho?",
    rule: "É a primeira ação que o dono do processo controla diretamente.",
    tag: "Fronteira Inicial",
  },
  {
    step: 5,
    title: "End Point (Marco Final)",
    question: "Qual é a última coisa que sai do processo para alguém de fora?",
    rule: "O processo termina onde a entrega sai da mão de quem executa e chega na mão de quem recebe.",
    tag: "Fronteira Final",
  },
];
