
import { StudentResult, InteractionRecord } from '../types';

const STORAGE_KEY = 'genyou_results_v2';
const INTERACTIONS_KEY = 'genyou_interactions';

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
    console.error("Failed to parse results", e);
    return [];
  }
};

export const clearResults = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(INTERACTIONS_KEY);
};

export const recordInteraction = (record: Omit<InteractionRecord, 'id'>) => {
  const raw = localStorage.getItem(INTERACTIONS_KEY);
  let existing: InteractionRecord[] = [];
  if (raw) {
    try {
      existing = JSON.parse(raw);
    } catch (e) {
      existing = [];
    }
  }
  const fullRecord: InteractionRecord = {
    ...record,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
  };
  existing.push(fullRecord);
  localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(existing));
};

export const getInteractions = (): InteractionRecord[] => {
  const raw = localStorage.getItem(INTERACTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};
