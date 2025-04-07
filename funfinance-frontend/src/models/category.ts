export interface Category {
    id: number;
    name: string;
    description?: string;
    familyId: number;
    expenses?: Expense[];
  }
  
  export interface CategoryCreate {
    name: string;
    description?: string;
    familyId: number;
  }
  
  export interface CategoryUpdate {
    name?: string;
    description?: string;
  }
  
  // Імпортуємо Expense з моделі expense
  import { Expense } from './expense';