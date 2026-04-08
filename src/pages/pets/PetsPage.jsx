import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePets, useDeletePet } from "../../hooks/usePets.js";
import { useAuthStore } from "../../store/authStore.js";

// shadcn/ui components
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Separator } from "../../components/ui/separator.jsx";

// Shared components
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

// Icons
import { Plus, Search, ChevronRight, Trash2, PawPrint } from "lucide-react";

const speciesConfig = {
  dog: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: "🐕" },
  cat: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: "🐈" },
  bird: { color: "bg-sky-100 text-sky-700 border-sky-200", icon: "🐦" },
  rabbit: { color: "bg-pink-100 text-pink-700 border-pink-200", icon: "🐇" },
  other: { color: "bg-slate-100 text-slate-700 border-slate-200", icon: "🐾" },
};

export default function PetsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Search state with debouncing
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = usePets(debouncedSearch);
  const { mutate: deletePet } = useDeletePet();

  const pets = data?.data || [];
  const canAddPet = user?.role !== "vet";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Patients"
        description="Manage and view all registered pets"
        action={
          canAddPet && (
            <Button onClick={() => navigate("/pets/new")} className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Pet
            </Button>
          )
        }
      />

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search by name, breed, or owner..."
          className="pl-9 h-11 bg-background shadow-sm transition-all focus:ring-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Separator className="opacity-50" />

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner />
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No results found" : "No pets registered"}
          description={
            searchTerm
              ? `We couldn't find anything matching "${searchTerm}"`
              : "Start by adding your first patient to the clinic."
          }
          action={
            canAddPet && (
              <Button onClick={() => navigate("/pets/new")} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Register Pet
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-3">
          {pets.map((pet) => {
            const config = speciesConfig[pet.species] || speciesConfig.other;

            return (
              <Card
                key={pet._id}
                className="group cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"
                onClick={() => navigate(`/pets/${pet._id}`)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Avatar Section */}
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-xl shrink-0 group-hover:bg-primary/10 transition-colors">
                    {config.icon}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base truncate">
                        {pet.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`${config.color} border font-medium py-0 px-2`}
                      >
                        {pet.species}
                      </Badge>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground space-x-2">
                      <span className="truncate">
                        {pet.breed || "Mixed Breed"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-foreground/80">
                          {pet.owner?.name}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex items-center gap-1">
                    {user?.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete ${pet.name}?`))
                            deletePet(pet._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
