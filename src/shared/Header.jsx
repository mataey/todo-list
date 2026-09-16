import Navigation from './Navigation';
import Logoff from '../features/Logoff';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="site-header">
      <h1 className="site-title">My Todo App</h1>

      <Navigation />

      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;