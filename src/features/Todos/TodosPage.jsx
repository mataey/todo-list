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
          throw new Error('unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        setTodoList(data.tasks || []);
      } catch (err) {
        if (err.message === 'unauthorized') {
          setError('Unauthorized request');
        } else {
          setError(`Error fetching todos: ${err.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  const addTodo = async (title) => {
    const tempId = Date.now().toString();
    const optimisticTodo = { id: tempId, title, isCompleted: false };
    
    const previousTodos = [...todoList];
    setTodoList((prev) => [optimisticTodo, ...prev]);
    setError('');

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

      if (!response.ok) throw new Error('Failed to add todo');

      const savedTodo = await response.json();
      setTodoList((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)));
    } catch (err) {
      setTodoList(previousTodos);
      setError(`Failed to add todo: ${err.message}`);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((t) => t.id === id);
    if (!originalTodo) return;

    const previousTodos = [...todoList];
    const updatedStatus = !originalTodo.isCompleted;

    setTodoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: updatedStatus } : t))
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: updatedStatus }),
      });

      if (!response.ok) throw new Error('Failed to complete todo');
    } catch (err) {
      setTodoList(previousTodos);
      setError(`Failed to complete todo: ${err.message}`);
    }
  };

  const updateTodo = async (editedTodo) => {
    const previousTodos = [...todoList];

    setTodoList((prev) =>
      prev.map((t) => (t.id === editedTodo.id ? editedTodo : t))
    );

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

      if (!response.ok) throw new Error('Failed to update todo');
    } catch (err) {
      setTodoList(previousTodos);
      setError(`Failed to update todo: ${err.message}`);
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