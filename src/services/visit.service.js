import api from "./api";

export const getTodayVisits = async () => {
  const res = await api.get("/visits/today");
  return res.data;
};

export const getVisitById = async (id) => {
  const res = await api.get(`/visits/${id}`);
  return res.data;
};

export const getVisitsBypet = async (petId) => {
  const res = await api.get(`/visits/pet/${petId}`);
  return res.data;
};

export const createVisit = async (data) => {
  const res = await api.post("/visits", data);
  return res.data;
};

export const updateVisitStatus = async (id, data) => {
  const res = await api.put(`/visits/${id}/status`, data);
  return res.data;
};

export const cancelVisit = async (id) => {
  const res = await api.put(`/visits/${id}/cancel`);
  return res.data;
};
