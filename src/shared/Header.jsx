import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Todo Application</h1>
      {isAuthenticated && (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </header>
  );
}