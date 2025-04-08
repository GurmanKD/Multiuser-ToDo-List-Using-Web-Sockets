// server/index.js
const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const wss = new WebSocket.Server({ port: 3001 });
const clients = new Map(); // userId => ws
const todos = {}; // userId => [todo, ...]

wss.on('connection', (ws) => {
  const userId = uuid();
  clients.set(userId, ws);
  todos[userId] = [];

  ws.send(JSON.stringify({ type: 'init', userId, todos }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'add-todo':
        todos[data.userId].push(data.todo);
        broadcastTodos();
        break;
      case 'motivate':
        broadcast({ type: 'motivation', message: data.message });
        break;
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    delete todos[userId];
    broadcastTodos();
  });
});

function broadcastTodos() {
  const payload = JSON.stringify({ type: 'todos', todos });
  for (const ws of clients.values()) {
    ws.send(payload);
  }
}

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const ws of clients.values()) {
    ws.send(msg);
  }
}

console.log('WebSocket server running on ws://localhost:3001');
