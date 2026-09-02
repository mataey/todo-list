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
      const res = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      }

      return { success: false, error: data?.message || 'Authentication failed' };
    } catch {
      return { success: false, error: 'Network error during login' };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/user/logoff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        credentials: 'include',
      });

      setEmail('');
      setToken('');

      if (res.ok) return { success: true };
      return { success: false, error: 'Logout failed on server' };
    } catch {
      setEmail('');
      setToken('');
      return { success: false, error: 'Network error during logout' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
