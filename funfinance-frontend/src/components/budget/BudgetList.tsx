import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Spinner, ProgressBar, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Budget } from '../../models/budget';
import * as budgetService from '../../services/budgetService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const BudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [budgetUsage, setBudgetUsage] = useState<Record<number, number>>({});
  const { currentUser } = useAuth();
  const { family } = useFamily();
  const [familyId, setFamilyId] = useState<number | null>(null);

  useEffect(() => {
    if (family) {
      setFamilyId(family.id);
    }
  }, [family]);

  useEffect(() => {
    const loadBudgets = async () => {
      if (!familyId) return;
      
      try {
        setLoading(true);
        const data = await budgetService.getBudgetsByFamily(familyId);
        setBudgets(data);
        
        // Завантажуємо використання для кожного бюджету
        const usageData: Record<number, number> = {};
        for (const budget of data) {
          const usage = await budgetService.getBudgetUsage(budget.id);
          usageData[budget.id] = usage;
        }
        setBudgetUsage(usageData);
      } catch (error) {
        console.error('Failed to load budgets:', error);
        setError('Не вдалося завантажити список бюджетів');
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [familyId]);

  if (!family) {
    return (
      <Alert variant="warning">
        Ви повинні бути учасником сім'ї для перегляду бюджетів.
        <br />
        <Link to="/families/create" className="btn btn-primary mt-2">
          Створити сім'ю
        </Link>
      </Alert>
    );
  }

  if (loading) {
    return <Loading message="Завантаження бюджетів..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Бюджети</h2>
        <Link to="/budgets/create" className="btn btn-primary">
            Створити новий бюджет
        </Link>
      </div>

      <ErrorMessage message={error} />

      {budgets.length === 0 ? (
        <Alert variant="info">
          У вас ще немає бюджетів. Створіть свій перший бюджет для відстеження витрат.
        </Alert>
      ) : (
        <div className="row">
          {budgets.map((budget) => {
            const usage = budgetUsage[budget.id] || 0;
            const percentage = Math.min(Math.round((usage / budget.limit) * 100), 100);
            const isExceeded = usage > budget.limit;
            const isNearLimit = percentage >= 80 && percentage < 100;
            
            let variant = 'success';
            if (isExceeded) variant = 'danger';
            else if (isNearLimit) variant = 'warning';
            
            return (
              <div key={budget.id} className="col-md-4 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{budget.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                    </Card.Subtitle>
                    <Card.Text>
                      Ліміт: {formatCurrency(budget.limit)}
                      <br />
                      Використано: {formatCurrency(usage)} ({percentage}%)
                      {isExceeded && (
                        <Badge bg="danger" className="ms-2">Перевищено</Badge>
                      )}
                      {isNearLimit && (
                        <Badge bg="warning" className="ms-2">Наближається до ліміту</Badge>
                      )}
                    </Card.Text>
                    <ProgressBar 
                      variant={variant}
                      now={percentage} 
                      label={`${percentage}%`} 
                      className="mb-3"
                    />
                    <div className="d-grid gap-2">
                        <Link to="/budgets/${budget.id}" className="btn btn-primary">
                          Переглянути деталі
                        </Link>
                        <Link to={`/expenses/create?budgetId=${budget.id}`} className="btn btn-outline-primary">
                            Додати витрату
                        </Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetList;