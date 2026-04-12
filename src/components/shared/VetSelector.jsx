import { useVets } from "../../hooks/useUsers.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";

export default function VetSelector({ visitId, selectedVet, setSelectedVet }) {
  const { data, isError, isLoading } = useVets();

  const vets = isError || isLoading ? [] : data?.data || [];

  if (vets.length === 0) return null;

  return (
    <Select
      value={selectedVet[visitId] || ""}
      onValueChange={(v) =>
        setSelectedVet((prev) => ({ ...prev, [visitId]: v }))
      }
    >
      <SelectTrigger className="h-9 text-xs rounded-xl border-border/60 flex-1">
        <SelectValue placeholder="Assign vet (optional)" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {vets.map((vet) => (
          <SelectItem key={vet._id} value={vet._id} className="text-sm">
            Dr. {vet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
