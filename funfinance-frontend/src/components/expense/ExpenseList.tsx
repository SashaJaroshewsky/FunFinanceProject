import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Expense } from '../../models/expense';
import { Budget } from '../../models/budget';
import { Category } from '../../models/category';
import * as expenseService from '../../services/expenseService';
import * as budgetService from '../../services/budgetService';
import * as categoryService from '../../services/categoryService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Фільтри
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | ''>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { currentUser } = useAuth();
  const { family } = useFamily();
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
        setLoading(true);
        
        // Завантажуємо бюджети і категорії для фільтрів
        const budgetsData = await budgetService.getBudgetsByFamily(familyId);
        setBudgets(budgetsData);
        
        const categoriesData = await categoryService.getCategoriesByFamily(familyId);
        setCategories(categoriesData);
        
        // Завантажуємо витрати
        let expensesData: Expense[];
        if (selectedBudgetId) {
          expensesData = await expenseService.getExpensesByBudget(Number(selectedBudgetId));
        } else if (startDate && endDate) {
          expensesData = await expenseService.getExpensesByDateRange(familyId, startDate, endDate);
        } else {
          expensesData = await expenseService.getExpensesByFamily(familyId);
        }
        
        // Застосовуємо додатковий фільтр за категорією, якщо потрібно
        if (selectedCategoryId) {
          expensesData = expensesData.filter(expense => 
            expense.categoryId === Number(selectedCategoryId)
          );
        }
        
        setExpenses(expensesData);
      } catch (error) {
        console.error('Failed to load expenses:', error);
        setError('Не вдалося завантажити дані витрат');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [familyId, selectedBudgetId, selectedCategoryId, startDate, endDate]);

  const handleDelete = async (id: number) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      setError('Не вдалося видалити витрату');
    }
  };

  const resetFilters = () => {
    setSelectedBudgetId('');
    setSelectedCategoryId('');
    setStartDate('');
    setEndDate('');
  };

  if (!family) {
    return (
      <Alert variant="warning">
        Ви повинні бути учасником сім'ї для перегляду витрат.
        <br />
        <Link to="/families/create" className="btn btn-primary mt-2">
          Створити сім'ю
        </Link>
      </Alert>
    );
  }

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Витрати</h2>
        <Link to="/expenses/create" className="btn btn-primary">
          Додати нову витрату
        </Link>
      </div>
      
      {/* Фільтри */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Фільтри</h5>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="budgetFilter">
                <Form.Label>Бюджет</Form.Label>
                <Form.Select 
                  value={selectedBudgetId}
                  onChange={(e) => setSelectedBudgetId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Всі бюджети</option>
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="categoryFilter">
                <Form.Label>Категорія</Form.Label>
                <Form.Select 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Всі категорії</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="startDateFilter">
                <Form.Label>Дата початку</Form.Label>
                <Form.Control 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="endDateFilter">
                <Form.Label>Дата кінця</Form.Label>
                <Form.Control 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="secondary" 
                className="mb-3 w-100"
                onClick={resetFilters}
              >
                Скинути фільтри
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {expenses.length === 0 ? (
        <Alert variant="info">
          Немає витрат за вказаними фільтрами.
        </Alert>
      ) : (
        <>
          <p><strong>Всього витрат:</strong> {expenses.length}</p>
          <p><strong>Загальна сума:</strong> {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</p>
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Опис</th>
                <th>Категорія</th>
                <th>Сума</th>
                <th>Бюджет</th>
                <th>Хто витратив</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category?.name || `Категорія #${expense.categoryId}`}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{expense.budget?.name || `Бюджет #${expense.budgetId}`}</td>
                  <td>{expense.user?.username || `Користувач #${expense.userId}`}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link 
                        to={`/expenses/${expense.id}/edit`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        Редагувати
                      </Link>
                      <Button 
                        variant="outline-danger"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default ExpenseList;