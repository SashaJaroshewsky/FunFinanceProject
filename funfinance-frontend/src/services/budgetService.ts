import api from './api';
import { Budget, BudgetCreate, BudgetUpdate } from '../models/budget';

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get('/Budgets');
  return response.data;
};

export const getBudget = async (id: number): Promise<Budget> => {
  const response = await api.get(`/Budgets/${id}`);
  return response.data;
};

export const getBudgetWithExpenses = async (id: number): Promise<Budget> => {
  const response = await api.get(`/Budgets/${id}/WithExpenses`);
  return response.data;
};

export const getBudgetsByFamily = async (familyId: number): Promise<Budget[]> => {
  const response = await api.get(`/Budgets/ByFamily/${familyId}`);
  return response.data;
};

export const getActiveBudgets = async (familyId: number): Promise<Budget[]> => {
  const response = await api.get(`/Budgets/Active/${familyId}`);
  return response.data;
};

export const createBudget = async (budgetData: BudgetCreate): Promise<Budget> => {
  const response = await api.post('/Budgets', budgetData);
  return response.data;
};

export const updateBudget = async (id: number, budgetData: BudgetUpdate): Promise<void> => {
  await api.put(`/Budgets/${id}`, budgetData);
};

export const deleteBudget = async (id: number): Promise<void> => {
  await api.delete(`/Budgets/${id}`);
};

export const getBudgetUsage = async (id: number): Promise<number> => {
  const response = await api.get(`/Budgets/${id}/Usage`);
  return response.data;
};

export const getRemainingBudget = async (id: number): Promise<number> => {
  const response = await api.get(`/Budgets/${id}/Remaining`);
  return response.data;
};

export const isBudgetExceeded = async (id: number): Promise<boolean> => {
  const response = await api.get(`/Budgets/${id}/IsExceeded`);
  return response.data;
};

export const isBudgetNearLimit = async (id: number, threshold: number = 80): Promise<boolean> => {
  const response = await api.get(`/Budgets/${id}/IsNearLimit?threshold=${threshold}`);
  return response.data;
};