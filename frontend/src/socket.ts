import { io, Socket } from "socket.io-client";

const REACT_BACKEND_URL = "https://connectncodeshare-production.up.railway.app/";

export const initSocket = async (): Promise<Socket> => {
  const options = {
    'force new connection': true,
    timeout: 10000,
    transports: ['websocket'],
    reconnectionAttempts: Infinity, // Set to number, not string
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  };

  const socket = io(REACT_BACKEND_URL, options);

  // Error handling
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  socket.on('reconnect_attempt', (attempt) => {
    console.log(`Reconnection attempt #${attempt}`);
  });

  socket.on('reconnect_failed', () => {
    console.error('Reconnection failed');
  });

  socket.on('disconnect', (reason) => {
    console.warn(`Disconnected: ${reason}`);
  });

  return socket;
};
