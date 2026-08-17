export interface SipocStep {
  id: string;
  stepNumber: string; // e.g. "P1", "P2"
  process: string; // Action (Verbo + Objeto)
  inputs: string[]; // Substantivos
  outputs: string[]; // Estados ou entregas geradas
  suppliers: string[]; // Fornecedores
  customers: string[]; // Clientes da etapa
}

export interface SipocProject {
  id: string;
  title: string;
  type: "processo" | "projeto";
  trigger: string;
  startPoint: string;
  endPoint: string;
  notes?: string;
  steps: SipocStep[];
  createdAt: string;
}

export interface TriggerSuggestion {
  text: string;
  explanation: string;
}

export interface PointSuggestion {
  text: string;
  explanation: string;
}

export interface NameValidationResult {
  isAction: boolean;
  feedback: string;
  suggestions: string[];
}

export interface CoachAuditResult {
  score: number;
  strengths: string[];
  improvements: string[];
  summaryText: string;
}
