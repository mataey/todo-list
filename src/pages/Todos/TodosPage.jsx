import { useState, useReducer, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import todoReducer, { initialTodoState, TODO_ACTION } from '../../reducers/todoReducer';
import TodoList from '../../features/Todos/TodoList/TodoList';
import TodoForm from '../../features/Todos/TodoList/TodoForm';
import FilterInput from '../../shared/FilterInput';
import SortBy from '../../shared/SortBy';
import StatusFilter from '../../shared/StatusFilter';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [errorMessage, setErrorMessage] = useState('');
  const [dataVersion, setDataVersion] = useState(0);

  const { todoList, isTodoListLoading, isTodoAdding, isTodoUpdating } = state;

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      dispatch({ type: TODO_ACTION.FETCH_TODOS_START });
      setErrorMessage('');
      try {
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch todos.');
        const data = await response.json();
        dispatch({ type: TODO_ACTION.FETCH_TODOS_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: TODO_ACTION.FETCH_TODOS_ERROR, payload: error.message });
        setErrorMessage(error.message);
      }
    }
    fetchTodos();
  }, [token, dataVersion]);

  async function addTodo(newTodoTitle) {
    dispatch({ type: TODO_ACTION.ADD_TODO_START });
    setErrorMessage('');
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: newTodoTitle }),
      });
      if (!response.ok) throw new Error('Failed to add todo.');
      const data = await response.json();
      dispatch({ type: TODO_ACTION.ADD_TODO_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: TODO_ACTION.ADD_TODO_ERROR, payload: error.message });
      setErrorMessage(error.message);
    }
  }

  async function completeTodo(id) {
    dispatch({ type: TODO_ACTION.UPDATE_TODO_START });
    setErrorMessage('');
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });
      if (!response.ok) throw new Error('Failed to complete todo.');
      const data = await response.json();
      dispatch({ type: TODO_ACTION.UPDATE_TODO_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: TODO_ACTION.UPDATE_TODO_ERROR, payload: error.message });
      setErrorMessage(error.message);
    }
  }

  async function updateTodo(id, updatedFields) {
    dispatch({ type: TODO_ACTION.UPDATE_TODO_START });
    setErrorMessage('');
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) throw new Error('Failed to update todo.');
      const data = await response.json();
      dispatch({ type: TODO_ACTION.UPDATE_TODO_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: TODO_ACTION.UPDATE_TODO_ERROR, payload: error.message });
      setErrorMessage(error.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Todo List</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <StatusFilter />
      <TodoForm onAddTodo={addTodo} isTodoAdding={isTodoAdding} />

      {isTodoListLoading ? (
        <p>Loading...</p>
      ) : (
        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          dataVersion={dataVersion}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
}

export default TodosPage;