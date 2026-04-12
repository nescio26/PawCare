import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import * as authService from "../services/auth.service.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success("Welcome Back");
      const role = data.data.user.role;
      if (role === "admin") navigate("/dashboard/admin");
      else if (role === "vet") navigate("/dashboard/vet");
      else navigate("/dashboard/staff");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Login Failed");
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth(); // clear Zustand first
      navigate("/login", { replace: true });
      toast.success("Logged Out Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Logout Failed");
    },
  });
};
