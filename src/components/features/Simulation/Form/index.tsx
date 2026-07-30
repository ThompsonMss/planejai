import { useState } from 'react';

import { simulationFormSteps } from '@/data/simulation';

import { FormStep } from '../FormStep';
import { FormProgress } from '../Progress';

export const SimulationForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = simulationFormSteps.length;
  const currentStep = simulationFormSteps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex + 1 > totalSteps - 1) {
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return;
    }

    setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <>
      <FormProgress currentStep={currentStepIndex + 1} totalSteps={totalSteps} />
      <FormStep
        {...currentStep}
        key={currentStep.id}
        hideBackButton={currentStepIndex === 0}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
      />
    </>
  );
};
