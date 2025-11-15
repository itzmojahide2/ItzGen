
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { Generation, Usage, GeneratorType, Plan } from '../types';
import { PLANS } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface PlanContextType {
  usage: Usage;
  generations: Generation[];
  currentPlan: Plan | null;
  canGenerate: (type: GeneratorType) => boolean;
  addGeneration: (generation: Omit<Generation, 'id' | 'timestamp'>) => void;
  resetUsage: () => void;
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

const initialUsage: Usage = { image: 0, thumbnail: 0, switch: 0 };

export const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Usage>(initialUsage);
  const [generations, setGenerations] = useState<Generation[]>([]);

  const currentPlan = user ? PLANS[user.plan] : null;

  const canGenerate = useCallback((type: GeneratorType) => {
    if (!currentPlan) return false;
    const limit = currentPlan.limits[type];
    if (limit === 'unlimited') return true;
    return usage[type] < limit;
  }, [currentPlan, usage]);

  const addGeneration = useCallback((generation: Omit<Generation, 'id' | 'timestamp'>) => {
    const generatorType = generation.type.toLowerCase() as GeneratorType;
    if (!canGenerate(generatorType)) {
      console.error('Usage limit reached for this generation type.');
      return;
    }

    setGenerations(prev => [
      { ...generation, id: crypto.randomUUID(), timestamp: new Date() },
      ...prev
    ]);

    setUsage(prev => ({
      ...prev,
      [generatorType]: prev[generatorType] + 1
    }));
  }, [canGenerate]);
  
  const resetUsage = useCallback(() => {
    setUsage(initialUsage);
  }, []);


  return (
    <PlanContext.Provider value={{ usage, generations, currentPlan, canGenerate, addGeneration, resetUsage }}>
      {children}
    </PlanContext.Provider>
  );
};
