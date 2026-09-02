import React, { useEffect, useReducer, useCallback } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm/TodoForm';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer';
import { useAuth } from '../../contexts/AuthContext';

export default function TodosPage({ baseUrl }) {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    dispatch({ type: TODO_ACTIONS.FETCH_START });
    try {
      let url = `${baseUrl}/todos?sortBy=${sortBy}&sortDirection=${sortDirection}`;
      if (debouncedFilterTerm) {
        url += `&filter=${encodeURIComponent(debouncedFilterTerm)}`;
      }
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error('Failed to fetch todos');
      const todos = await resp.json();
      dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos } });
    } catch (err) {
      dispatch({ type: TODO_ACTIONS.FETCH_ERROR, payload: { message: err.message } });
    }
  }, [token, baseUrl, sortBy, sortDirection, debouncedFilterTerm]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos, dataVersion]);

  const handleAddTodo = async (newTodoTitle) => {
    const tempId = Date.now().toString();
    const newTodo = { id: tempId, title: newTodoTitle, isCompleted: false };
    const previousTodoList = [...todoList];

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { newTodo } });

    try {
      const resp = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });
      if (!resp.ok) throw new Error('Failed to add todo');
      dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { previousTodoList, message: err.message },
      });
    }
  };

  const handleCompleteTodo = async (id) => {
    const previousTodoList = [...todoList];
    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });

    try {
      const resp = await fetch(`${baseUrl}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: true }),
      });
      if (!resp.ok) throw new Error('Failed to complete todo');
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { previousTodoList, message: err.message },
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <TodoForm onAddTodo={handleAddTodo} />
      <div className="flex gap-4 items-center">
        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={(term) => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: term } })}
        />
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={(newSortBy, newDir) =>
            dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: newSortBy, sortDirection: newDir || 'asc' } })
          }
        />
      </div>
      {isTodoListLoading ? (
        <p>Loading...</p>
      ) : (
        <TodoList todoList={todoList} onCompleteTodo={handleCompleteTodo} />
      )}
    </div>
  );
}