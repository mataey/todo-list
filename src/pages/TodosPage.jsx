import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import StatusFilter from '../shared/StatusFilter';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';

const MAX_TODO_LENGTH = 120;

const initialState = {
  todoList: [],
  error: '',
  isTodoListLoading: false,
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
      };

    case 'FETCH_TODOS_SUCCESS':
      return {
        ...state,
        todoList: action.payload,
        isTodoListLoading: false,
        error: '',
      };

    case 'FETCH_TODOS_FAILURE':
      return {
        ...state,
        isTodoListLoading: false,
        error: action.payload,
      };

    case 'ADD_TODO':
      return {
        ...state,
        todoList: [...state.todoList, action.payload],
        error: '',
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todoList: state.todoList.map(function (todo) {
          return todo.id === action.payload.id
            ? action.payload
            : todo;
        }),
        error: '',
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todoList: state.todoList.filter(function (todo) {
          return todo.id !== action.payload;
        }),
        error: '',
      };

    default:
      return state;
  }
}

function TodosPage() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const statusFilter = searchParams.get('status') || 'all';

  useEffect(
    function () {
      async function fetchTodos() {
        dispatch({ type: 'FETCH_TODOS_REQUEST' });

        try {
          const response = await fetch('/api/tasks', {
            headers: {
              'X-CSRF-Token': token,
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Unable to load todos.');
          }

          const data = await response.json();

          dispatch({
            type: 'FETCH_TODOS_SUCCESS',
            payload: data.tasks || [],
          });
        } catch (error) {
          dispatch({
            type: 'FETCH_TODOS_FAILURE',
            payload: error.message || 'Unable to load todos.',
          });
        }
      }

      if (token) {
        fetchTodos();
      }
    },
    [token]
  );

  async function addTodo(title) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload: 'Please enter a todo.',
      });
      return;
    }

    if (trimmedTitle.length > MAX_TODO_LENGTH) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload:
          'Todo must be ' +
          MAX_TODO_LENGTH +
          ' characters or fewer.',
      });
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: trimmedTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to add todo.'
        );
      }

      dispatch({
        type: 'ADD_TODO',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload: error.message || 'Unable to add todo.',
      });
    }
  }

  async function completeTodo(id) {
    const todo = state.todoList.find(function (item) {
      return item.id === id;
    });

    if (!todo) {
      return;
    }

    try {
      const response = await fetch(
        '/api/tasks/' + id,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            isCompleted: !todo.isCompleted,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to update todo.'
        );
      }

      dispatch({
        type: 'UPDATE_TODO',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload:
          error.message || 'Unable to update todo.',
      });
    }
  }

  async function updateTodo(id, title) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload: 'Todo cannot be empty.',
      });
      return;
    }

    if (trimmedTitle.length > MAX_TODO_LENGTH) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload:
          'Todo must be ' +
          MAX_TODO_LENGTH +
          ' characters or fewer.',
      });
      return;
    }

    try {
      const response = await fetch(
        '/api/tasks/' + id,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: trimmedTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to update todo.'
        );
      }

      dispatch({
        type: 'UPDATE_TODO',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload:
          error.message || 'Unable to update todo.',
      });
    }
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(
        '/api/tasks/' + id,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
          },
          credentials: 'include',
        }
      );

      const data = await response.json().catch(function () {
        return {};
      });

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'Unable to delete todo.'
        );
      }

      dispatch({
        type: 'DELETE_TODO',
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        payload:
          error.message || 'Unable to delete todo.',
      });
    }
  }

  function handleFilterChange(value) {
    if (value === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status: value });
    }
  }

  return (
    <main className="todos-page">
      <section
        className="todos-card"
        aria-labelledby="todos-title"
      >
        <h2 id="todos-title" className="todos-title">
          My Todos
        </h2>

        {state.error && (
          <div
            className="status-message status-error"
            role="alert"
          >
            {state.error}
          </div>
        )}

        <StatusFilter
          value={statusFilter}
          onChange={handleFilterChange}
        />

        <TodoForm onAddTodo={addTodo} />

        {state.isTodoListLoading ? (
          <p
            className="status-message status-loading"
            role="status"
          >
            Loading todos...
          </p>
        ) : (
          <TodoList
            todoList={state.todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            dataVersion={state.todoList.length}
            statusFilter={statusFilter}
          />
        )}
      </section>
    </main>
  );
}

export default TodosPage;
