import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Category } from '../../models/category';
import * as categoryService from '../../services/categoryService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import { formatCurrency } from '../../utils/formatters';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryTotals, setCategoryTotals] = useState<Record<number, number>>({});
  const { currentUser } = useAuth();
  const { family } = useFamily();
  const [familyId, setFamilyId] = useState<number | null>(null);

  useEffect(() => {
    if (family) {
      setFamilyId(family.id);
    }
  }, [family]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!familyId) return;
      
      try {
        setLoading(true);
        const data = await categoryService.getCategoriesByFamily(familyId);
        setCategories(data);
        
        // Завантажуємо загальні витрати для кожної категорії
        const totalsData: Record<number, number> = {};
        for (const category of data) {
          const total = await categoryService.getTotalExpenses(category.id);
          totalsData[category.id] = total;
        }
        setCategoryTotals(totalsData);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setError('Не вдалося завантажити список категорій');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [familyId]);

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError('Не вдалося видалити категорію. Можливо, є пов\'язані витрати.');
    }
  };

  if (!family) {
    return (
      <Alert variant="warning">
        Ви повинні бути учасником сім'ї для перегляду категорій.
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Категорії витрат</h2>
        <Link to="/categories/create" className="btn btn-primary">
          Створити нову категорію
        </Link>
      </div>
        
      {categories.length === 0 ? (
        <Alert variant="info">
          У вас ще немає категорій. Створіть свою першу категорію для класифікації витрат.
        </Alert>
      ) : (
        <ListGroup>
          {categories.map((category) => (
            <ListGroup.Item 
              key={category.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{category.name}</h5>
                {category.description && <p className="text-muted mb-0">{category.description}</p>}
              </div>
              <div className="d-flex align-items-center">
                <Badge bg="info" className="me-3">
                  {formatCurrency(categoryTotals[category.id] || 0)}
                </Badge>
                <div className="btn-group">
                  <Link 
                    to={`/categories/${category.id}/edit`} 
                    className="btn btn-outline-primary btn-sm"
                  >
                    Редагувати
                  </Link>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CategoryList;