// websocket-todo-backend/server.js
const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};
let todos = [];

wss.on('connection', function connection(ws) {
  const id = uuid();
  clients[id] = ws;

  console.log(`Client connected: ${id}`);

  // Send current todos to the newly connected client
  ws.send(JSON.stringify({ type: 'init', todos }));

  ws.on('message', function incoming(message) {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (err) {
      return console.error('Invalid message:', err);
    }

    switch (msg.type) {
      case 'add':
        const todo = {
          id: uuid(),
          text: msg.text,
          done: false,
          user: msg.user,
        };
        todos.push(todo);
        broadcast({ type: 'new-todo', todo });
        break;

      case 'toggle':
        todos = todos.map((t) =>
          t.id === msg.id ? { ...t, done: !t.done } : t
        );
        broadcast({ type: 'toggle-todo', id: msg.id });
        break;

      case 'motivate':
        broadcast({
          type: 'motivate',
          from: msg.from,
          to: msg.to,
          message: msg.message,
        });
        break;
    }
  });

  ws.on('close', () => {
    delete clients[id];
    console.log(`Client disconnected: ${id}`);
  });
});

function broadcast(data) {
  Object.values(clients).forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}
