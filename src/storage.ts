import { AppState } from './types';
import { format } from 'date-fns';

const STORAGE_KEY = 'warrior_ascension_state';

const INITIAL_STATE: AppState = {
  startDate: null,
  streak: 0,
  longestStreak: 0,
  relapseCount: 0,
  urgesDefeated: 0,
  history: {},
  logs: {},
  lastCheckIn: null,
};

export const storage = {
  save: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  
  load: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_STATE;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse storage', e);
      return INITIAL_STATE;
    }
  },
  
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_STATE;
  }
};

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}
