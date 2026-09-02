import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const login = async (userEmail, password, baseUrl) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      };
      const res = await fetch(`${baseUrl}/auth/login`, options);
      const data = await res.json();

      if (res.ok && data.token) {
        setEmail(data.user?.email || userEmail);
        setToken(data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const logout = () => {
    setEmail('');
    setToken('');
  };

  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}