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
  const [email, setEmail] = useState(
    () => localStorage.getItem('todo_email') || ''
  );

  const [token, setToken] = useState(
    () => localStorage.getItem('todo_token') || ''
  );

  const login = async (userEmail, password) => {
    try {
      const res = await fetch('/api/users/logon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password,
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);

        localStorage.setItem('todo_email', data.name);
        localStorage.setItem('todo_token', data.csrfToken);

        return { success: true };
      }

      return {
        success: false,
        error: data?.message || 'Authentication failed',
      };
    } catch {
      return {
        success: false,
        error: 'Network error during login',
      };
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

      localStorage.removeItem('todo_email');
      localStorage.removeItem('todo_token');

      if (res.ok) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Logout failed on server',
      };
    } catch {
      setEmail('');
      setToken('');

      localStorage.removeItem('todo_email');
      localStorage.removeItem('todo_token');

      return {
        success: false,
        error: 'Network error during logout',
      };
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