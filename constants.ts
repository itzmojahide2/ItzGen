

import { Plan, PlanName } from './types';

export const PLANS: Record<PlanName, Plan> = {
  [PlanName.Free]: {
    id: 'plan-free',
    name: PlanName.Free,
    price: 0,
    limits: { image: 5, thumbnail: 2, switch: 3 },
    description: 'Default trial plan',
  },
  [PlanName.Go]: {
    id: 'plan-go',
    name: PlanName.Go,
    price: 49,
    limits: { image: 15, thumbnail: 5, switch: 8 },
    description: 'Beginner creator tier',
  },
  [PlanName.Plus]: {
    id: 'plan-plus',
    name: PlanName.Plus,
    price: 99,
    limits: { image: 35, thumbnail: 10, switch: 15 },
    description: 'Regular content maker',
  },
  [PlanName.Pro]: {
    id: 'plan-pro',
    name: PlanName.Pro,
    price: 199,
    limits: { image: 70, thumbnail: 20, switch: 30 },
    description: 'For professionals',
  },
  [PlanName.Ultimate]: {
    id: 'plan-ultimate',
    name: PlanName.Ultimate,
    price: 349,
    limits: { image: 'unlimited', thumbnail: 'unlimited', switch: 'unlimited' },
    description: 'Agency or business users',
  },
};
