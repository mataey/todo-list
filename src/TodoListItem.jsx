function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        {todo.title}
      </label>
    </li>
  );
}

export default TodoListItem;