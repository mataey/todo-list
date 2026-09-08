import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none',
    color: '#333',
  });

  async function handleLogout() {
    const result = await logout();
    if (result.success || result === undefined) {
      navigate('/login');
    }
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#f5f5f5' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0, margin: 0, alignItems: 'center' }}>
        <li>
          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" style={navLinkStyle}>Todos</NavLink>
            </li>
            <li>
              <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
          </li>
        )}
      </ul>
      {isAuthenticated && (
        <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navigation;