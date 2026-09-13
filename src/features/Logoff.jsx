import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result && result.success !== false) {
      navigate('/login');
    } else {
      setError(result?.error || 'Failed to log off');
      setIsLoggingOff(false);
    }
  }

  return (
    <div>
      {error && <span style={{ color: 'red' }}>{error}</span>}
      <button onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logoff;