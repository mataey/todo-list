import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm/TodoForm.jsx';
import { useState, useEffect, useReducer } from 'react';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  
  const [todoList, setTodoList] = useState([]);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    async function fetchTodos() {
      if (!token) return;
      try {
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTodoList(data);
        }
      } catch (err) {
        console.error('Failed to fetch todos', err);
      }
    }
    fetchTodos();
  }, [token, dataVersion]);

  function handleAddTodo() {
    setDataVersion(prev => prev + 1);
  }

  function handleCompleteTodo() {
    setDataVersion(prev => prev + 1);
  }

  function handleUpdateTodo() {
    setDataVersion(prev => prev + 1);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Todos</h2>
      <StatusFilter />
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={handleCompleteTodo}
        onUpdateTodo={handleUpdateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;