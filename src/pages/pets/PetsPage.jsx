import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePets, useDeletePet } from "../../hooks/usePets.js";
import { useAuthStore } from "../../store/authStore.js";

import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";

import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

import {
  Plus,
  Search,
  ChevronRight,
  Trash2,
  PawPrint,
  Home,
  User,
} from "lucide-react";

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
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      {/* 1. Breadcrumbs  */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" /> Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Patients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader
          title="Patients"
          description={
            <span className="flex items-center gap-2 mt-1">
              <PawPrint className="w-4 h-4" />
              {pets.length} registered patients
            </span>
          }
        />
        {canAddPet && (
          <Button
            onClick={() => navigate("/pets/new")}
            className="shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </Button>
        )}
      </div>

      {/* 3. Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search by name, breed, or owner..."
          className="pl-10 h-11 bg-background border-border/60 shadow-sm focus-visible:ring-primary/20 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 4. Patients List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
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
                className="group relative overflow-hidden border-border/50 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer"
                onClick={() => navigate(`/pets/${pet._id}`)}
              >
                <CardContent className="flex items-center gap-5 p-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-xl border border-primary/10 shrink-0 group-hover:bg-primary transition-all duration-300">
                    <span className="group-hover:scale-110 transition-transform">
                      {config.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                        {pet.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`${config.color} border-none font-bold text-[10px] uppercase tracking-wider py-0 px-2`}
                      >
                        {pet.species}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <span className="truncate">
                          {pet.breed || "Mixed Breed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-foreground/80">
                          {pet.owner?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user?.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete ${pet.name}?`))
                            deletePet(pet._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
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
