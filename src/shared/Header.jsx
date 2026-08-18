export default function Header({ token, onSetToken, onSetEmail, userEmail }) {
  const handleLogout = () => {
    onSetToken('');
    onSetEmail('');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#f5f5f5' }}>
      <h1>Todo List</h1>
      {token && (
        <div>
          {userEmail && <span style={{ marginRight: '15px' }}>{userEmail}</span>}
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </header>
  );
}