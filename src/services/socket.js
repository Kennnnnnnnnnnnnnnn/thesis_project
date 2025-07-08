import { io } from 'socket.io-client';

// Automatically use backend port (adjust if deployed)
const socket = io(
  // 'http://localhost:4000',
  'http://157.245.59.122:4000',
   {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: true,
  reconnectionAttempts: 5
});

export default socket;
