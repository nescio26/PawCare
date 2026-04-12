import api from "./api";

export const getRecordsByPet = async (petId) => {
  const res = await api.get(`/records/pet/${petId}`);
  return res.data;
};

export const getRecordByVisit = async (visitId) => {
  try {
    const res = await api.get(`/records/visit/${visitId}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};

export const getRecordById = async (id) => {
  const res = await api.get(`/records/${id}`);
  return res.data;
};

export const createRecord = async (data) => {
  const res = await api.post("/records", data);
  return res.data;
};

export const updateRecord = async (id, data) => {
  const res = await api.put(`/records/${id}`, data);
  return res.data;
};
