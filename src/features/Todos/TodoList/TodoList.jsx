import { useMemo } from 'react';
import TodoListItem from '../TodoListItem';

export default function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
  const filteredTodoList = useMemo(() => {
    const todos = todoList.filter((todo) => !todo.isCompleted);
    return {
      version: dataVersion,
      todos,
    };
  }, [todoList, dataVersion]);

  return (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}