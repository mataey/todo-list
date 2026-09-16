import { useState, useEffect } from 'react';

const MAX_TODO_LENGTH = 120;

function TodoListItem({
  todo,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  function handleSave() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Todo cannot be empty.');
      return;
    }

    if (trimmedTitle.length > MAX_TODO_LENGTH) {
      setError(
        'Todo must be ' + MAX_TODO_LENGTH + ' characters or fewer.'
      );
      return;
    }

    setError('');

    if (trimmedTitle !== todo.title) {
      onUpdateTodo(todo.id, trimmedTitle);
    }

    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(todo.title);
    setError('');
    setIsEditing(false);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this todo?'
    );

    if (confirmed) {
      onDeleteTodo(todo.id);
    }
  }

  return (
    <li className="todo-item">
      {isEditing ? (
        <div className="edit-form">
          <div className="edit-input-container">
            <label
              htmlFor={`edit-todo-${todo.id}`}
              className="sr-only"
            >
              Edit todo
            </label>

            <input
              id={`edit-todo-${todo.id}`}
              className="edit-input"
              type="text"
              value={title}
              onChange={(event) => {
                const value = event.target.value;
                setTitle(value);

                if (value.trim().length <= MAX_TODO_LENGTH) {
                  setError('');
                }
              }}
              maxLength={MAX_TODO_LENGTH}
              autoFocus
              aria-describedby={
                error ? `edit-error-${todo.id}` : undefined
              }
            />

            {error && (
              <p
                id={`edit-error-${todo.id}`}
                className="validation-error"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <button
            className="save-button"
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            Save
          </button>

          <button
            className="cancel-button"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <input
            className="todo-checkbox"
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
            aria-label={`Mark ${todo.title} as ${
              todo.isCompleted ? 'active' : 'completed'
            }`}
          />

          <span
            className={`todo-title ${
              todo.isCompleted ? 'completed' : ''
            }`}
          >
            {todo.title}
          </span>

          <button
            className="edit-button"
            type="button"
            onClick={() => {
              setError('');
              setIsEditing(true);
            }}
          >
            Edit
          </button>

          <button
            className="delete-button"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}

export default TodoListItem;