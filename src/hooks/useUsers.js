import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as userService from "../services/user.service.js";
import toast from "react-hot-toast";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getUser,
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

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Deactived Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed To Deactive User");
    },
  });
};
