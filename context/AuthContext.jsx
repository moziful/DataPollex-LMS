'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load token and user from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('datapollex_auth_token');
      const storedUser = localStorage.getItem('datapollex_auth_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (e) {
      console.error('Error reading auth state from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        const userData = data.user || {
          email,
          role: data.role || (email.toLowerCase().includes('admin') ? 'admin' : 'student'),
        };

        setToken(data.token);
        setUser(userData);

        localStorage.setItem('datapollex_auth_token', data.token);
        localStorage.setItem('datapollex_auth_user', JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: data.message || 'Invalid email or password',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: 'Unable to reach backend auth server. Please ensure backend is running.',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'student' }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        const userData = data.user || {
          name,
          email,
          role: 'student',
        };

        setToken(data.token);
        setUser(userData);

        localStorage.setItem('datapollex_auth_token', data.token);
        localStorage.setItem('datapollex_auth_user', JSON.stringify(userData));

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed. Please check your details.',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: 'Unable to reach backend registration server. Please ensure backend is running.',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('datapollex_auth_token');
    localStorage.removeItem('datapollex_auth_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
