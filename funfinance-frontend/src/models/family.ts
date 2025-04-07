import { User } from './user';

export interface Family {
  id: number;
  name: string;
  creatorUserId: number;
  members?: User[];
  createdAt: string;
}

export interface FamilyCreate {
  name: string;
  creatorUserId: number;
}