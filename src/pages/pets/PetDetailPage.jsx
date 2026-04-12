import { cloneElement } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usePet } from "../../hooks/usePets.js";
import { useVisitsByPet } from "../../hooks/useVisits.js";
import { useRecordsByPet } from "../../hooks/useRecords.js";
import { useAuthStore } from "../../store/authStore.js";
import { formatDate } from "../../utils/formatDate.js";

// UI Components
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";

// Shared components
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

// Icons
import {
  Edit,
  Plus,
  PawPrint,
  Calendar,
  Weight,
  Fingerprint,
  Activity,
  FileText,
  Home,
  User,
  Clock,
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

  if (!pet) return <EmptyState title="Pet not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* 1. Breadcrumbs - Matching OwnerPage */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/pets" className="flex items-center gap-1">
                <Home className="h-3 w-3" /> Patients
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pet.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Action Header - Large Icon Box style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <PawPrint className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {pet.name}
              </h1>
              <Badge className="bg-[#009894] hover:bg-[#007a77] text-white border-none text-[10px] uppercase font-bold px-2 py-0.5">
                {pet.species}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm mt-0.5">
              {pet.breed || "Mixed Breed"} •
              <span className="text-primary font-medium capitalize">
                {pet.gender}
              </span>
            </p>
          </div>
        </div>

        {user?.role !== "vet" && (
          <Button
            variant="outline"
            onClick={() => navigate(`/pets/${id}/edit`)}
            className="shadow-sm hover:bg-accent transition-all active:scale-95"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 3. Left Column: Vitals & Owner Details */}
        <div className="space-y-6">
          <Card className="shadow-md border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Patient Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
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

              <Separator className="my-2" />

              {/* Owner Info Block */}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">
                  Primary Owner
                </p>
                <div
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => navigate(`/owners/${pet.owner?._id}`)}
                >
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {pet.owner?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                      {pet.owner?.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {pet.owner?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Right Column: History & Records */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-md border-border/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-slate-50/50">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#009894]" /> Visit History
              </CardTitle>
              {user?.role !== "vet" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:bg-primary/5 font-bold text-xs"
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
            <CardContent className="p-0">
              {visits.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No visits recorded yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {visits.slice(0, 5).map((visit) => (
                    <div
                      key={visit._id}
                      className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-200 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                        <span className="text-[10px] font-black text-slate-500 group-hover:text-primary">
                          #{visit.queueNo}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800">
                          {visit.reason || "General Checkup"}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {formatDate(visit.visitDate)}{" "}
                          {visit.vet && `• Dr. ${visit.vet.name}`}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusVariants[visit.status] || ""} text-[9px] font-black uppercase tracking-tighter px-2 py-0 border-none shadow-none`}
                      >
                        {visit.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Records Section */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <FileText className="h-5 w-5 text-primary" /> Clinical Notes
            </h2>
            {user?.role !== "staff" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-primary hover:bg-primary/5 font-bold text-xs"
                onClick={() => navigate(`/records/new?petId=${id}`)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Record
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground/60 text-sm">
                No clinical records found for this patient.
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record._id}
                  className="relative pl-6 border-l-2 border-primary/20 py-1 hover:border-primary transition-colors"
                >
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-2 shadow-[0_0_8px_rgba(0,152,148,0.5)]" />
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {record.diagnosis || "Consultation"}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase">
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                    {record.symptoms && (
                      <p className="text-xs text-slate-600 italic mb-3 leading-relaxed">
                        "{record.symptoms}"
                      </p>
                    )}
                    {record.vet && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/80 uppercase tracking-tight">
                        <User size={10} />
                        Signed by Dr. {record.vet.name}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, isMono }) {
  return (
    <div className="group flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
        <span className="p-1 rounded bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
          {cloneElement(icon, { size: 12 })}
        </span>
        {label}
      </div>
      <p
        className={`text-sm font-bold pl-7 text-slate-800 ${isMono ? "font-mono text-xs tracking-tight" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
