import api from "./api";

export const getOwners = async (search) => {
  const res = await api.get("/owners", { params: { search } });
  return res.data;
};

export const getOwnerById = async (id) => {
  const res = await api.get(`/owners/${id}`);
  return res.data;
};

export const createOwner = async (data) => {
  const res = await api.post("/owners", data);
  return res.data;
};

export const updateOwner = async (id, data) => {
  const res = await api.put(`/owners/${id}`, data);
  return res.data;
};

export const deleteOwner = async (id) => {
  const res = await api.delete(`/owners/${id}`);
  return res.data;
};
