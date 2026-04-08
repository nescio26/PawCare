import { useNavigate, useParams } from "react-router-dom";
import { useOwner } from "../../hooks/useOwners.js";
import { usePetsByOwner } from "../../hooks/usePets.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import Breadcrumbs from "../../components/shared/Breadcrumbs.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Phone, Mail, MapPin, Edit, Plus, PawPrint } from "lucide-react";
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
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs
        items={[{ label: "Owners", href: "/owners" }, { label: owner.name }]}
      />

      <PageHeader
        title={owner.name}
        description="Owner profile and registered pets"
        action={
          user?.role !== "vet" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/owners/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Contact information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{owner.phone}</span>
          </div>
          {owner.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{owner.email}</span>
            </div>
          )}
          {owner.address?.street && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>
                {[
                  owner.address.street,
                  owner.address.city,
                  owner.address.state,
                  owner.address.postcode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Registered pets</CardTitle>
          {user?.role !== "vet" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/pets/new?ownerId=${id}`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Pet
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {petsLoading ? (
            <LoadingSpinner />
          ) : pets.length === 0 ? (
            <EmptyState
              title="No pets registered"
              description="Add a pet for this owner"
            />
          ) : (
            <div className="space-y-2">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => navigate(`/pets/${pet._id}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <PawPrint className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{pet.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {pet.species} {pet.breed ? `· ${pet.breed}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      pet.gender === "male"
                        ? "bg-blue-100 text-blue-700"
                        : pet.gender === "female"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {pet.gender}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
