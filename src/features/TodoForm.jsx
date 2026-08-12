import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../utils/todoValidation';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const inputRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidTodoTitle(workingTodoTitle)) {
      return;
    }
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInputWithLabel
        elementId="todoInput"
        labelText="Todo"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;