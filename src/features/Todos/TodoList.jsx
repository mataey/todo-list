cat << 'EOF' > src/features/Todos/TodoList/TodoList.jsx
import { useMemo } from 'react';

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
        <li key={todo.id} style={{ display: 'flex', gap: '10px', margin: '5px 0' }}>
          <span>{todo.title}</span>
          <button onClick={() => onCompleteTodo(todo.id)}>Complete</button>
        </li>
      ))}
    </ul>
  );
}
EOF