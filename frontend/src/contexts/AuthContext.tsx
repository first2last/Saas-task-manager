import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  tenant: {
    id: string;
    name: string;
    plan: 'free' | 'pro';
    slug: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, tenantSlug: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const tenant = localStorage.getItem('tenant');

    if (token && storedUser && tenant) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, tenantSlug: string) => {
    try {
      const response = await api.post('/auth/login', 
        { email, password },
        {
          headers: {
            'x-tenant-id': tenantSlug
          }
        }
      );

      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('tenant', userData.tenant.slug);

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
