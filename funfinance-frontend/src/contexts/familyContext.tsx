import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Family } from '../models/family';
import { useAuth } from './authContext';
import * as familyService from '../services/familyService';

interface FamilyContextType {
  family: Family | null;
  loading: boolean;
  error: string | null;
  setFamily: (family: Family | null) => void;
  resetFamily: () => void;
  reloadFamily: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const loadFamily = async () => {
    if (!currentUser) {
      setFamily(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const families = await familyService.getFamilies();
      
      // Отримуємо повні дані для кожної сім'ї
      const familiesWithMembers = await Promise.all(
        families.map(f => familyService.getFamilyWithMembers(f.id))
      );
      
      // Шукаємо сім'ю користувача
      const userFamily = familiesWithMembers.find(f => 
        f.members?.some(m => m.id === currentUser.id)
      );
      
      if (userFamily) {
        setFamily(userFamily);
      } else {
        setFamily(null);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load family:', err);
      setError('Не вдалося завантажити дані про сім\'ю');
    } finally {
      setLoading(false);
    }
  };

  const resetFamily = useCallback(() => {
    setFamily(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadFamily();
    } else {
      setFamily(null);
    }
  }, [currentUser?.id]);

  const contextValue = useMemo(() => ({
    family,
    loading,
    error,
    setFamily,
    resetFamily,
    reloadFamily: loadFamily
  }), [family, loading, error, resetFamily, loadFamily]);

  return (
    <FamilyContext.Provider value={contextValue}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

export default FamilyContext;