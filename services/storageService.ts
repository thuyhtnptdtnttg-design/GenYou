
import { StudentResult, InteractionLog } from '../types';

const STORAGE_KEY = 'genyou_results_v2';
const LOG_KEY = 'learning_passport_logs';

export const saveResult = (result: StudentResult) => {
  const existing = getResults();
  existing.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const getResults = (): StudentResult[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const recordInteraction = (log: InteractionLog) => {
  const raw = localStorage.getItem(LOG_KEY);
  const logs: InteractionLog[] = raw ? JSON.parse(raw) : [];
  logs.push(log);
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
};

export const getInteractionLogs = (): InteractionLog[] => {
  const raw = localStorage.getItem(LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LOG_KEY);
};
