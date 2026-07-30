import { type ChatMessage, type SimulationRecord } from '@/data/simulation';
import type { InsightData } from '@/services/aiService';
import { parseCurrency } from '@/utils/currency';
import { calcMonthlySavings } from '@/utils/simulation';

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o que isso representa para a saúde financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`;

export function buildAIPrompt(simulation: SimulationRecord) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } = simulation;

  const monthlySavings = calcMonthlySavings(simulation);
  const monthlySavingsNeeded = parseCurrency(goalAmount) / parseInt(goalDeadline);

  return `Você é um educador financeiro especializado em finanças pessoais. Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara, didática e encorajadora, voltado para pessoas sem conhecimento financeiro. O diagnóstico será exibido diretamente ao usuário no app, fale sempre em segunda pessoa ("você tem...", "sua meta...").

Dados da simulação:
- Renda mensal bruta: ${income}
- Custos fixos essenciais: ${expenses}
- Dívidas e parcelas mensais: ${debts}
- Valor disponível por mês: ${monthlySavings} reais
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo desejado: ${goalDeadline} meses
- Economia mensal necessária para atingir a meta no prazo: ${monthlySavingsNeeded} reais
- Saldo após reserva para a meta: ${monthlySavings - monthlySavingsNeeded} reais

Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

${RESPONSE_SCHEMA}

Regras:
- Todos os textos em português do Brasil
- Máximo de 4 itens por lista
- Seja específico ao citar valores calculados
- Não repita informações entre seções
- Nunca use markdown dentro dos valores do JSON
- Para o campo "feasibility.status", use os seguintes critérios:
  - "viable": saldo após reserva para a meta é maior ou igual a 0
  - "needs_adjustment": saldo negativo de até 20% do valor da economia mensal necessária
  - "unfeasible": saldo negativo superior a 20% do valor da economia mensal necessária`;
}

function formatInsight(insight: InsightData) {
  return [
    `Viabilidade: ${insight.feasibility.content}`,
    `Diagnóstico: ${insight.diagnosis.content}`,
    `Sugestões: ${insight.suggestions.items.join('; ')}`,
    `Renda extra: ${insight.extraIncome.items.join('; ')}`,
    `Investimentos: ${insight.investment.items.join('; ')}`,
  ].join('\n');
}

interface ChatPromptParams {
  simulation: SimulationRecord;
  insight: InsightData;
  history: ChatMessage[];
  question: string;
}

export function buildChatPrompt({ simulation, insight, history, question }: ChatPromptParams) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } = simulation;
  const monthlySavings = calcMonthlySavings(simulation);

  const conversation = history
    .map((message) => `${message.role === 'user' ? 'Usuário' : 'Educador'}: ${message.content}`)
    .join('\n');

  return `Você é um educador financeiro conversando com o usuário sobre a simulação financeira dele. Responda à pergunta de forma clara, didática e encorajadora, sempre em português do Brasil e em segunda pessoa ("você pode...", "sua meta..."). Baseie-se nos dados da simulação e no diagnóstico já gerado. Se a pergunta fugir do tema de finanças pessoais e da meta do usuário, redirecione gentilmente para o objetivo financeiro.

Dados da simulação:
- Renda mensal bruta: ${income}
- Custos fixos essenciais: ${expenses}
- Dívidas e parcelas mensais: ${debts}
- Valor disponível por mês: ${monthlySavings} reais
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo desejado: ${goalDeadline} meses

Diagnóstico já apresentado ao usuário:
${formatInsight(insight)}
${conversation ? `\nHistórico da conversa até aqui:\n${conversation}\n` : ''}
Nova pergunta do usuário:
${question}

Regras da resposta:
- Responda em texto corrido, direto ao ponto, com no máximo 2 parágrafos curtos
- NÃO use markdown, títulos, listas ou blocos de código
- Retorne apenas o texto da resposta, sem prefixos como "Educador:" ou "Resposta:"`;
}
