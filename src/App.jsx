import { useState } from 'react';
import Header from './shared/Header';
import Logon from './Logon';

export default function App() {
  const [userToken, setUserToken] = useState(null);

  return (
    <div className="app-container">
      <Header />
      {!userToken ? (
        <Logon onLoginSuccess={(token) => setUserToken(token)} />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Welcome! You have successfully logged in.</h2>
        </div>
      )}
    </div>
  );
}