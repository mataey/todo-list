import { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Cart from './Cart';

function App() {
  const [todoList, setTodoList] = useState([
    { id: 1, title: 'Learn React', isCompleted: false },
    { id: 2, title: 'Build an App', isCompleted: false },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
      <h1>CTD Swag App</h1>
      <button onClick={handleOpenCart}>Open Cart</button>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
      {isCartOpen && (
        <Cart
          cart={cart}
          setCart={setCart}
          handleCloseCart={handleCloseCart}
        />
      )}
    </div>
  );
}

export default App;