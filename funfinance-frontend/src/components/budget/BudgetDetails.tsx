import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Alert, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { Budget } from '../../models/budget';
import { Expense } from '../../models/expense';
import * as budgetService from '../../services/budgetService';
import * as expenseService from '../../services/expenseService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BudgetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    const loadBudgetDetails = async () => {
      if (!id) return;

      try {
        const budgetData = await budgetService.getBudgetWithExpenses(parseInt(id));
        setBudget(budgetData);
        
        const expensesData = await expenseService.getExpensesByBudget(parseInt(id));
        setExpenses(expensesData);
        
        const usageData = await budgetService.getBudgetUsage(parseInt(id));
        setUsage(usageData);
      } catch (error) {
        console.error('Failed to load budget details:', error);
        setError('Не вдалося завантажити деталі бюджету');
      } finally {
        setLoading(false);
      }
    };

    loadBudgetDetails();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!budget) {
    return <Alert variant="warning">Бюджет не знайдено</Alert>;
  }

  const percentage = Math.min(Math.round((usage / budget.limit) * 100), 100);
  const isExceeded = usage > budget.limit;
  const isNearLimit = percentage >= 80 && percentage < 100;
  
  let variant = 'success';
  if (isExceeded) variant = 'danger';
  else if (isNearLimit) variant = 'warning';

  return (
    <div className="container">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{budget.name}</h3>
          <Link to="/budgets" className="btn btn-outline-primary">
            Назад до списку
          </Link>
        </Card.Header>

        <Card.Body>
          <div className="mb-4">
            <h5>Інформація про бюджет:</h5>
            <p>Період: {formatDate(budget.startDate)} - {formatDate(budget.endDate)}</p>
            <p>
              Ліміт: {formatCurrency(budget.limit)}
              <br />
              Використано: {formatCurrency(usage)} ({percentage}%)
              {isExceeded && (
                <Badge bg="danger" className="ms-2">Перевищено</Badge>
              )}
              {isNearLimit && (
                <Badge bg="warning" className="ms-2">Наближається до ліміту</Badge>
              )}
            </p>
            <ProgressBar 
              variant={variant}
              now={percentage} 
              label={`${percentage}%`} 
              className="mb-3"
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Витрати:</h5>
              <Link 
                to={`/expenses/create?budgetId=${budget.id}`} 
                className="btn btn-primary"
              >
                Додати витрату
              </Link>
            </div>
            
            {expenses.length === 0 ? (
              <Alert variant="info">У цьому бюджеті ще немає витрат</Alert>
            ) : (
              <ListGroup>
                {expenses.map(expense => (
                  <ListGroup.Item 
                    key={expense.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div>{expense.description}</div>
                      <small className="text-muted">
                        {formatDate(expense.date)} - {expense.category?.name}
                      </small>
                    </div>
                    <div>{formatCurrency(expense.amount)}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BudgetDetails;