import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueue } from "../../hooks/useQueue.js";
import { useUpdateVisitStatus } from "../../hooks/useVisits.js";
import { useAuthStore } from "../../store/authStore.js";

// Components
import QueueCard from "./QueueCard.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

// Icons
import {
  Clock,
  Activity,
  Zap,
  Stethoscope,
  Home,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

// The local transition logic used by handleStatusUpdate
const nextStatus = { waiting: "in-progress", "in-progress": "done" };

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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
        <Link
          to="/"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <Home className="h-3 w-3" /> Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 opacity-40" />
        <span className="text-foreground flex items-center gap-1">
          <LayoutGrid className="h-3 w-3" /> Live Queue
        </span>
      </nav>

      <div className="border-b pb-6">
        <PageHeader
          title="Live Clinic Queue"
          description="Monitor patient flow and manage active consultations"
          action={
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] md:text-xs font-black transition-all shadow-sm ${isConnected ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-rose-500"}`}
                ></span>
              </span>
              {isConnected ? "SYSTEM LIVE" : "CONNECTION LOST"}
            </div>
          }
        />
      </div>

      {queue.length === 0 ? (
        <EmptyState
          title="Queue is Clear"
          description="No active visits currently in the system."
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-2 items-start pt-2">
          {/* Waiting Room */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="flex items-center gap-2 font-black text-lg uppercase tracking-tight">
                <Clock className="w-5 h-5 text-amber-500" /> Waiting Room
              </h3>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase border border-amber-200">
                {waiting.length} PENDING
              </span>
            </div>
            <div className="space-y-4">
              {waiting.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] text-muted-foreground bg-muted/5 text-sm">
                  <Zap className="h-8 w-8 mb-2 opacity-20" />
                  <p className="italic font-medium">No one is waiting</p>
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

          {/* Active Sessions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="flex items-center gap-2 font-black text-lg uppercase tracking-tight text-blue-700">
                <Activity className="w-5 h-5" /> Active Sessions
              </h3>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase border border-blue-200">
                {inProgress.length} LIVE
              </span>
            </div>
            <div className="space-y-4">
              {inProgress.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] text-muted-foreground bg-muted/5 text-sm">
                  <Stethoscope className="h-8 w-8 mb-2 opacity-20" />
                  <p className="italic font-medium">No active consultations</p>
                </div>
              ) : (
                inProgress.map((visit) => (
                  <QueueCard
                    key={visit._id}
                    visit={visit}
                    user={user}
                    isPending={isPending}
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
