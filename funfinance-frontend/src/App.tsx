import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

// Імпорт компонентів аутентифікації
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Імпорт компонентів сім'ї
import FamilyList from './components/family/FamilyList';
import FamilyForm from './components/family/FamilyForm';
import FamilyDetails from './components/family/FamilyDetails';

// Імпорт компонентів бюджету
import BudgetList from './components/budget/BudgetList';
import BudgetForm from './components/budget/BudgetForm';

// Імпорт компонентів категорій
import CategoryList from './components/category/CategoryList';
import CategoryForm from './components/category/CategoryForm';

// Імпорт компонентів витрат
import ExpenseList from './components/expense/ExpenseList';
import ExpenseForm from './components/expense/ExpenseForm';
import ExpenseAnalytics from './components/expense/ExpenseAnalytics';

// Імпорт компонентів макету
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Захищені маршрути
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './contexts/authContext';
import { AuthProvider } from './contexts/authContext';
import { FamilyProvider, useFamily } from './contexts/familyContext';

// Домашня сторінка Dashboard
const Dashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="text-center">
      <h1>Ласкаво просимо до FunFinance!</h1>
      <p className="lead">Система для контролю витрат сімейного бюджету на хобі та розваги</p>
      {currentUser ? (
        <div>
          <p>Ви увійшли як {currentUser.username}</p>
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Бюджети</h5>
                  <p className="card-text">Управління бюджетами для різних періодів</p>
                  <a href="/budgets" className="btn btn-primary">Перейти до бюджетів</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Витрати</h5>
                  <p className="card-text">Додавання та відстеження витрат</p>
                  <a href="/expenses" className="btn btn-primary">Перейти до витрат</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Аналітика</h5>
                  <p className="card-text">Перегляд статистики та графіків</p>
                  <a href="/expenses/analytics" className="btn btn-primary">Перейти до аналітики</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Увійдіть в систему або зареєструйтесь, щоб розпочати</p>
          <div className="d-flex justify-content-center gap-3">
            <a href="/login" className="btn btn-primary">Увійти</a>
            <a href="/register" className="btn btn-outline-primary">Зареєструватися</a>
          </div>
        </div>
      )}
    </div>
  );
};

const FamilyRequiredRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { family } = useFamily();
  
  if (!family) {
    return (
      <Navigate 
        to="/families" 
        replace 
        state={{ message: 'Ви повинні бути учасником сім\'ї для доступу до цього розділу' }} 
      />
    );
  }

  return <>{children}</>;
};

function App() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  // Автоматично ховаємо сайдбар на мобільних пристроях
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header />
      
      {currentUser && <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />}
      
      <main className={`container flex-grow-1 py-4 ${currentUser ? (sidebarOpen ? 'content-with-sidebar' : 'content-full') : ''}`}>
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/register" element={
            currentUser ? <Navigate to="/" /> : <Register />
          } />
          
          {/* Домашня сторінка */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Маршрути для сімей */}
          <Route path="/families" element={
            <ProtectedRoute>
              <FamilyList />
            </ProtectedRoute>
          } />
          <Route path="/families/create" element={
            <ProtectedRoute>
              <FamilyForm />
            </ProtectedRoute>
          } />
          <Route path="/families/:id" element={
            <ProtectedRoute>
              <FamilyDetails />
            </ProtectedRoute>
          } />
          
          {/* Маршрути для бюджетів */}
          <Route path="/budgets" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <BudgetList />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/budgets/create" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <BudgetForm />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/budgets/:id/edit" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <BudgetForm />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          
          {/* Маршрути для категорій */}
          <Route path="/categories" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <CategoryList />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/categories/create" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <CategoryForm />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/categories/:id/edit" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <CategoryForm />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          
          {/* Маршрути для витрат */}
          <Route path="/expenses" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <ExpenseList />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/expenses/create" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <ExpenseForm />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/expenses/:id/edit" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <ExpenseForm />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/expenses/analytics" element={
            <ProtectedRoute>
              <FamilyRequiredRoute>
                <ExpenseAnalytics />
              </FamilyRequiredRoute>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FamilyProvider>
          <App />
        </FamilyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

export default App;