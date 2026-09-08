import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email } = useAuth();
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch todo statistics');
        const todos = await response.json();

        const total = todos.length;
        const completed = todos.filter((t) => t.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTodoStats();
  }, []);

  const completionPercentage = todoStats.total > 0 
    ? Math.round((todoStats.completed / todoStats.total) * 100) 
    : 0;

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Profile</h2>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Account Status:</strong> Active</p>
      </div>

      <h3>Todo Statistics</h3>
      {loading && <p>Loading statistics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div>
          <p>Total Todos: {todoStats.total}</p>
          <p>Completed Todos: {todoStats.completed}</p>
          <p>Active Todos: {todoStats.active}</p>
          <p>Completion Rate: {completionPercentage}%</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;