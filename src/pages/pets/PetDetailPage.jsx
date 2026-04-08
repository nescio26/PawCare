import { cloneElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePet } from "../../hooks/usePets.js";
import { useVisitsByPet } from "../../hooks/useVisits.js";
import { useRecordsByPet } from "../../hooks/useRecords.js";
import { useAuthStore } from "../../store/authStore.js";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Separator } from "../../components/ui/separator.jsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import {
  Edit,
  Plus,
  PawPrint,
  Calendar,
  Weight,
  Fingerprint,
  Activity,
  FileText,
} from "lucide-react";

const statusVariants = {
  waiting: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  done: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: petData, isLoading: petLoading } = usePet(id);
  const { data: visitsData } = useVisitsByPet(id);
  const { data: recordsData } = useRecordsByPet(id);

  if (petLoading) return <LoadingSpinner />;

  const pet = petData?.data;
  const visits = visitsData?.data || [];
  const records = recordsData?.data || [];

  if (!pet)
    return (
      <EmptyState
        title="Pet not found"
        description="The patient record might have been removed."
      />
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title={pet.name}
          description={
            <span className="flex items-center gap-2 mt-1">
              {" "}
              {/* ← Changed to span */}
              <Badge variant="secondary" className="capitalize">
                {pet.species}
              </Badge>
              {pet.breed && (
                <span className="text-muted-foreground">· {pet.breed}</span>
              )}
            </span>
          }
        />
        {user?.role !== "vet" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/pets/${id}/edit`)}
            className="w-fit"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details & Owner */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Patient Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                icon={<PawPrint />}
                label="Gender"
                value={pet.gender}
                capitalize
              />
              <DetailItem
                icon={<Calendar />}
                label="Born"
                value={
                  pet.dateOfBirth ? formatDate(pet.dateOfBirth) : "Unknown"
                }
              />
              <DetailItem
                icon={<Weight />}
                label="Weight"
                value={pet.weight ? `${pet.weight} kg` : "N/A"}
              />
              <DetailItem
                icon={<Fingerprint />}
                label="Microchip"
                value={pet.microchipNo || "None"}
                isMono
              />
              <Separator />
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-3">
                  Primary Owner
                </p>
                <div
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border"
                  onClick={() => navigate(`/owners/${pet.owner?._id}`)}
                >
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs">
                      {pet.owner?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {pet.owner?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pet.owner?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History & Records */}
        <div className="md:col-span-2 space-y-6">
          {/* Visits Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Visit History
              </CardTitle>
              {user?.role !== "vet" && (
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-primary hover:text-primary hover:bg-primary/5"
                  onClick={() =>
                    navigate(
                      `/visits/new?petId=${id}&ownerId=${pet.owner?._id}`,
                    )
                  }
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Visit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="py-6 border-2 border-dashed rounded-xl text-center text-muted-foreground text-sm">
                  No visits recorded yet
                </div>
              ) : (
                <div className="space-y-3">
                  {visits.slice(0, 5).map((visit) => (
                    <div
                      key={visit._id}
                      className="flex items-center gap-4 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-xs font-black text-primary border border-primary/10">
                        #{visit.queueNo}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {visit.reason || "General Checkup"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(visit.visitDate)}{" "}
                          {visit.vet && `• Dr. ${visit.vet.name}`}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusVariants[visit.status]} border shadow-none`}
                      >
                        {visit.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Records Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Clinical Records
              </CardTitle>
              {user?.role !== "staff" && (
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-primary hover:text-primary hover:bg-primary/5"
                  onClick={() => navigate(`/records/new?petId=${id}`)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Record
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="py-6 border-2 border-dashed rounded-xl text-center text-muted-foreground text-sm">
                  No clinical notes available
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div
                      key={record._id}
                      className="relative pl-4 border-l-2 border-primary/20 space-y-1 py-1"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-foreground/90">
                          {record.diagnosis || "Consultation"}
                        </p>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded italic">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>
                      {record.symptoms && (
                        <p className="text-xs text-muted-foreground italic line-clamp-2">
                          "Symptoms: {record.symptoms}"
                        </p>
                      )}
                      {record.vet && (
                        <p className="text-[10px] font-semibold text-primary/70 uppercase tracking-tight">
                          Signed: Dr. {record.vet.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for cleaner detail rows
function DetailItem({ icon, label, value, capitalize, isMono }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <span className="p-1.5 rounded-md bg-muted group-hover:bg-primary/5 transition-colors">
          {cloneElement(icon, { className: "w-3.5 h-3.5" })}
        </span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span
        className={`text-sm font-semibold ${capitalize ? "capitalize" : ""} ${isMono ? "font-mono text-[11px]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
