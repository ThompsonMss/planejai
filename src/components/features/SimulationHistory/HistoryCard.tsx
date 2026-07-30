import { Goal, SquareArrowOutUpRight, Trash2 } from 'lucide-react';

import type { SimulationRecord } from '@/data/simulation';
import { formatCurrencyBRL } from '@/utils/currency';
import { calcMonthlySavings } from '@/utils/simulation';

interface HistoryCardProps {
  simulation: SimulationRecord;
  onDelete: () => void;
  onViewDetails: () => void;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function HistoryCard({ simulation, onDelete, onViewDetails }: HistoryCardProps) {
  const { goalName, goalAmount, goalDeadline, createdAt } = simulation;
  const monthlySavings = calcMonthlySavings(simulation);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-3 sm:w-52 sm:flex-shrink-0">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Goal size={20} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{goalName}</p>
          {createdAt && (
            <p className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Stat label="Custo da meta" value={`R$ ${goalAmount}`} />
        <Stat label="Prazo" value={`${goalDeadline} meses`} />
        <Stat label="Economia mensal" value={`R$ ${formatCurrencyBRL(monthlySavings)}`} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="h-px w-full bg-border sm:h-8 sm:w-px" />
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <button
            type="button"
            aria-label="Excluir simulação"
            onClick={onDelete}
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-red-500 transition-opacity hover:opacity-80"
          >
            <Trash2 size={18} />
          </button>
          <button
            type="button"
            onClick={onViewDetails}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary-button px-3 py-2 text-xs font-medium text-foreground transition-opacity hover:opacity-80"
          >
            <SquareArrowOutUpRight size={14} />
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
