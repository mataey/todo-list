import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const MAX_EMAIL_LENGTH = 120;
const MAX_PASSWORD_LENGTH = 128;

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }

    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      setError(
        `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`
      );
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setError(
        `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`
      );
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await login(trimmedEmail, password);

      if (result && result.success) {
        navigate(from, { replace: true });
      } else {
        setError(
          result?.error ||
            'Unable to log in. Please check your credentials.'
        );
        setIsLoading(false);
      }
    } catch {
      setError('Unable to log in. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h2 id="login-title" className="login-title">
          Login
        </h2>

        {error && (
          <div className="status-message status-error" role="alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="login-input"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              maxLength={MAX_EMAIL_LENGTH}
              autoComplete="email"
              required
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;