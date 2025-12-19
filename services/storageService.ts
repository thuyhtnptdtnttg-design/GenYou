
import { StudentResult } from '../types';

const STORAGE_KEY = 'genyou_results_v2'; // Changed key version

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
};
