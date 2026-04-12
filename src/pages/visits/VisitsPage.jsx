import { useNavigate, Link } from "react-router-dom";
import { useTodayVisits } from "../../hooks/useVisits.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import {
  Plus,
  Clock,
  User,
  ChevronRight,
  Stethoscope,
  Home,
  ClipboardList,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { formatTime } from "../../utils/formatDate.js";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";

const statusConfig = {
  waiting: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Waiting",
  },
  "in-progress": {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "In Consultation",
  },
  done: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Completed",
  },
  cancelled: {
    color: "bg-slate-50 text-slate-500 border-slate-200",
    label: "Cancelled",
  },
};

export default function VisitsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useTodayVisits();

  const visits = data?.data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
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
            <BreadcrumbPage>Visits Log</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* 2. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <PageHeader
          title="Daily Queue"
          description={new Date().toLocaleDateString("en-MY", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        />

        {user?.role !== "vet" && (
          <Button
            onClick={() => navigate("/visits/new")}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 rounded-xl px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Check-in
          </Button>
        )}
      </div>

      {/* 3. Main Content */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : visits.length === 0 ? (
        <EmptyState
          title="Queue is empty"
          description="There are no patients checked in for today yet."
          action={
            user?.role !== "vet" && (
              <Button
                onClick={() => navigate("/visits/new")}
                variant="outline"
                className="rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Visit
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-3">
          {/* Quick Summary Badge (Optional Polish) */}
          <div className="flex justify-end">
            <span className="text-[10px] font-black text-muted-foreground bg-muted/50 px-3 py-1 rounded-full uppercase tracking-tighter">
              Total: {visits.length} Appointments Today
            </span>
          </div>

          {visits.map((visit) => {
            const config = statusConfig[visit.status] || statusConfig.waiting;

            return (
              <Card
                key={visit._id}
                className="group border-border/50 hover:border-primary/40 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => navigate(`/visits/${visit._id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4 md:p-5">
                    {/* Queue "Token" */}
                    <div className="w-14 h-14 rounded-xl bg-primary/5 flex flex-col items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <span className="text-[10px] uppercase font-black opacity-60">
                        No
                      </span>
                      <span className="text-xl font-black leading-none">
                        {visit.queueNo}
                      </span>
                    </div>

                    {/* Patient & Owner Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                          {visit.pet?.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-muted text-muted-foreground font-black uppercase tracking-tighter">
                          {visit.pet?.species}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary/60" />{" "}
                          {visit.owner?.name}
                        </span>
                        {visit.reason && (
                          <>
                            <span className="opacity-30">|</span>
                            <span className="truncate italic flex items-center gap-1.5">
                              <Stethoscope className="h-3.5 w-3.5 text-primary/60" />{" "}
                              {visit.reason}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status & Time */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div
                        className={`text-[10px] font-black px-3 py-1 rounded-lg border ${config.color} uppercase tracking-tight`}
                      >
                        {config.label}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(visit.visitDate)}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Subtle Progress Strip for active visits */}
                  {visit.status === "in-progress" && (
                    <div className="h-1 w-full bg-blue-100/50">
                      <div
                        className="h-full bg-blue-500 animate-pulse"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
