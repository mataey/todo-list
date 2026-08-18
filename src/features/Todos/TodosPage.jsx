import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!token) return;
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        setTodoList(data.tasks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  const addTodo = async (title) => {
    const tempId = Date.now().toString();
    const optimisticTodo = { id: tempId, title, isCompleted: false };

    setTodoList((prev) => [optimisticTodo, ...prev]);
    const previousTodos = [...todoList];

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title, isCompleted: false }),
      });

      if (!response.ok) throw new Error();

      const savedTodo = await response.json();
      setTodoList((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)));
    } catch {
      setTodoList(previousTodos);
      setError('Failed to add todo.');
    }
  };

  const completeTodo = async (id) => {
    const previousTodos = [...todoList];
    const targetTodo = todoList.find((t) => t.id === id);
    if (!targetTodo) return;

    const updatedState = { ...targetTodo, isCompleted: !targetTodo.isCompleted };

    setTodoList((prev) => prev.map((t) => (t.id === id ? updatedState : t)));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: updatedState.isCompleted }),
      });

      if (!response.ok) throw new Error();
    } catch {
      setTodoList(previousTodos);
      setError('Failed to update todo.');
    }
  };

  const updateTodo = async (editedTodo) => {
    const previousTodos = [...todoList];

    setTodoList((prev) => prev.map((t) => (t.id === editedTodo.id ? editedTodo : t)));

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
      });

      if (!response.ok) throw new Error();
    } catch {
      setTodoList(previousTodos);
      setError('Failed to update todo title.');
    }
  };

  return (
    <div className="todos-container">
      <h2>My Tasks</h2>
      {error && (
        <div className="error-banner">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      )}
      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  );
}