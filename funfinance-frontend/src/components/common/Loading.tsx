import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  spinnerOnly?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md',
  message = 'Завантаження...',
  fullScreen = false,
  spinnerOnly = false
}) => {
  // Визначаємо розмір спіннера
  let spinnerSize;
  switch (size) {
    case 'sm':
      spinnerSize = '1rem';
      break;
    case 'lg':
      spinnerSize = '3rem';
      break;
    default:
      spinnerSize = '2rem';
  }

  // Повернення лише спіннера
  if (spinnerOnly) {
    return (
      <Spinner
        animation="border"
        role="status"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
    );
  }

  // Стилі для повноекранного завантаження
  const fullScreenStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }
    : {};

  return (
    <div 
      className={`d-flex flex-column justify-content-center align-items-center ${!fullScreen ? 'my-5' : ''}`}
      style={fullScreenStyle}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ width: spinnerSize, height: spinnerSize }}
      />
      {message && <div className="mt-3">{message}</div>}
    </div>
  );
};

export default Loading;