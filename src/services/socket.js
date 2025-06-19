import { io } from 'socket.io-client';
const socket = io('http://localhost:4000', {
  transports: ['websocket'], // Optional
  reconnection: true,
});

socket.on('connect', () => {
  console.log('✅ WebSocket connected!');
});

export default socket;
