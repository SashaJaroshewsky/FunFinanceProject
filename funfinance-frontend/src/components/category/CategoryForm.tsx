import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as categoryService from '../../services/categoryService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';

const CategoryForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [familyId, setFamilyId] = useState<number | null>(null);
  
  const { currentUser } = useAuth();
  const { family, loading: familyLoading } = useFamily();
  const navigate = useNavigate();

  useEffect(() => {
    if (family) {
      setFamilyId(family.id);
    }
  }, [family]);

  useEffect(() => {
    const loadCategory = async () => {
      if (!isEditing) {
        setInitialLoading(false);
        return;
      }
      
      try {
        const category = await categoryService.getCategory(parseInt(id));
        setName(category.name);
        setDescription(category.description || '');
      } catch (error) {
        console.error('Failed to load category:', error);
        setError('Не вдалося завантажити дані категорії');
      } finally {
        setInitialLoading(false);
      }
    };

    loadCategory();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !familyId) {
      setError('Ви повинні бути авторизовані та бути учасником сім\'ї');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (isEditing) {
        await categoryService.updateCategory(parseInt(id), { name, description });
      } else {
        await categoryService.createCategory({
          name,
          description,
          familyId
        });
      }
      navigate('/categories');
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError(`Сталася помилка при ${isEditing ? 'оновленні' : 'створенні'} категорії`);
      }
      console.error('Error with category:', error);
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
        <p>Ви повинні бути учасником сім'ї для створення категорій.</p>
        <Link to="/families/create" className="btn btn-primary mt-2">
          Створити сім'ю
        </Link>
      </div>
    );
  }

  if (initialLoading) {
    return <div className="text-center">Завантаження...</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center">
              {isEditing ? 'Редагування категорії' : 'Створення нової категорії'}
            </h3>
          </div>
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="categoryName">
                <Form.Label>Назва категорії</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Наприклад: Кіно"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="categoryDescription">
                <Form.Label>Опис (необов'язково)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опис категорії витрат"
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Збереження...' : (isEditing ? 'Зберегти зміни' : 'Створити категорію')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;