import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext';
import { useFamily } from '../../contexts/familyContext';
import * as familyService from '../../services/familyService';
import { FamilyInvitation } from '../../models/familyInvitation';

const FamilyInvitations = () => {
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { reloadFamily } = useFamily();

  useEffect(() => {
    const loadInvitations = async () => {
      if (!currentUser?.email) return;

      try {
        const data = await familyService.getInvitationsByEmail(currentUser.email);
        setInvitations(data);
      } catch (error) {
        console.error('Failed to load invitations:', error);
        setError('Не вдалося завантажити запрошення');
      } finally {
        setLoading(false);
      }
    };

    loadInvitations();
  }, [currentUser?.email]);

  const handleAcceptInvitation = async (invitation: FamilyInvitation) => {
    if (!currentUser) return;

    try {
      await familyService.acceptInvitation(invitation.token, currentUser.id);
      await reloadFamily();
      setInvitations(invitations.filter(inv => inv.id !== invitation.id));
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      setError('Не вдалося прийняти запрошення');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (invitations.length === 0) return null;

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Отримані запрошення</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {invitations.map(invitation => (
          <ListGroup.Item 
            key={invitation.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>Запрошення до сім'ї</strong>
              <br />
              <small className="text-muted">
                Дійсне до: {new Date(invitation.expiresAt).toLocaleDateString()}
              </small>
            </div>
            <Button 
              variant="success"
              onClick={() => handleAcceptInvitation(invitation)}
            >
              Прийняти
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default FamilyInvitations;