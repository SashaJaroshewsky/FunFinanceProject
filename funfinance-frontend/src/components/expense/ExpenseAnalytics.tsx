import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Form, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import * as expenseService from '../../services/expenseService';
import * as categoryService from '../../services/categoryService';
import * as budgetService from '../../services/budgetService';
import { Category } from '../../models/category';
import { Budget } from '../../models/budget';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import { formatCurrency } from '../../utils/formatters';

// Кольори для графіків
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#A4DE6C', '#D0ED57', '#8DD1E1'];

const ExpenseAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [expensesByUser, setExpensesByUser] = useState<any[]>([]);
  const [expensesByDay, setExpensesByDay] = useState<any[]>([]);
  
  const [totalExpenses, setTotalExpenses] = useState(0);
  
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
        // Завантажуємо категорії та бюджети для фільтрів
        const categoriesData = await categoryService.getCategoriesByFamily(familyId);
        setCategories(categoriesData);
        
        const budgetsData = await budgetService.getBudgetsByFamily(familyId);
        setBudgets(budgetsData);
        
        // Встановлюємо початкові дати, якщо не вказані
        if (!startDate && !endDate && budgetsData.length > 0) {
          const latestBudget = budgetsData.sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )[0];
          
          setStartDate(latestBudget.startDate.split('T')[0]);
          setEndDate(latestBudget.endDate.split('T')[0]);
          setSelectedBudgetId(latestBudget.id);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setError('Не вдалося завантажити категорії та бюджети');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [familyId]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!familyId || (!selectedBudgetId && (!startDate || !endDate))) return;
      
      try {
        setLoading(true);
        
        let start = startDate;
        let end = endDate;
        
        // Якщо обрано бюджет, використовуємо його період
        if (selectedBudgetId) {
          const budget = budgets.find(b => b.id === Number(selectedBudgetId));
          if (budget) {
            start = budget.startDate.split('T')[0];
            end = budget.endDate.split('T')[0];
          }
        }
        
        // Завантажуємо аналітику
        const expensesByCategoryData = await expenseService.getExpensesGroupedByCategory(
          familyId, start, end
        );
        
        const expensesByUserData = await expenseService.getExpensesGroupedByUser(
          familyId, start, end
        );
        
        const expensesByDayData = await expenseService.getExpensesGroupedByDay(
          familyId, start, end
        );
        
        // Перетворюємо дані для графіків
        const categoryChartData = Object.entries(expensesByCategoryData).map(([catId, amount]) => {
          const category = categories.find(c => c.id === Number(catId)) || { name: `Категорія #${catId}` };
          return {
            name: category.name,
            value: amount
          };
        });
        
        const userChartData = Object.entries(expensesByUserData).map(([userId, amount]) => {
          return {
            name: `Користувач #${userId}`,
            value: amount
          };
        });
        
        const dayChartData = Object.entries(expensesByDayData)
          .map(([date, amount]) => ({
            date: new Date(date).toLocaleDateString(),
            amount
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Обчислюємо загальну суму витрат
        const total = categoryChartData.reduce((sum, item) => sum + item.value, 0);
        
        setExpensesByCategory(categoryChartData);
        setExpensesByUser(userChartData);
        setExpensesByDay(dayChartData);
        setTotalExpenses(total);
      } catch (error) {
        console.error('Failed to load analytics:', error);
        setError('Не вдалося завантажити аналітику витрат');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [familyId, selectedBudgetId, startDate, endDate, categories, budgets]);

  if (!family) {
    return (
      <Alert variant="warning">
        Ви повинні бути учасником сім'ї для перегляду аналітики.
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
      <h2 className="mb-4">Аналітика витрат</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Фільтри */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Фільтри</Card.Title>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="budgetFilter">
                <Form.Label>Бюджет</Form.Label>
                <Form.Select 
                  value={selectedBudgetId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedBudgetId(value ? Number(value) : '');
                    
                    // Скидаємо дати, якщо обрано бюджет
                    if (value) {
                      setStartDate('');
                      setEndDate('');
                    } else if (!startDate || !endDate) {
                      // Якщо скинуто бюджет і немає дат, встановлюємо поточний місяць
                      const now = new Date();
                      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                      
                      setStartDate(firstDay.toISOString().split('T')[0]);
                      setEndDate(lastDay.toISOString().split('T')[0]);
                    }
                  }}
                >
                  <option value="">Без бюджету (за період)</option>
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name} ({new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="startDateFilter">
                <Form.Label>Дата початку</Form.Label>
                <Form.Control 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={!!selectedBudgetId}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="endDateFilter">
                <Form.Label>Дата кінця</Form.Label>
                <Form.Control 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={!!selectedBudgetId}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Загальна статистика */}
      <div className="row mb-4">
        <div className="col-12">
          <Card>
            <Card.Body>
              <Card.Title>Загальна статистика</Card.Title>
              <h3>Загальна сума витрат: {formatCurrency(totalExpenses)}</h3>
              <p>Кількість категорій з витратами: {expensesByCategory.length}</p>
              <p>Кількість користувачів з витратами: {expensesByUser.length}</p>
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Графіки */}
      <div className="row">
        {/* Витрати за категоріями (кругова діаграма) */}
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Витрати за категоріями</Card.Title>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        {/* Витрати за користувачами (кругова діаграма) */}
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Витрати за користувачами</Card.Title>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expensesByUser}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {expensesByUser.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        {/* Витрати за днями (стовпчикова діаграма) */}
        <div className="col-12">
          <Card>
            <Card.Body>
              <Card.Title>Витрати за днями</Card.Title>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={expensesByDay}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="amount" name="Сума витрат" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;