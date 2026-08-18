import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!workingTodoTitle.trim()) {
      return;
    }
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={!workingTodoTitle.trim()}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;