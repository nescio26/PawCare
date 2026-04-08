import { useQuery } from "@tanstack/react-query";
import * as analyticsService from "../services/analytics.service.js";

export const useOverview = () => {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: analyticsService.getOverview,
  });
};

export const useVisitStats = (period) => {
  return useQuery({
    queryKey: ["analytics", "visits", period],
    queryFn: () => analyticsService.getVisitStats(period),
  });
};

export const useSpeciesStats = () => {
  return useQuery({
    queryKey: ["analytics", "species"],
    queryFn: analyticsService.getSpeciesStats,
  });
};

export const useVetStats = () => {
  return useQuery({
    queryKey: ["analytics", "vets"],
    queryFn: analyticsService.getVetStats,
  });
};

export const useTopDiagnoses = () => {
  return useQuery({
    queryKey: ["analytics", "diagnoses"],
    queryFn: analyticsService.getTopDiagnoses,
  });
};
