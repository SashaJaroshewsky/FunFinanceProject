import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import * as budgetService from '../../services/budgetService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import { getCurrentDateISOString, getNextMonthDateISOString } from '../../utils/formatters';

const BudgetForm = () => {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [startDate, setStartDate] = useState(getCurrentDateISOString());
  const [endDate, setEndDate] = useState(getNextMonthDateISOString());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [familyId, setFamilyId] = useState<number | null>(null);
  
  const { currentUser } = useAuth();
  const { family, loading: familyLoading } = useFamily();
  const navigate = useNavigate();

  useEffect(() => {
    if (family) {
      setFamilyId(family.id);
    }
  }, [family]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !familyId) {
      setError('Ви повинні бути авторизовані та бути учасником сім\'ї');
      return;
    }
    
    if (parseFloat(limit) <= 0) {
      setError('Ліміт бюджету повинен бути більше нуля');
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      setError('Дата початку повинна бути раніше дати закінчення');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await budgetService.createBudget({
        name,
        limit: parseFloat(limit),
        startDate,
        endDate,
        familyId
      });
      navigate('/budgets');
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Сталася помилка при створенні бюджету');
      }
      console.error('Error creating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (familyLoading) {
    return <div className="text-center">Завантаження даних сім'ї...</div>;
  }

  if (!family) {
    return (
      <div className="alert alert-warning">
        Ви повинні бути учасником сім'ї, щоб створювати бюджети.
        <br />
        <Link to="/families/create" className="btn btn-primary mt-2">
          Створити сім'ю
        </Link>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center">Створення нового бюджету</h3>
          </div>
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="budgetName">
                <Form.Label>Назва бюджету</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Наприклад: Літні розваги 2025"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="budgetLimit">
                <Form.Label>Ліміт бюджету (грн)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="Наприклад: 5000"
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>Дата початку</Form.Label>
                <Form.Control 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="endDate">
                <Form.Label>Дата закінчення</Form.Label>
                <Form.Control 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Створення...' : 'Створити бюджет'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;