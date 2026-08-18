import { useState } from 'react';

export default function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    onUpdateTodo({ ...todo, title: editedTitle });
    setIsEditing(false);
  };

  return (
    <li>
      <input 
        type="checkbox" 
        checked={todo.isCompleted} 
        onChange={() => onCompleteTodo(todo.id)} 
      />
      
      {!isEditing ? (
        <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', margin: '0 10px' }}>
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleUpdateSubmit} style={{ display: 'inline', margin: '0 10px' }}>
          <input 
            type="text" 
            value={editedTitle} 
            onChange={(e) => setEditedTitle(e.target.value)} 
          />
          <button type="submit">Save</button>
        </form>
      )}

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      ) : (
        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
      )}
    </li>
  );
}