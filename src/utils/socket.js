import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  // ✅ use polling only on production — websocket upgrade fails on Render free tier
  transports: ["polling"],
});

export default socket;
