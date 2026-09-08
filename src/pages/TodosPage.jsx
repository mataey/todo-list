import { useState, useEffect, useReducer } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm/TodoForm.jsx';

const initialTodoState = {
  todoList: [],
  isLoading: false,
  error: '',
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return { ...state, isLoading: true, error: '' };
    case 'FETCH_TODOS_SUCCESS':
      return { ...state, isLoading: false, todoList: action.payload };
    case 'FETCH_TODOS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_TODO':
      return { ...state, todoList: [action.payload, ...state.todoList] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    default:
      return state;
  }
}

function TodosPage() {
  const { token, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      dispatch({ type: 'FETCH_TODOS_REQUEST' });
      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('Failed to fetch todos');

        const data = await response.json();
        dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_TODOS_FAILURE', payload: err.message });
      }
    }

    fetchTodos();
  }, [token, dataVersion, logout]);

  async function addTodo(title) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to add todo');
      const newTodo = await response.json();
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      setDataVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function completeTodo(id) {
    const todoToUpdate = state.todoList.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ ...todoToUpdate, isCompleted: !todoToUpdate.isCompleted }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updated = await response.json();
      dispatch({ type: 'UPDATE_TODO', payload: updated });
      setDataVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateTodo(id, newTitle) {
    const todoToUpdate = state.todoList.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ ...todoToUpdate, title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updated = await response.json();
      dispatch({ type: 'UPDATE_TODO', payload: updated });
      setDataVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Todos</h2>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <StatusFilter />
      <TodoForm onAddTodo={addTodo} />
      {state.isLoading && <p>Loading todos...</p>}
      <TodoList
        todoList={state.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;