import cron from "node-cron";
import { resetQueue } from "../Modules/queue/queue.service.js";
import { emitQueueUpdate } from "../sockets/queue.socket.js";

export const startResetQueueJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log(" Running daily queue reset...");
    await resetQueue();
    emitQueueUpdate();
    console.log(" Queue reset complete");
  });
};
