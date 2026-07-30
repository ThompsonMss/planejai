import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HistoryCard } from '@/components/features/SimulationHistory/HistoryCard';
import { PageHero } from '@/components/shared/PageHero';
import type { SimulationRecord } from '@/data/simulation';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';

export function SimulationHistoryPage() {
  const navigate = useNavigate();
  const { getAllFormData, deleteFormData } = useSimulationStorage();
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() => getAllFormData());

  const handleDelete = (id: string) => {
    deleteFormData(id);
    setSimulations((prev) => prev.filter((simulation) => simulation.id !== id));
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <p className="text-sm text-muted-foreground">
            Você ainda não tem simulações salvas. Faça uma nova simulação para começar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {simulations.map((simulation) => (
            <HistoryCard
              key={simulation.id}
              simulation={simulation}
              onDelete={() => handleDelete(simulation.id)}
              onViewDetails={() => void navigate(`/resultado/${simulation.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
