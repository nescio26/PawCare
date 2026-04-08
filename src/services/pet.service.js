import api from "./api.js";

export const getPets = async (search) => {
  const res = await api.get("/pets", { params: { search } });
  return res.data;
};

export const getPetById = async (id) => {
  const res = await api.get(`/pets/${id}`);
  return res.data;
};

export const getPetsByOwner = async (ownerId) => {
  const res = await api.get(`/pets/owner/${ownerId}`);
  return res.data;
};

export const createPet = async (data) => {
  const res = await api.post("/pets", data);
  return res.data;
};

export const updatePet = async (id, data) => {
  const res = await api.put(`/pets/${id}`, data);
  return res.data;
};

export const deletePet = async (id) => {
  const res = await api.delete(`/pets/${id}`);
  return res.data;
};
