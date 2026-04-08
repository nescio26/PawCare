import api from "./api";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logout = async (data) => {
  const res = await api.post("/auth/logout", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
