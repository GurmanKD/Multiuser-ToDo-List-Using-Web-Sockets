import { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage } from './websocket';
import TodoList from './components/TodoList';
import MotivationBoard from './components/MotivationBoard';

function App() {
  const [userId, setUserId] = useState(null);
  const [todos, setTodos] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connectWebSocket((msg) => {
      if (msg.type === 'init') {
        setUserId(msg.userId);
        setTodos(msg.todos);
      } else if (msg.type === 'todos') {
        setTodos(msg.todos);
      } else if (msg.type === 'motivation') {
        setMessages((prev) => [...prev, msg.message]);
      }
    });
  }, []);

  const addTodo = (text) => {
    const todo = { text, done: false };
    sendMessage({ type: 'add-todo', userId, todo });
  };

  const sendMotivation = (message) => {
    sendMessage({ type: 'motivate', message });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠 Multi-User Todo List</h1>
      <TodoList userId={userId} todos={todos} addTodo={addTodo} />
      <MotivationBoard messages={messages} sendMotivation={sendMotivation} />
    </div>
  );
}

export default App;
