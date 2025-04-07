import api from './api';
import { User, UserLogin, UserRegister } from '../models/user';

export const login = async (credentials: UserLogin): Promise<{userId: number}> => {
  const response = await api.post('/Users/Login', credentials);
  return response.data;
};

export const register = async (userData: UserRegister): Promise<User> => {
  const response = await api.post('/Users/Register', userData);
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/Users/${id}`);
  return response.data;
};

export const joinFamily = async (userId: number, familyId: number): Promise<void> => {
  await api.post(`/Users/${userId}/JoinFamily/${familyId}`);
};

export const leaveFamily = async (userId: number): Promise<void> => {
  await api.post(`/Users/${userId}/LeaveFamily`);
};

export const updateUser = async (id: number, username: string): Promise<void> => {
  await api.put(`/Users/${id}`, { username });
};