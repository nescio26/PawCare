import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ownerService from "../services/owner.service.js";
import toast from "react-hot-toast";

export const useOwners = (search) => {
  return useQuery({
    queryKey: ["owners", search],
    queryFn: () => ownerService.getOwners(search),
  });
};

export const useOwner = (id) => {
  return useQuery({
    queryKey: ["owners", id],
    queryFn: () => ownerService.getOwnerById(id),
    enabled: !!id,
  });
};

export const useCreateOwner = () => {
  const queryClient = useQueryClient;
  return useMutation({
    mutationFn: ownerService.createOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      toast.success("Owner Registered Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed To Create Owner");
    },
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => ownerService.updateOwner(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      toast.success("Owner Updated Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed To Update Owner");
    },
  });
};

export const useDeleteOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ownerService.deleteOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      toast.success("Owner deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete owner");
    },
  });
};
