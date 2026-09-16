import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

export default function Logon() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      setError('Email address is too long.');
      return;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setError('Password is too long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(trimmedEmail, password);

      if (!result.success) {
        setError(result.error || 'Unable to sign in. Please try again.');
      }
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Log In</h2>

        {error && (
          <div className="status-message status-error" role="alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              className="login-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={MAX_EMAIL_LENGTH}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              className="login-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}