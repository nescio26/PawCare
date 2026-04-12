import api from "./api";

export const getOverview = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const getVisitStats = async (period = "week") => {
  const res = await api.get("/analytics/visits", { params: { period } });
  return res.data;
};

export const getSpeciesStats = async () => {
  const res = await api.get("/analytics/species");
  return res.data;
};

export const getVetStats = async () => {
  const res = await api.get("/analytics/vets");
  return res.data;
};

export const getQueueStats = async () => {
  const res = await api.get("/analytics/queue");
  return res.data;
};

export const getTopDiagnoses = async () => {
  const res = await api.get("/analytics/diagnoses");
  return res.data;
};
