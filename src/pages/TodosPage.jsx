import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm/TodoForm.jsx';
import SortBy from '../shared/SortBy';
import FilterInput from '../shared/FilterInput';
import { useState, useEffect, useReducer } from 'react';
import todoReducer from '../reducers/todoReducer';

const initialTodoState = {
  todoList: [],
  isLoading: false,
  errorMessage: '',
};

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      try {
        dispatch({ type: 'FETCH_TODOS_INIT' });
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_TODOS_FAILURE', payload: err.message });
      }
    }
    fetchTodos();
  }, [token, dataVersion]);

  async function addTodo(newTodoTitle) {
    // تابع اضافه کردن تودو متناسب با پروژه شما
    setDataVersion((prev) => prev + 1);
  }

  async function completeTodo(id) {
    setDataVersion((prev) => prev + 1);
  }

  async function updateTodo(id, newTitle) {
    setDataVersion((prev) => prev + 1);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Todos</h2>
      {state.errorMessage && <p style={{ color: 'red' }}>{state.errorMessage}</p>}
      <SortBy />
      <StatusFilter />
      <FilterInput />
      <TodoForm onAddTodo={addTodo} />
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