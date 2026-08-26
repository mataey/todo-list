import { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../shared/SortBy';
import FilterInput from '../shared/FilterInput';
import useDebounce from '../utils/useDebounce';

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter state
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  // Data version for cache invalidation
  const [dataVersion, setDataVersion] = useState(0);

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsTodoListLoading(true);
    setError('');

    try {
      const paramsObject = {
        sortBy,
        sortDirection,
        limit: 100,
      };
      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }
      const params = new URLSearchParams(paramsObject);

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
      setFilterError('');
    } catch (err) {
      if (err.message === 'unauthorized') {
        setError('Unauthorized request');
      } else if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
        setFilterError(`Error filtering/sorting todos: ${err.message}`);
      } else {
        setError(`Error fetching todos: ${err.message}`);
      }
    } finally {
      setIsTodoListLoading(false);
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (title) => {
    const tempId = Date.now().toString();
    const optimisticTodo = { id: tempId, title, isCompleted: false };
    
    const previousTodos = [...todoList];
    setError('');
    setIsTodoListLoading(true);
    setTodoList((prev) => [optimisticTodo, ...prev]);

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

      if (response.status === 401) throw new Error('unauthorized');
      if (!response.ok) throw new Error('Failed to add todo');

      const savedTodo = await response.json();
      setTodoList((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)));
      invalidateCache();
    } catch (err) {
      setTodoList(previousTodos);
      if (err.message === 'unauthorized') {
        setError('Unauthorized request');
      } else {
        setError(`Failed to perform operation: ${err.message}`);
      }
    } finally {
      setIsTodoListLoading(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((t) => t.id === id);
    if (!originalTodo) return;

    const previousTodos = [...todoList];
    const updatedStatus = !originalTodo.isCompleted;

    setError('');
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

      if (response.status === 401) throw new Error('unauthorized');
      if (!response.ok) throw new Error('Failed to complete todo');
      invalidateCache();
    } catch (err) {
      setTodoList(previousTodos);
      if (err.message === 'unauthorized') {
        setError('Unauthorized request');
      } else {
        setError(`Failed to perform operation: ${err.message}`);
      }
    }
  };

  const updateTodo = async (editedTodo) => {
    const previousTodos = [...todoList];

    setError('');
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

      if (response.status === 401) throw new Error('unauthorized');
      if (!response.ok) throw new Error('Failed to update todo');
      invalidateCache();
    } catch (err) {
      setTodoList(previousTodos);
      if (err.message === 'unauthorized') {
        setError('Unauthorized request');
      } else {
        setError(`Failed to perform operation: ${err.message}`);
      }
    }
  };

  const handleResetFilters = () => {
    setFilterTerm('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setFilterError('');
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
      {filterError && (
        <div className="error-banner">
          <p style={{ color: 'red' }}>{filterError}</p>
          <button onClick={() => setFilterError('')}>Clear Filter Error</button>
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>
      )}
      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}