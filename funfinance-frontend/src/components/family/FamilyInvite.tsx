import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import * as familyService from '../../services/familyService';

interface FamilyInviteProps {
  familyId: number;
  onInviteSent?: () => void;
}

const FamilyInvite = ({ familyId, onInviteSent }: FamilyInviteProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await familyService.sendInvitation(familyId, email);
      setSuccess('Запрошення успішно надіслано');
      setEmail('');
      if (onInviteSent) {
        onInviteSent();
      }
    } catch (error: any) {
      setError(error.response?.data || 'Помилка при надсиланні запрошення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}
      
      <div className="d-flex gap-2">
        <Form.Group className="flex-grow-1">
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введіть email користувача"
            required
          />
        </Form.Group>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Надсилання...' : 'Надіслати запрошення'}
        </Button>
      </div>
    </Form>
  );
};

export default FamilyInvite;