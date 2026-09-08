import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>404: Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFoundPage;