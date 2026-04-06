import { getIO } from "./socket.server.js";
import { getLiveQueue } from "../Modules/queue/queue.service.js";

export const emitQueueUpdate = async () => {
  try {
    const io = getIO();
    const queue = await getLiveQueue();
    io.to("queue-room").emit("queue:update", {
      count: queue.length,
      data: queue,
    });
  } catch (err) {
    console.error("Socket emit error:", err.message);
  }
};
