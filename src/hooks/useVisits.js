import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as visitService from "../services/visit.service.js";
import toast from "react-hot-toast";

export const useTodayVisits = () => {
  return useQuery({
    queryKey: ["visits", "today"],
    queryFn: visitService.getTodayVisits,
    refetchInterval: 30000,
  });
};

export const useVisit = (id) => {
  return useQuery({
    queryKey: ["visits", id],
    queryFn: () => visitService.getVisitById(id),
    enabled: !!id,
  });
};

export const useVisitsByPet = (petId) => {
  return useQuery({
    queryKey: ["visits", "pet", petId],
    queryFn: () => visitService.getVisitsByPet(petId),
    enabled: !!petId,
  });
};

export const useCreateVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: visitService.createVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Visit created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create visit");
    },
  });
};

export const useUpdateVisitStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => visitService.updateVisitStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Status updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });
};
