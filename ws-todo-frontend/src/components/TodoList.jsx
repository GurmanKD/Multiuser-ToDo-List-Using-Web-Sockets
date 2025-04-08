// src/components/TodoBoard.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { WebSocketContext } from '../WebSocketContext';

const TodoList = () => {
  const { socket, sendMessage } = useContext(WebSocketContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [user] = useState('User_' + Math.floor(Math.random() * 1000)); // fixed unused setUser

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'todo-update') {
        setTodos(message.todos);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    sendMessage({
      type: 'add-todo',
      text: newTodo,
      user,
    });
    setNewTodo('');
  };

  const handleMotivate = (todoId) => {
    sendMessage({
      type: 'motivate',
      id: todoId,
      from: user,
    });
  };

  return (
    <Box p={4}>
      <Typography variant='h4' gutterBottom>
        💼 Daily Todos (Live Collaboration)
      </Typography>

      <Box display='flex' gap={2} mb={4}>
        <TextField
          label='Add a todo...'
          fullWidth
          variant='outlined'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddTodo}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add
        </Button>
      </Box>

      <Grid container spacing={3}>
        {todos.map((todo) => (
          <Grid item xs={12} sm={6} md={4} key={todo.id}>
            <Card
              sx={{
                borderLeft: '5px solid #1976d2',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Typography variant='h6'>{todo.text}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  by <strong>{todo.user}</strong>
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small' onClick={() => handleMotivate(todo.id)}>
                  💪 Motivate
                </Button>
                <Typography variant='body2'>
                  {todo.motivations?.length || 0} 💬
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TodoList;
