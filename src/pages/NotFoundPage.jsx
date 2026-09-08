import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
        <Link to='/' style={{ color: 'blue', textDecoration: 'underline' }}>Go to Home</Link>
        <Link to='/about' style={{ color: 'blue', textDecoration: 'underline' }}>About App</Link>
        <Link to='/todos' style={{ color: 'blue', textDecoration: 'underline' }}>My Todos</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;