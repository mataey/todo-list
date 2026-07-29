import React, { useState, useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef();

  function handleTitleChange(event) {
    const newTodoTitle = event.target.value;
    setTodoTitle(newTodoTitle);
  }

  function handleAddTodo(event) {
    event.preventDefault();
    
    if (todoTitle.trim() === '') return;

    onAddTodo({
      title: todoTitle,
      id: Date.now(),
    });

    setTodoTitle('');
    inputRef.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Title: </label>
      <input
        ref={inputRef}
        id="todoTitle"
        name="title"
        value={todoTitle}
        onChange={handleTitleChange}
      />
      <button type="submit">Add</button>
    </form>
  );
}

default export TodoForm;