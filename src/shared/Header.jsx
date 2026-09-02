import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, email, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">AIRHub Todo App</h1>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            {email && <span className="text-gray-600 text-sm">Welcome, {email}</span>}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}