import { useUsers } from "../../hooks/useUsers.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.jsx";

export default function VetSelector({ visitId, selectedVet, setSelectedVet }) {
  const { data } = useUsers();
  const vets = (data?.data || []).filter((u) => u.role === "vet");

  return (
    <Select
      value={selectedVet[visitId] || ""}
      onValueChange={(v) =>
        setSelectedVet((prev) => ({ ...prev, [visitId]: v }))
      }
    >
      <SelectTrigger className="h-10 text-xs bg-white border-dashed hover:border-primary transition-all rounded-xl border-2">
        <SelectValue placeholder="Assign Doctor..." />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-xl">
        {vets.map((vet) => (
          <SelectItem
            key={vet._id}
            value={vet._id}
            className="text-xs font-bold py-2"
          >
            {vet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
