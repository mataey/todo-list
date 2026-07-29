import React, { useState } from 'react';
import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(newTodoTitle) {
    const newTodo = {
      title: newTodoTitle,
      id: Date.now(),
    };
    setTodoList(previous => [newTodo, ...previous]);
  }

  return (
    <main>
      <h1>CTD Swag Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </main>
  );
}

export default App;