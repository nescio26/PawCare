import { useNavigate, useParams, Link } from "react-router-dom";
import { useOwner } from "../../hooks/useOwners.js";
import { usePetsByOwner } from "../../hooks/usePets.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";
import {
  Phone,
  Mail,
  MapPin,
  Edit,
  Plus,
  PawPrint,
  User,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

export default function OwnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: ownerData, isLoading } = useOwner(id);
  const { data: petsData, isLoading: petsLoading } = usePetsByOwner(id);

  if (isLoading) return <LoadingSpinner />;

  const owner = ownerData?.data;
  const pets = petsData?.data || [];

  if (!owner) return <EmptyState title="Owner not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* 1. Refined Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/owners" className="flex items-center gap-1">
                <Home className="h-3 w-3" /> Owners
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{owner.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Profile Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {owner.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Client since {new Date().getFullYear()} •{" "}
              <span className="text-primary font-medium">
                {pets.length} Pets
              </span>
            </p>
          </div>
        </div>

        {user?.role !== "vet" && (
          <Button
            variant="outline"
            onClick={() => navigate(`/owners/${id}/edit`)}
            className="shadow-sm hover:bg-accent transition-all active:scale-95"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/*  Left Column: Contact Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-md border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ContactItem icon={<Phone />} label="Phone" value={owner.phone} />
              <ContactItem
                icon={<Mail />}
                label="Email"
                value={owner.email || "No email provided"}
              />
              <ContactItem
                icon={<MapPin />}
                label="Address"
                value={
                  owner.address?.street
                    ? `${owner.address.street}, ${owner.address.city}`
                    : "No address registered"
                }
              />
            </CardContent>
          </Card>
        </div>

        {/*  Right Column: Pets List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary" />
              Registered Patients
            </h2>
            {user?.role !== "vet" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-primary hover:bg-primary/5 font-semibold"
                onClick={() => navigate(`/pets/new?ownerId=${id}`)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Patient
              </Button>
            )}
          </div>

          {petsLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : pets.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <PawPrint className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="font-medium text-lg">No pets found</h3>
                <p className="text-muted-foreground max-w-[250px] mb-4">
                  This owner doesn't have any pets registered in the system yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform" />

                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <PawPrint className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {pet.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize">
                      <span className="font-medium text-foreground/80">
                        {pet.species}
                      </span>
                      {pet.breed && (
                        <>
                          <span className="text-muted-foreground/40 text-xs">
                            |
                          </span>
                          <span className="truncate">{pet.breed}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <GenderBadge gender={pet.gender} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }) {
  return (
    <div className="group flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        <span className="p-1 rounded bg-muted text-muted-foreground group-hover:text-primary transition-colors">
          {cloneElement(icon, { size: 12 })}
        </span>
        {label}
      </div>
      <p className="text-sm font-medium pl-7 text-foreground/90 leading-relaxed">
        {value}
      </p>
    </div>
  );
}

function GenderBadge({ gender }) {
  const styles = {
    male: "bg-blue-50 text-blue-600 border-blue-100",
    female: "bg-pink-50 text-pink-600 border-pink-100",
    default: "bg-gray-50 text-gray-600 border-gray-100",
  };

  const currentStyle = styles[gender?.toLowerCase()] || styles.default;

  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-tighter ${currentStyle}`}
    >
      {gender}
    </span>
  );
}

import { cloneElement } from "react";
