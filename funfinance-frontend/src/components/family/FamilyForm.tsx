import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as familyService from '../../services/familyService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';

const FamilyForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { family, reloadFamily } = useFamily();
  const navigate = useNavigate();

  useEffect(() => {
    if (family) {
      navigate('/families');
    }
  }, [family, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Ви повинні бути авторизовані');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const newFamily = await familyService.createFamily({
        name,
        creatorUserId: currentUser.id
      });
      await reloadFamily(); // Перезавантажуємо дані про сім'ю
      navigate('/families');
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Сталася помилка при створенні сім\'ї');
      }
      console.error('Error creating family:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center">Створення нової сім'ї</h3>
          </div>
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="familyName">
                <Form.Label>Назва сім'ї</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Наприклад: Родина Петренків"
                  required
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Створення...' : 'Створити сім\'ю'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyForm;