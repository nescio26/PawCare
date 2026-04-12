import { Server } from "socket.io";
import { ENV } from "../config/config.js";

let io;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  ENV.clientURL,
].filter(Boolean);

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins, // ← array not single string
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.join("queue-room");
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
