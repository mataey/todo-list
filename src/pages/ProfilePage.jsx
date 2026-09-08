import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user, token } = useAuth();
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;
      try {
        setLoading(true);
        setError('');
        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };
        const response = await fetch('/api/tasks', options);
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;
        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchTodoStats();
  }, [token]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Profile</h2>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <h3>Todo Statistics</h3>
      {loading && <p>Loading statistics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div>
          <p>Total Todos: {todoStats.total}</p>
          <p>Completed Todos: {todoStats.completed}</p>
          <p>Active Todos: {todoStats.active}</p>
          {todoStats.total > 0 && (
            <p>Completion Rate: {Math.round((todoStats.completed / todoStats.total) * 100)}%</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;