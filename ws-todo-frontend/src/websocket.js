let socket;
export const connectWebSocket = (onMessage) => {
  socket = new WebSocket('ws://localhost:3001');
  socket.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };
};

export const sendMessage = (data) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};
