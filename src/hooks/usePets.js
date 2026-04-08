import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as petService from "../services/pet.service.js";
import toast from "react-hot-toast";

export const usePets = (search) => {
  return useQuery({
    queryKey: ["pets", search],
    queryFn: () => petService.getPets(search),
  });
};

export const usePet = (id) => {
  return useQuery({
    queryKey: ["pets", id],
    queryFn: () => petService.getPetById(id),
    enabled: !!id,
  });
};
export const usePetsByOwner = (ownerId) => {
  return useQuery({
    queryKey: ["pets", "owner", ownerId],
    queryFn: () => petService.getPetsByOwner(ownerId),
    enabled: !!ownerId,
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: petService.createPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet registered successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to register pet");
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => petService.updatePet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update pet");
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: petService.deletePet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pets Deleted Successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to Delete Pets");
    },
  });
};
