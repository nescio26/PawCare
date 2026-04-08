import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { formatTime } from "../../utils/formatDate.js";
import VetSelector from "@/components/shared/VetSelector.jsx";
import {
  Clock,
  User,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

const statusStyles = {
  waiting: {
    card: "border-l-4 border-l-amber-400 bg-white hover:bg-amber-50/10",
    badge: "bg-amber-100 text-amber-700",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  "in-progress": {
    card: "border-l-4 border-l-blue-600 bg-blue-50/20 hover:bg-blue-50/40 shadow-blue-100/50",
    badge: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100 text-blue-600 border-blue-200",
  },
};

const nextStatus = { waiting: "in-progress", "in-progress": "done" };
const nextStatusLabel = { waiting: "Start", "in-progress": "Complete" };

export default function QueueCard({
  visit,
  user,
  isPending,
  selectedVet,
  setSelectedVet,
  onUpdate,
}) {
  const canUpdate = user?.role === "admin" || user?.role === "vet";
  const styles = statusStyles[visit.status] || statusStyles.waiting;
  const next = nextStatus[visit.status];

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${styles.card} border-border rounded-2xl`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border shadow-sm ${styles.iconBg}`}
            >
              <span className="text-[10px] font-black opacity-50 uppercase leading-none mb-1">
                Queue
              </span>
              <span className="text-2xl font-black leading-none">
                {visit.queueNo}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                {visit.pet?.name}
              </h4>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                {visit.pet?.species}{" "}
                {visit.pet?.breed && `• ${visit.pet.breed}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1 justify-end uppercase">
              <Clock className="h-3 w-3 text-primary" />{" "}
              {formatTime(visit.visitDate)}
            </div>
            <div
              className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${styles.badge}`}
            >
              {visit.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 bg-muted/10 -mx-5 px-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground/60 flex items-center gap-1">
              <User size={10} className="text-primary" /> Owner
            </span>
            <p className="text-sm font-bold truncate">{visit.owner?.name}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground/60 flex items-center gap-1">
              <Stethoscope size={10} className="text-primary" /> Reason
            </span>
            <p className="text-sm font-bold truncate italic text-foreground/80">
              "{visit.reason || "Routine Check"}"
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {visit.vet ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary truncate max-w-[120px]">
                Dr. {visit.vet.name?.split(" ")[0]}
              </span>
            </div>
          ) : (
            <div className="flex-1">
              {visit.status === "waiting" && canUpdate && (
                <VetSelector
                  visitId={visit._id}
                  selectedVet={selectedVet}
                  setSelectedVet={setSelectedVet}
                />
              )}
            </div>
          )}

          {canUpdate && next && (
            <Button
              size="sm"
              className={`font-black rounded-xl px-5 transition-all active:scale-95 h-10 ${visit.status === "in-progress" ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200" : "shadow-lg shadow-primary/20"}`}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
