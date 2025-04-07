import React, { useState, useEffect } from 'react';
import { Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Family } from '../../models/family';
import * as familyService from '../../services/familyService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import FamilyInvitations from './FamilyInvitations';

const FamilyList = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { family } = useFamily();

  useEffect(() => {
    const loadFamilies = async () => {
      try {
        if (family) {
          // Якщо користувач вже має сім'ю, показуємо тільки її
          const familyWithMembers = await familyService.getFamilyWithMembers(family.id);
          setFamilies([familyWithMembers]);
        } else {
          // Якщо користувач не має сім'ї, показуємо порожній список
          setFamilies([]);
        }
      } catch (error) {
        console.error('Failed to load families:', error);
        setError('Не вдалося завантажити список сімей');
      } finally {
        setLoading(false);
      }
    };

    loadFamilies();
  }, [family]);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      {!family && <FamilyInvitations />} {/* Show invitations at the top if user has no family */}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Мої сім'ї</h2>
        {!family ? (
          <Link to="/families/create" className="btn btn-primary">
            Створити нову сім'ю
          </Link>
        ) : (
          <Alert variant="info" className="mb-0">
            Ви вже є учасником сім'ї. Щоб створити нову, спочатку покиньте поточну.
          </Alert>
        )}
      </div>

      {families.length === 0 ? (
        <Alert variant="info">
          У вас ще немає сімей. Створіть свою першу сім'ю, щоб почати відстежувати витрати на хобі та розваги.
        </Alert>
      ) : (
        <div className="row">
          {families.map((family) => (
            <div key={family.id} className="col-md-4 mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{family.name}</Card.Title>
                  <Card.Text>
                    {family.members ? `${family.members.length} членів` : 'Завантаження членів...'}
                  </Card.Text>
                  <Link to={`/families/${family.id}`}>
                    <Button 
                      variant="primary" 
                      className="w-100"
                    >
                      Переглянути деталі
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyList;