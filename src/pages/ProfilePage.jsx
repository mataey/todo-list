import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

function ProfilePage() {
  const { email, token, logout } = useAuth();
  const navigate = useNavigate();
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          logout();
          navigate('/login', { replace: true });
          throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('Failed to fetch todos');

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
  }, [token, logout, navigate]);

  const completionPercentage = todoStats.total > 0 
    ? Math.round((todoStats.completed / todoStats.total) * 100) 
    : 0;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Profile</h2>
      <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
        <h3>Account Information</h3>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Status:</strong> Active</p>
      </div>

      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
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
    </div>
  );
}

export default ProfilePage;