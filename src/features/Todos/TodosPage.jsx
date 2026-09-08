import React, { useEffect, useReducer, useCallback } from "react";
import TodoList from "./TodoList/TodoList";
import TodoForm from "./TodoForm";
import SortBy from "../../shared/SortBy";
import FilterInput from "../../shared/FilterInput";
import useDebounce from "../../utils/useDebounce";
import { todoReducer, initialTodoState, TODO_ACTIONS } from "../../reducers/todoReducer";
import { useAuth } from "../../contexts/AuthContext";

const baseUrl = "https://todo-api-fixed.onrender.com";

export default function TodosPage() {
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
      if (!resp.ok) {
        throw new Error("Failed to fetch todos");
      }
      const todos = await resp.json();
      dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos } });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: {
          message: err.message,
          isFilterError: !!debouncedFilterTerm,
        },
      });
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (newTodoTitle) => {
    const tempId = Date.now().toString();
    const newTodo = { id: tempId, title: newTodoTitle, isCompleted: false };
    const previousTodoList = [...todoList];

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { newTodo } });

    try {
      const resp = await fetch(`${baseUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });
      if (!resp.ok) throw new Error("Failed to add todo");
      
      const serverTodo = await resp.json();
      dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { tempId, serverTodo } });
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: true }),
      });
      if (!resp.ok) throw new Error("Failed to complete todo");
      
      const updatedTodo = await resp.json();
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS, payload: { updatedTodo } });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { previousTodoList, message: err.message },
      });
    }
  };

  const handleUpdateTodo = async (editedTodo) => {
    const previousTodoList = [...todoList];
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { id: editedTodo.id, title: editedTodo.title },
    });

    try {
      const resp = await fetch(`${baseUrl}/todos/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedTodo.title }),
      });
      if (!resp.ok) throw new Error("Failed to update todo");
      
      const updatedTodo = await resp.json();
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS, payload: { updatedTodo } });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { previousTodoList, message: err.message },
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded flex justify-between">
          <span>{error}</span>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>✕</button>
        </div>
      )}
      {filterError && (
        <div className="p-2 bg-yellow-100 text-yellow-700 rounded flex justify-between">
          <span>{filterError}</span>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>✕</button>
        </div>
      )}
      <TodoForm onAddTodo={handleAddTodo} />
      <div className="flex gap-4 items-center justify-between">
        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={(term) =>
            dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: term } })
          }
        />
        <div className="flex gap-2 items-center">
          <SortBy
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={(newSortBy) =>
              dispatch({
                type: TODO_ACTIONS.SET_SORT,
                payload: { sortBy: newSortBy, sortDirection },
              })
            }
            onSortDirectionChange={(newDir) =>
              dispatch({
                type: TODO_ACTIONS.SET_SORT,
                payload: { sortBy, sortDirection: newDir },
              })
            }
          />
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>
      {isTodoListLoading ? (
        <p>Loading...</p>
      ) : (
        <TodoList
          todoList={todoList}
          onCompleteTodo={handleCompleteTodo}
          onUpdateTodo={handleUpdateTodo}
        />
      )}
    </div>
  );
}