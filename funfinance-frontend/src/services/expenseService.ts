import api from './api';
import { Expense, ExpenseCreate, ExpenseUpdate } from '../models/expense';

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get('/Expenses');
  return response.data;
};

export const getExpense = async (id: number): Promise<Expense> => {
  const response = await api.get(`/Expenses/${id}`);
  return response.data;
};

export const getExpensesByUser = async (userId: number): Promise<Expense[]> => {
  const response = await api.get(`/Expenses/ByUser/${userId}`);
  return response.data;
};

export const getExpensesByBudget = async (budgetId: number): Promise<Expense[]> => {
  const response = await api.get(`/Expenses/ByBudget/${budgetId}`);
  return response.data;
};

export const getExpensesByCategory = async (categoryId: number): Promise<Expense[]> => {
  const response = await api.get(`/Expenses/ByCategory/${categoryId}`);
  return response.data;
};

export const getExpensesByFamily = async (familyId: number): Promise<Expense[]> => {
  const response = await api.get(`/Expenses/ByFamily/${familyId}`);
  return response.data;
};

export const getExpensesByDateRange = async (
  familyId: number, 
  startDate: string, 
  endDate: string
): Promise<Expense[]> => {
  const response = await api.get(
    `/Expenses/ByDateRange?familyId=${familyId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const createExpense = async (expenseData: ExpenseCreate): Promise<Expense> => {
  const response = await api.post('/Expenses', expenseData);
  return response.data;
};

export const updateExpense = async (id: number, expenseData: ExpenseUpdate): Promise<void> => {
  await api.put(`/Expenses/${id}`, expenseData);
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/Expenses/${id}`);
};

export const getTotalExpensesByUser = async (
  userId: number, 
  startDate: string, 
  endDate: string
): Promise<number> => {
  const response = await api.get(
    `/Expenses/TotalByUser?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getTotalExpensesByCategory = async (
  categoryId: number, 
  startDate: string, 
  endDate: string
): Promise<number> => {
  const response = await api.get(
    `/Expenses/TotalByCategory?categoryId=${categoryId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getExpensesGroupedByCategory = async (
  familyId: number, 
  startDate: string, 
  endDate: string
): Promise<Record<number, number>> => {
  const response = await api.get(
    `/Expenses/GroupByCategory?familyId=${familyId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getExpensesGroupedByUser = async (
  familyId: number, 
  startDate: string, 
  endDate: string
): Promise<Record<number, number>> => {
  const response = await api.get(
    `/Expenses/GroupByUser?familyId=${familyId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getExpensesGroupedByDay = async (
  familyId: number, 
  startDate: string, 
  endDate: string
): Promise<Record<string, number>> => {
  const response = await api.get(
    `/Expenses/GroupByDay?familyId=${familyId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};