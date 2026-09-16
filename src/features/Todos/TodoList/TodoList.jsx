import { useMemo } from 'react';
import TodoListItem from '../TodoListItem.jsx';

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
  dataVersion,
  statusFilter = 'all',
}) {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;

    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;

      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;

      case 'all':
      default:
        filteredTodos = todoList;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  function getEmptyMessage() {
    if (statusFilter === 'completed') {
      return 'No completed todos yet.';
    }

    if (statusFilter === 'active') {
      return 'No active todos.';
    }

    return 'No todos yet. Add your first todo!';
  }

  if (filteredTodoList.todos.length === 0) {
    return <p className="empty-state">{getEmptyMessage()}</p>;
  }

  return (
    <ul className="todo-list">
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;