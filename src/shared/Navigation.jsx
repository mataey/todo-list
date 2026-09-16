import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <ul>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/todos"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Todos
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;