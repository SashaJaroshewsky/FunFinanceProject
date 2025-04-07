import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import * as expenseService from '../../services/expenseService';
import * as budgetService from '../../services/budgetService';
import * as categoryService from '../../services/categoryService';
import { Budget } from '../../models/budget';
import { Category } from '../../models/category';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import { getCurrentDateISOString } from '../../utils/formatters';

const ExpenseForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedBudgetId = queryParams.get('budgetId');
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getCurrentDateISOString());
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [budgetId, setBudgetId] = useState<number | ''>(preselectedBudgetId ? Number(preselectedBudgetId) : '');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  const { currentUser } = useAuth();
  const { family } = useFamily();
  const navigate = useNavigate();
  
  const [familyId, setFamilyId] = useState<number | null>(null);

  useEffect(() => {
    if (family) {
      setFamilyId(family.id);
    }
  }, [family]);

  useEffect(() => {
    const loadData = async () => {
      if (!familyId) return;
      
      try {
        // Завантажуємо категорії та бюджети
        const categoriesData = await categoryService.getCategoriesByFamily(familyId);
        setCategories(categoriesData);
        
        const budgetsData = await budgetService.getBudgetsByFamily(familyId);
        setBudgets(budgetsData);
        
        // Якщо це редагування, завантажуємо дані про витрату
        if (isEditing) {
          const expense = await expenseService.getExpense(parseInt(id!));
          setDescription(expense.description);
          setAmount(expense.amount.toString());
          setDate(expense.date.split('T')[0]); // Обрізаємо частину з часом
          setCategoryId(expense.categoryId);
          setBudgetId(expense.budgetId);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Не вдалося завантажити необхідні дані');
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadData();
  }, [familyId, id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Ви повинні бути авторизовані');
      return;
    }
    
    if (!budgetId || !categoryId) {
      setError('Оберіть бюджет та категорію');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Сума витрати повинна бути більше нуля');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (isEditing) {
        await expenseService.updateExpense(parseInt(id!), {
          description,
          amount: parseFloat(amount),
          date,
          categoryId: Number(categoryId)
        });
      } else {
        await expenseService.createExpense({
          description,
          amount: parseFloat(amount),
          date,
          categoryId: Number(categoryId),
          budgetId: Number(budgetId),
          userId: currentUser.id
        });
      }
      navigate('/expenses');
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError(`Сталася помилка при ${isEditing ? 'оновленні' : 'створенні'} витрати`);
      }
      console.error('Error with expense:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center">Завантаження...</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center">
              {isEditing ? 'Редагування витрати' : 'Додавання нової витрати'}
            </h3>
          </div>
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="expenseDescription">
                <Form.Label>Опис витрати</Form.Label>
                <Form.Control 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Наприклад: Квитки в кіно"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="expenseAmount">
                <Form.Label>Сума (грн)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Наприклад: 350"
                  step="0.01"
                  min="0"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="expenseDate">
                <Form.Label>Дата</Form.Label>
                <Form.Control 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="expenseCategory">
                <Form.Label>Категорія</Form.Label>
                <Form.Select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                  required
                >
                  <option value="">Оберіть категорію</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="expenseBudget">
                <Form.Label>Бюджет</Form.Label>
                <Form.Select 
                  value={budgetId}
                  onChange={(e) => setBudgetId(e.target.value ? Number(e.target.value) : '')}
                  disabled={isEditing} // Не можна змінювати бюджет при редагуванні
                  required
                >
                  <option value="">Оберіть бюджет</option>
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name} ({new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Збереження...' : (isEditing ? 'Зберегти зміни' : 'Додати витрату')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;