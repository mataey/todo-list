import React from "react";
import Header from "./shared/Header";
import Logon from "./features/Logon";
import TodosPage from "./features/Todos/TodosPage";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {isAuthenticated ? <TodosPage /> : <Logon />}
      </main>
    </div>
  );
}