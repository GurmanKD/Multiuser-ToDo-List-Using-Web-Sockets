import { TextField, Button, List, ListItem, Typography } from '@mui/material';
import { useState } from 'react';

export default function TodoList({ userId, todos, addTodo }) {
  const [text, setText] = useState('');

  return (
    <div>
      <Typography variant='h6'>Todos by user</Typography>
      <TextField
        label='New Todo'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        onClick={() => {
          addTodo(text);
          setText('');
        }}
      >
        Add
      </Button>

      {Object.entries(todos).map(([id, items]) => (
        <div key={id}>
          <Typography variant='subtitle1'>
            {id === userId ? 'You' : `User ${id.substring(0, 5)}`}
          </Typography>
          <List>
            {items.map((todo, index) => (
              <ListItem key={index}>{todo.text}</ListItem>
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}
