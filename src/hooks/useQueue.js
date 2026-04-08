import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import socket from "../utils/socket.js";
import { getLiveQueue } from "../services/queue.service.js";

export const useQueue = () => {
  const [isConnected, setIsConnected] = useState(false);

  const query = useQuery({
    queryKey: ["queue"],
    queryFn: getLiveQueue,
    refetchInterval: 60000,
  });

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("queue:update", (data) => {
      query.refetch();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("queue:update");
      socket.disconnect();
    };
  }, []);

  return { ...query, isConnected };
};
