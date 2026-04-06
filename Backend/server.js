import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/connectDB.js";
import { initSocket } from "./sockets/socket.server.js";
import { startResetQueueJob } from "./jobs/resetQueue.job.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  startResetQueueJob();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 Socket.io ready`);
  });
};

startServer();
