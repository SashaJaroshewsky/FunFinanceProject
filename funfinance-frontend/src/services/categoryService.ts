import api from './api';
import { Category, CategoryCreate, CategoryUpdate } from '../models/category';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/Categories');
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/Categories/${id}`);
  return response.data;
};

export const getCategoriesByFamily = async (familyId: number): Promise<Category[]> => {
  const response = await api.get(`/Categories/ByFamily/${familyId}`);
  return response.data;
};

export const createCategory = async (categoryData: CategoryCreate): Promise<Category> => {
  const response = await api.post('/Categories', categoryData);
  return response.data;
};

export const updateCategory = async (id: number, categoryData: CategoryUpdate): Promise<void> => {
  await api.put(`/Categories/${id}`, categoryData);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/Categories/${id}`);
};

export const getTotalExpenses = async (id: number): Promise<number> => {
  const response = await api.get(`/Categories/${id}/TotalExpenses`);
  return response.data;
};