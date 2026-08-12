import { useState } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([
    { id: 1, title: 'Learn React', isCompleted: false },
    { id: 2, title: 'Build an App', isCompleted: false },
  ]);

  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...todo, ...editedTodo };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  return (
    <div>
      <h1>Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;