import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/authContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) return null;

  return (
    <>
      <div className={`sidebar ${!isOpen ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-section">
          <div className="sidebar-heading">Бюджет</div>
          <NavLink 
            to="/budgets" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">💰</span>
            <span>Мої бюджети</span>
          </NavLink>
          <NavLink 
            to="/budgets/create" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">➕</span>
            <span>Створити бюджет</span>
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-heading">Категорії</div>
          <NavLink 
            to="/categories" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            <span>Мої категорії</span>
          </NavLink>
          <NavLink 
            to="/categories/create" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">➕</span>
            <span>Створити категорію</span>
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-heading">Витрати</div>
          <NavLink 
            to="/expenses" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            <span>Всі витрати</span>
          </NavLink>
          <NavLink 
            to="/expenses/create" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">➕</span>
            <span>Додати витрату</span>
          </NavLink>
          <NavLink 
            to="/expenses/analytics" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Аналітика</span>
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-heading">Сім'я</div>
          <NavLink 
            to="/families" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👨‍👩‍👧‍👦</span>
            <span>Моя сім'я</span>
          </NavLink>
        </div>
      </div>

      <Button 
        variant="primary" 
        className="sidebar-toggle d-md-none" 
        onClick={toggle}
      >
        {isOpen ? '←' : '→'}
      </Button>
    </>
  );
};

export default Sidebar;