import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Rank = 
  | 'CIVILIAN' 
  | 'INITIATE' 
  | 'FIGHTER' 
  | 'ENFORCER' 
  | 'GLADIATOR' 
  | 'CHAMPION' 
  | 'WARLORD' 
  | 'CONQUEROR';

export interface WarriorLog {
  mood: string;
  energy: string;
  reflection: string;
}

export interface AppState {
  startDate: string | null;
  streak: number;
  longestStreak: number;
  relapseCount: number;
  urgesDefeated: number;
  history: Record<string, 'success' | 'relapse'>; // YYYY-MM-DD
  logs: Record<string, WarriorLog>; // YYYY-MM-DD
  lastCheckIn: string | null; // YYYY-MM-DD
}

export const RANKS: { name: Rank; minDays: number; description: string }[] = [
  { name: 'CIVILIAN', minDays: 0, description: 'You have just begun your journey. The path is long.' },
  { name: 'INITIATE', minDays: 5, description: 'The first steps are taken. Your resolve is forming.' },
  { name: 'FIGHTER', minDays: 10, description: 'You are no longer a bystander. You are in the arena.' },
  { name: 'ENFORCER', minDays: 20, description: 'Discipline is becoming your law. You enforce it upon yourself.' },
  { name: 'GLADIATOR', minDays: 35, description: 'Your discipline is no longer beginner level. You are becoming dangerous.' },
  { name: 'CHAMPION', minDays: 50, description: 'Halfway to the summit. You are a master of your impulses.' },
  { name: 'WARLORD', minDays: 75, description: 'Your presence commands respect. Your mind is a fortress.' },
  { name: 'CONQUEROR', minDays: 100, description: 'You have conquered your shadow. You are the master of your fate.' },
];

export function getRank(days: number): typeof RANKS[0] {
  return [...RANKS].reverse().find(r => days >= r.minDays) || RANKS[0];
}

export function calculateMentalPower(state: AppState): number {
  const dayWeight = 0.5;
  const urgeWeight = 2;
  const streakWeight = 1;
  
  const totalDays = Object.keys(state.history).filter(d => state.history[d] === 'success').length;
  const power = (totalDays * dayWeight) + (state.urgesDefeated * urgeWeight) + (state.streak * streakWeight);
  
  return Math.min(100, Math.floor(power));
}
