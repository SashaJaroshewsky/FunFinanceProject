import api from './api';
import { Family, FamilyCreate } from '../models/family';
import { FamilyInvitation } from '../models/familyInvitation';

export const getFamilies = async (): Promise<Family[]> => {
  const response = await api.get('/Families');
  return response.data;
};

export const getFamily = async (id: number): Promise<Family> => {
  const response = await api.get(`/Families/${id}`);
  return response.data;
};

export const getFamilyWithMembers = async (id: number): Promise<Family> => {
  const response = await api.get(`/Families/${id}/Members`);
  return response.data;
};

export const getUserFamily = async (userId: number): Promise<Family> => {
  const response = await api.get(`/api/families/user/${userId}`);
  return response.data;
};

export const createFamily = async (familyData: { name: string; creatorUserId: number }): Promise<Family> => {
  const response = await api.post('/Families', familyData);
  return response.data;
};

export const updateFamily = async (id: number, name: string): Promise<void> => {
  await api.put(`/Families/${id}`, { name });
};

export const deleteFamily = async (id: number): Promise<void> => {
  await api.delete(`/Families/${id}`);
};

export const sendInvitation = async (familyId: number, email: string): Promise<string> => {
  const response = await api.post(`/Families/${familyId}/SendInvitation`, { email });
  return response.data;
};

export const acceptInvitation = async (token: string, userId: number): Promise<void> => {
  await api.post('/Families/AcceptInvitation', { token, userId });
};

export const getInvitationsByFamily = async (familyId: number): Promise<FamilyInvitation[]> => {
  const response = await api.get(`/Families/${familyId}/Invitations`);
  return response.data;
};

export const getInvitationsByEmail = async (email: string): Promise<FamilyInvitation[]> => {
  const response = await api.get(`/Families/Invitations/ByEmail?email=${email}`);
  return response.data;
};

export const removeMemberFromFamily = async (familyId: number, userId: number): Promise<void> => {
  await api.post(`/Users/${userId}/LeaveFamily`);
};