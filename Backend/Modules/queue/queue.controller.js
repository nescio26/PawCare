import * as queueService from "./queue.service.js";
import { emitQueueUpdate } from "../../sockets/queue.socket.js";

export const getLiveQueue = async (req, res, next) => {
  try {
    const queue = await queueService.getLiveQueue();
    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (err) {
    next(err);
  }
};

export const resetQueue = async (req, res, next) => {
  try {
    const result = await queueService.resetQueue();
    emitQueueUpdate();
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
