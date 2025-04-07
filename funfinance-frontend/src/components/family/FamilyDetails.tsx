import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Alert, Spinner, Badge, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Family } from '../../models/family';
import { FamilyInvitation } from '../../models/familyInvitation';
import * as familyService from '../../services/familyService';
import * as authService from '../../services/authService';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import FamilyInvite from './FamilyInvite';

const FamilyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { resetFamily, reloadFamily } = useFamily();

  useEffect(() => {
    const loadFamilyDetails = async () => {
      if (!id) return;

      try {
        const familyData = await familyService.getFamilyWithMembers(parseInt(id));
        setFamily(familyData);
      } catch (error) {
        console.error('Failed to load family details:', error);
        setError('Не вдалося завантажити деталі сім\'ї');
      } finally {
        setLoading(false);
      }
    };

    loadFamilyDetails();
  }, [id]);

  useEffect(() => {
    const loadInvitations = async () => {
      if (!family) return;
      try {
        const data = await familyService.getInvitationsByFamily(family.id);
        setInvitations(data);
      } catch (error) {
        console.error('Failed to load invitations:', error);
      }
    };

    loadInvitations();
  }, [family]);

  const handleLeaveFamily = async () => {
    if (!currentUser || !family) return;
    
    // Показуємо попередження, якщо це останній учасник
    if (family.members?.length === 1) {
      const confirm = window.confirm(
        'Ви єдиний учасник сім\'ї. Якщо ви вийдете, сім\'я буде видалена. Продовжити?'
      );
      if (!confirm) return;
    }
    
    try {
      await authService.leaveFamily(currentUser.id);
      
      if (family.members?.length === 1) {
        await familyService.deleteFamily(family.id);
      }
      
      resetFamily(); // Скидаємо стан сім'ї
      await reloadFamily(); // Перезавантажуємо дані
      navigate('/families');
    } catch (error) {
      console.error('Failed to leave family:', error);
      setError('Не вдалося покинути сім\'ю');
    }
  };

  const handleDeleteFamily = async () => {
    if (!family) return;
    
    try {
      await familyService.deleteFamily(family.id);
      resetFamily(); // Скидаємо стан сім'ї
      navigate('/families');
    } catch (error) {
      console.error('Failed to delete family:', error);
      setError('Не вдалося видалити сім\'ю');
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!family) return;
    
    try {
      await authService.leaveFamily(memberId);
      
      const updatedFamily = await familyService.getFamilyWithMembers(family.id);
      
      if (updatedFamily.members?.length === 0) {
        await familyService.deleteFamily(family.id);
        resetFamily(); // Скидаємо стан сім'ї
        navigate('/families');
        return;
      }
      
      setFamily(updatedFamily);
    } catch (error) {
      console.error('Failed to remove member:', error);
      setError('Не вдалося видалити учасника');
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!family) {
    return <Alert variant="warning">Сім'ю не знайдено</Alert>;
  }

  const isCreator = family.creatorUserId === currentUser?.id;

  return (
    <div className="container">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{family.name}</h3>
          <Link to="/families" className="btn btn-outline-primary">
            Назад до списку
          </Link>
        </Card.Header>
        
        <Card.Body>
          <div className="mb-4">
            <h5>Інформація про сім'ю:</h5>
            <p>Створено: {new Date(family.createdAt).toLocaleDateString()}</p>
            <p>Кількість учасників: {family.members?.length || 0}</p>
          </div>

          <div className="mb-4">
            <h5>Учасники сім'ї:</h5>
            <ListGroup>
              {family.members?.map(member => (
                <ListGroup.Item 
                  key={member.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    {member.username}
                    {member.id === family.creatorUserId && (
                      <Badge bg="primary" className="ms-2">
                        Створювач
                      </Badge>
                    )}
                  </div>
                  {isCreator && member.id !== currentUser?.id && (
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      Видалити
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="mt-4">
            {isCreator ? (
              <div className="d-grid gap-2">
                <Button 
                  variant="danger" 
                  onClick={handleDeleteFamily}
                >
                  Видалити сім'ю
                </Button>
              </div>
            ) : (
              <div className="d-grid gap-2">
                <Button 
                  variant="warning" 
                  onClick={handleLeaveFamily}
                >
                  Покинути сім'ю
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Управління запрошеннями</h5>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h6>Запросити нового учасника</h6>
            <FamilyInvite 
              familyId={family.id} 
              onInviteSent={() => {
                const loadInvitations = async () => {
                  if (!family) return;
                  try {
                    const data = await familyService.getInvitationsByFamily(family.id);
                    setInvitations(data);
                  } catch (error) {
                    console.error('Failed to load invitations:', error);
                  }
                };
                loadInvitations();
              }}
            />
          </div>

          {invitations.length > 0 && (
            <div>
              <h6>Активні запрошення</h6>
              <ListGroup>
                {invitations.map(invitation => (
                  <ListGroup.Item 
                    key={invitation.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div>{invitation.email}</div>
                      <small className="text-muted">
                        Дійсне до: {new Date(invitation.expiresAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      {!invitation.isAccepted && (
                        <Badge bg="warning" className="me-2">Очікує підтвердження</Badge>
                      )}
                      {invitation.isAccepted && (
                        <Badge bg="success" className="me-2">Прийнято</Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FamilyDetails;