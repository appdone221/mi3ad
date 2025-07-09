import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'business' | 'personal';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  userType: UserType;
  businessName?: string;
  avatar?: string;
  isVerified?: boolean;
  bio?: string;
  name?: string;
  lastUsernameChange?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: UserType | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  switchUserType: (type: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  const login = (user: User) => {
    setUser(user);
    setUserType(user.userType);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const switchUserType = (type: UserType) => {
    setUserType(type);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      userType, 
      login, 
      logout, 
      updateUser, 
      switchUserType 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};