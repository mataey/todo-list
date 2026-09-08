import Navigation from './Navigation';

function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <h1>Todo App</h1>
      <Navigation />
    </header>
  );
}

export default Header;