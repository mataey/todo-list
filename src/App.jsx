import { useState } from 'react';
import './App.css';
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([
    { id: 1, title: "Learn React" },
    { id: 2, title: "Build a Todo App" },
    { id: 3, title: "Submit assignment" }
  ]);

  return (
    <main>
      <h1>CTD Swag Todo List</h1>
      <TodoList todoList={todoList} />
    </main>
  );
}

export default App;