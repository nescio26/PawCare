import { useQueue } from "../../hooks/useQueue.js";
import { useUpdateVisitStatus } from "../../hooks/useVisits.js";
import { useUsers } from "../../hooks/useUsers.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { formatTime } from "../../utils/formatDate.js";
import {
  Wifi,
  WifiOff,
  Clock,
  User,
  Activity,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const statusStyles = {
  waiting: {
    card: "border-l-4 border-l-amber-400 bg-amber-50/30",
    badge: "bg-amber-100 text-amber-700",
    iconBg: "bg-amber-100 text-amber-600",
  },
  "in-progress": {
    card: "border-l-4 border-l-blue-500 bg-blue-50/30",
    badge: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100 text-blue-600",
  },
};

const nextStatus = {
  waiting: "in-progress",
  "in-progress": "done",
};

const nextStatusLabel = {
  waiting: "Start Consultation",
  "in-progress": "Mark as Done",
};

export default function QueuePage() {
  const { user } = useAuthStore();
  const { data, isLoading, isConnected } = useQueue();
  const { mutate: updateStatus, isPending } = useUpdateVisitStatus();
  const [selectedVet, setSelectedVet] = useState({});

  const queue = data?.data || [];
  const waiting = queue.filter((v) => v.status === "waiting");
  const inProgress = queue.filter((v) => v.status === "in-progress");

  const handleStatusUpdate = (visit) => {
    const next = nextStatus[visit.status];
    if (!next) return;

    const payload = { status: next };
    if (next === "in-progress" && selectedVet[visit._id]) {
      payload.vet = selectedVet[visit._id];
    }

    updateStatus({ id: visit._id, data: payload });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="Live Clinic Queue"
        description="Monitor and manage patient flow in real-time"
        action={
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
              isConnected
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              ></span>
            </span>
            {isConnected ? "System Live" : "Connection Lost"}
          </div>
        }
      />

      {queue.length === 0 ? (
        <EmptyState
          title="Queue is Clear"
          description="Enjoy the quiet! No active visits currently in the system."
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Waiting Column */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Clock className="w-4 h-4 text-amber-500" />
                Waiting Room
              </h3>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
                {waiting.length} Patients
              </span>
            </div>

            <div className="space-y-4">
              {waiting.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20 text-sm italic">
                  Waiting room is empty
                </div>
              ) : (
                waiting.map((visit) => (
                  <QueueCard
                    key={visit._id}
                    visit={visit}
                    user={user}
                    isPending={isPending}
                    selectedVet={selectedVet}
                    setSelectedVet={setSelectedVet}
                    onUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </div>
          </section>

          {/* In Progress Column */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Activity className="w-4 h-4 text-blue-500" />
                In Consultation
              </h3>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 shadow-sm">
                {inProgress.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {inProgress.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20 text-sm italic">
                  No active consultations
                </div>
              ) : (
                inProgress.map((visit) => (
                  <QueueCard
                    key={visit._id}
                    visit={visit}
                    user={user}
                    isPending={isPending}
                    selectedVet={selectedVet}
                    setSelectedVet={setSelectedVet}
                    onUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function QueueCard({
  visit,
  user,
  isPending,
  selectedVet,
  setSelectedVet,
  onUpdate,
}) {
  const canUpdate = user?.role === "admin" || user?.role === "vet";
  const styles = statusStyles[visit.status];
  const next = nextStatus[visit.status];

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${styles.card} border-border shadow-sm`}
    >
      <CardContent className="p-5 space-y-4">
        {/* Top Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-inner border border-black/5 ${styles.iconBg}`}
            >
              {visit.queueNo}
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight group-hover:text-primary">
                {visit.pet?.name}
              </h4>
              <p className="text-xs text-muted-foreground font-medium capitalize flex items-center gap-1 mt-0.5">
                {visit.pet?.species}{" "}
                {visit.pet?.breed && `• ${visit.pet.breed}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Checked In
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatTime(visit.visitDate)}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50 bg-white/40 -mx-5 px-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <User size={10} /> Owner
            </span>
            <p className="text-xs font-semibold truncate">
              {visit.owner?.name}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Activity size={10} /> Reason
            </span>
            <p className="text-xs font-semibold truncate">
              {visit.reason || "General Checkup"}
            </p>
          </div>
        </div>

        {/* Assignment/Actions */}
        <div className="pt-1 flex flex-col gap-3">
          {visit.vet && (
            <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-lg border border-primary/10">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={12} />
              </div>
              <span className="text-xs font-bold text-primary">
                Assigned: {visit.vet.name}
              </span>
            </div>
          )}

          {canUpdate && next && (
            <div className="flex items-center gap-2">
              {visit.status === "waiting" && (
                <VetSelector
                  visitId={visit._id}
                  selectedVet={selectedVet}
                  setSelectedVet={setSelectedVet}
                />
              )}
              <Button
                size="sm"
                className={`ml-auto font-bold transition-all active:scale-95 ${
                  visit.status === "in-progress"
                    ? "bg-green-600 hover:bg-green-700 shadow-green-200 shadow-lg"
                    : "shadow-lg"
                }`}
                disabled={isPending}
                onClick={() => onUpdate(visit)}
              >
                {nextStatusLabel[visit.status]}
                {visit.status === "waiting" ? (
                  <ArrowRight className="ml-2 w-4 h-4" />
                ) : (
                  <CheckCircle2 className="ml-2 w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function VetSelector({ visitId, selectedVet, setSelectedVet }) {
  const { data } = useUsers();
  const vets = (data?.data || []).filter((u) => u.role === "vet");

  return (
    <Select
      value={selectedVet[visitId] || ""}
      onValueChange={(v) =>
        setSelectedVet((prev) => ({ ...prev, [visitId]: v }))
      }
    >
      <SelectTrigger className="h-9 text-xs flex-1 bg-white shadow-sm border-border hover:border-primary/50 transition-colors">
        <SelectValue placeholder="Assign Doctor..." />
      </SelectTrigger>
      <SelectContent>
        {vets.map((vet) => (
          <SelectItem key={vet._id} value={vet._id}>
            <span className="font-medium">{vet.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
