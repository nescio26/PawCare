import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as recordService from "../services/record.service.js";
import toast from "react-hot-toast";

export const useRecordsByPet = (petId) => {
  return useQuery({
    queryKey: ["records", "pet", petId],
    queryFn: () => recordService.getRecordsByPet(petId),
    enabled: !!petId,
  });
};

export const useRecordByVisit = (visitId) => {
  return useQuery({
    queryKey: ["records", "visit", visitId],
    queryFn: () => recordService.getRecordByVisit(visitId),
    enabled: !!visitId,
  });
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordService.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast.success("Medical record created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create record");
    },
  });
};

export const useUpdateRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => recordService.updateRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast.success("Record updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update record");
    },
  });
};
