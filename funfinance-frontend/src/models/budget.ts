export interface Budget {
    id: number;
    name: string;
    limit: number;
    startDate: string;
    endDate: string;
    familyId: number;
    expenses?: Expense[];
  }
  
  export interface BudgetCreate {
    name: string;
    limit: number;
    startDate: string;
    endDate: string;
    familyId: number;
  }
  
  export interface BudgetUpdate {
    name?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
  
  // Імпортуємо Expense з моделі expense
  import { Expense } from './expense';