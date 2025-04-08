import { TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';

export default function MotivationBoard({ messages, sendMotivation }) {
  const [msg, setMsg] = useState('');

  return (
    <div style={{ marginTop: 20 }}>
      <Typography variant='h6'>💬 Motivations</Typography>
      <TextField
        fullWidth
        label='Send motivation'
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Button
        onClick={() => {
          sendMotivation(msg);
          setMsg('');
        }}
      >
        Send
      </Button>

      <div>
        {messages.map((m, i) => (
          <Typography key={i} style={{ marginTop: 4 }}>
            💡 {m}
          </Typography>
        ))}
      </div>
    </div>
  );
}
