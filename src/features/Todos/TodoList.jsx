import TodoListItem from './TodoListItem';

export default function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  return (
    <ul>
      {todoList.map((todo) => (
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