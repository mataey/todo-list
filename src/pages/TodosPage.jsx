import { useState, useEffect, useReducer } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';

const initialTodoState = {
  todoList: [],
  isLoading: false,
  error: '',
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: '',
      };

    case 'FETCH_TODOS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        todoList: Array.isArray(action.payload)
          ? action.payload
          : [],
        error: '',
      };

    case 'FETCH_TODOS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'ADD_TODO':
      return {
        ...state,
        todoList: [action.payload, ...state.todoList],
        error: '',
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        error: '',
      };

    case 'ROLLBACK_TODO':
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        error: action.error,
      };

    default:
      return state;
  }
}

function TodosPage() {
  const { token, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [state, dispatch] = useReducer(
    todoReducer,
    initialTodoState
  );

  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;

      dispatch({ type: 'FETCH_TODOS_REQUEST' });

      try {
        const params = new URLSearchParams({
          limit: 100,
        });

        const response = await fetch(`/api/tasks?${params}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          await logout();
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        dispatch({
          type: 'FETCH_TODOS_SUCCESS',
          payload: data.tasks,
        });
      } catch (err) {
        dispatch({
          type: 'FETCH_TODOS_FAILURE',
          payload: err.message,
        });
      }
    }

    fetchTodos();
  }, [token, dataVersion, logout]);

  async function addTodo(title) {
    const temporaryTodo = {
      id: `temp-${Date.now()}`,
      title,
      isCompleted: false,
    };

    dispatch({
      type: 'ADD_TODO',
      payload: temporaryTodo,
    });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();

      dispatch({
        type: 'UPDATE_TODO',
        payload: newTodo,
      });

      setDataVersion((v) => v + 1);
    } catch (err) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload: err.message,
      });

      setDataVersion((v) => v + 1);
    }
  }

  async function completeTodo(id) {
    const originalTodo = state.todoList.find(
      (todo) => todo.id === id
    );

    if (!originalTodo) return;

    const editedTodo = {
      ...originalTodo,
      isCompleted: !originalTodo.isCompleted,
    };

    dispatch({
      type: 'UPDATE_TODO',
      payload: editedTodo,
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();

      dispatch({
        type: 'UPDATE_TODO',
        payload: updatedTodo,
      });
    } catch (err) {
      dispatch({
        type: 'ROLLBACK_TODO',
        payload: originalTodo,
        error: err.message,
      });
    }
  }

  async function updateTodo(id, newTitle) {
    const originalTodo = state.todoList.find(
      (todo) => todo.id === id
    );

    if (!originalTodo) return;

    const editedTodo = {
      ...originalTodo,
      title: newTitle,
    };

    dispatch({
      type: 'UPDATE_TODO',
      payload: editedTodo,
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();

      dispatch({
        type: 'UPDATE_TODO',
        payload: updatedTodo,
      });
    } catch (err) {
      dispatch({
        type: 'ROLLBACK_TODO',
        payload: originalTodo,
        error: err.message,
      });
    }
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h2>My Todos</h2>

      {state.error && (
        <p style={{ color: 'red' }}>{state.error}</p>
      )}

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