export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    categoryId: number;
    userId: number;
    budgetId: number;
    category?: Category;
    user?: User;
    budget?: Budget;
  }
  
  export interface ExpenseCreate {
    description: string;
    amount: number;
    date: string;
    categoryId: number;
    userId: number;
    budgetId: number;
  }
  
  export interface ExpenseUpdate {
    description?: string;
    amount?: number;
    date?: string;
    categoryId?: number;
  }
  
  // Імпортуємо інші моделі
  import { Category } from './category';
  import { User } from './user';
  import { Budget } from './budget';