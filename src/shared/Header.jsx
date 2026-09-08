import Navigation from './Navigation';

function Header({ user, handleLogOut }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <h1>Todo-List App</h1>
      
      <Navigation />

      {user && user.id && (
        <div>
          <span>Hi, {user.firstName} </span>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      )}
    </header>
  );
}

export default Header;