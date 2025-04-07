export interface User {
  id: number;
  username: string;
  email: string;
  familyId?: number;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}