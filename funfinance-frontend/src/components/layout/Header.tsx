import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">FunFinance</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link as={Link} className='nav-link header' to="/budgets">Бюджети</Nav.Link>
                <Nav.Link as={Link} className='nav-link header' to="/categories">Категорії</Nav.Link>
                <Nav.Link as={Link} className='nav-link header' to="/expenses">Витрати</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <Navbar.Text className="me-3">
                  Вітаємо, {currentUser.username}!
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Вийти</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Увійти</Nav.Link>
                <Nav.Link as={Link} to="/register">Зареєструватися</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;