import { useState } from 'react';

const MAX_TODO_LENGTH = 120;

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = workingTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Please enter a todo.');
      return;
    }

    if (trimmedTitle.length > MAX_TODO_LENGTH) {
      setError(
        'Todo must be ' + MAX_TODO_LENGTH + ' characters or fewer.'
      );
      return;
    }

    setError('');
    onAddTodo(trimmedTitle);
    setWorkingTodoTitle('');
  }

  function handleChange(event) {
    const value = event.target.value;
    setWorkingTodoTitle(value);

    if (value.trim().length > MAX_TODO_LENGTH) {
      setError(
        'Todo must be ' + MAX_TODO_LENGTH + ' characters or fewer.'
      );
    } else {
      setError('');
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-input-container">
        <label htmlFor="new-todo" className="sr-only">
          New todo
        </label>

        <input
          id="new-todo"
          className="todo-input"
          type="text"
          value={workingTodoTitle}
          onChange={handleChange}
          maxLength={MAX_TODO_LENGTH}
          placeholder="What needs to be done?"
          aria-describedby={error ? 'todo-error' : undefined}
        />

        {error && (
          <p
            id="todo-error"
            className="validation-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <button
        className="todo-submit"
        type="submit"
        disabled={
          !workingTodoTitle.trim() ||
          workingTodoTitle.trim().length > MAX_TODO_LENGTH
        }
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;