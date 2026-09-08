function AboutPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>About Todo App</h2>
      <p>This application helps you manage your daily tasks efficiently with multi-page navigation and authentication.</p>
      <h3>Features:</h3>
      <ul>
        <li>Task management (Add, Complete, Update)</li>
        <li>URL-based status filtering</li>
        <li>Protected routes</li>
      </ul>
      <h3>Technologies Used:</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
      </ul>
    </div>
  );
}

export default AboutPage;