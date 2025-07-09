import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserVerificationData {
  fullName: string;
  age: string;
  phoneNumber: string;
  state: string;
  isVerified: boolean;
  verificationDate?: string;
}

interface UserVerificationContextType {
  userVerification: UserVerificationData | null;
  isVerified: boolean;
  setUserVerification: (data: UserVerificationData) => void;
  clearVerification: () => void;
  needsVerification: () => boolean;
}

const UserVerificationContext = createContext<UserVerificationContextType | undefined>(undefined);

export const UserVerificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userVerification, setUserVerificationState] = useState<UserVerificationData | null>(null);

  // Load verification data from localStorage on mount
  useEffect(() => {
    const loadVerificationData = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedData = localStorage.getItem('userVerification');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserVerificationState(parsedData);
          }
        }
      } catch (error) {
        console.error('Error loading verification data:', error);
      }
    };

    loadVerificationData();
  }, []);

  // Save verification data to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (userVerification) {
          localStorage.setItem('userVerification', JSON.stringify(userVerification));
        } else {
          localStorage.removeItem('userVerification');
        }
      }
    } catch (error) {
      console.error('Error saving verification data:', error);
    }
  }, [userVerification]);

  const setUserVerification = (data: UserVerificationData) => {
    const verificationData = {
      ...data,
      isVerified: true,
      verificationDate: new Date().toISOString(),
    };
    setUserVerificationState(verificationData);
  };

  const clearVerification = () => {
    setUserVerificationState(null);
  };

  const needsVerification = (): boolean => {
    return !userVerification || !userVerification.isVerified;
  };

  const isVerified = userVerification?.isVerified || false;

  return (
    <UserVerificationContext.Provider value={{
      userVerification,
      isVerified,
      setUserVerification,
      clearVerification,
      needsVerification,
    }}>
      {children}
    </UserVerificationContext.Provider>
  );
};

export const useUserVerification = () => {
  const context = useContext(UserVerificationContext);
  if (!context) {
    throw new Error('useUserVerification must be used within a UserVerificationProvider');
  }
  return context;
};