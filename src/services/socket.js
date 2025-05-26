import { io } from "socket.io-client";
import apiURL from "@/api/config";

const socket = io(apiURL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

socket.on('connect', () => {
  console.log('WebSocket connected successfully');
});

export default socket;