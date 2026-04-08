import api from "./api";

export const getLiveQueue = async () => {
  const res = await api.get("/queue/live");
  return res.data;
};

export const resetQueue = async () => {
  const res = await api.delete("/queue/reset");
  return res.data;
};
