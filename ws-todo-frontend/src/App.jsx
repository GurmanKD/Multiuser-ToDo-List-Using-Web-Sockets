import { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage } from './websocket';
import TodoList from './components/TodoList';
import MotivationBoard from './components/MotivationBoard';

import { Container, Typography, Box, Divider } from '@mui/material';

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
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h3' gutterBottom textAlign='center'>
        🧠 Multi-User Todo List
      </Typography>

      <Box my={4}>
        <TodoList userId={userId} todos={todos} addTodo={addTodo} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box my={4}>
        <MotivationBoard messages={messages} sendMotivation={sendMotivation} />
      </Box>
    </Container>
  );
}

export default App;
