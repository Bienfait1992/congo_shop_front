import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:3000");
  }

  if (userId) {
    socket.emit("register_notification", userId);
    socket.emit("register_message", userId);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};