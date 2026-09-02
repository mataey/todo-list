import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

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

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };
      
      const res = await fetch('https://todo-api-fixed.onrender.com/auth/login', options);
      const data = await res.json();
      
      if (res.ok && (data.token || data.csrfToken)) {
        const userToken = data.token || data.csrfToken;
        const userName = data.user?.email || data.name || userEmail;
        setEmail(userName);
        setToken(userToken);
        return { success: true };
      } else {
        return {
          success: false,
          error: `Authentication failed: ${data?.message || 'Invalid credentials'}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error during login',
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('https://todo-api-fixed.onrender.com/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      setEmail('');
      setToken('');
      return { success: true };
    }
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