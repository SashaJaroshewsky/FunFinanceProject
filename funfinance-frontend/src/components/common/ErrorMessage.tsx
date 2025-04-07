import React from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  message: string | null;
  variant?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  variant = 'danger',
  dismissible = false,
  onDismiss
}) => {
  if (!message) return null;

  return (
    <Alert 
      variant={variant} 
      dismissible={dismissible}
      onClose={dismissible ? onDismiss : undefined}
    >
      {message}
    </Alert>
  );
};

export default ErrorMessage;