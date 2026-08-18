import { useState } from 'react';
import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';

export default function App() {
  const [token, setToken] = useState('');

  return (
    <div className="app-container">
      <Header />
      
      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetToken={setToken} />
      )}
    </div>
  );
}