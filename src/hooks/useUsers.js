import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as userService from "../services/user.service.js";
import * as authService from "../services/auth.service.js";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";
import api from "@/services/api.js";

export const useUsers = () => {
  const { token } = useAuthStore(); // ← token was not imported

  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers, // ← was "getUser" missing the s
    enabled: !!token,
    retry: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Updated Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed To Update User");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, password }) => userService.changePassword(id, password), // ← was importing from @/ alias
    onSuccess: () => toast.success("Password Changed Successfully"),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed To Change Password"),
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Deactivated Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed To Deactivate User");
    },
  });
};

export const useRegisterStaff = () => {
  const queryClient = useQueryClient();
  const { token, setAuth, user } = useAuthStore(); // ← get current admin session

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      // restore admin session — registration overwrote it
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.refetchQueries({ queryKey: ["users"] });
      toast.success("Staff account created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create account");
    },
  });
};

export const useVets = () => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["vets"],
    queryFn: () => api.get("/users/vets").then((res) => res.data),
    enabled: !!token,
    retry: false,
  });
};
