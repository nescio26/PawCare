import { useNavigate } from "react-router-dom";
import { useTodayVisits } from "../../hooks/useVisits.js";
import { useQueue } from "../../hooks/useQueue.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import StatCard from "../../components/shared/StatCard.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Plus,
  Activity,
  Users,
} from "lucide-react";
import { formatTime } from "../../utils/formatDate.js";
import { cn } from "../../utils/cn.js";

const statusColors = {
  waiting:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  "in-progress":
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  done: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  cancelled:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useTodayVisits();
  const { isConnected } = useQueue();

  const visits = data?.data || [];
  const waiting = visits.filter((v) => v.status === "waiting").length;
  const inProgress = visits.filter((v) => v.status === "in-progress").length;
  const done = visits.filter((v) => v.status === "done").length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Responsive Header: Stack on mobile, row on desktop */}
      <PageHeader
        title="Staff Dashboard"
        description="Daily clinic operations overview"
        action={
          <Button
            onClick={() => navigate("/visits/new")}
            className="w-full sm:w-auto shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Visit
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Waiting"
          value={waiting}
          icon={Clock}
          className="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Activity}
          className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100"
        />
        <StatCard
          title="Done"
          value={done}
          icon={CheckCircle}
          className="bg-green-50/50 dark:bg-green-900/10 border-green-100"
        />
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-bold">Today's Visits</CardTitle>

          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors",
              isConnected
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-red-50 text-red-600 border-red-100",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500",
              )}
            />
            {isConnected ? "Live Queue Sync" : "Sync Offline"}
          </div>
        </CardHeader>

        <CardContent>
          {visits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Plus className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-semibold text-foreground">No visits today</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                Check in a pet using the "New Visit" button above
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {visits.map((visit) => (
                <div
                  key={visit._id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Queue Number Badge */}
                    <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase opacity-70">
                        No.
                      </span>
                      <span className="text-lg font-black leading-none">
                        {visit.queueNo}
                      </span>
                    </div>

                    <div className="sm:hidden">
                      <p className="font-bold text-base">{visit.pet?.name}</p>
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {visit.pet?.species}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="hidden sm:flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground truncate">
                        {visit.pet?.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium py-0 h-4 uppercase"
                      >
                        {visit.pet?.species}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {visit.owner?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {formatTime(visit.visitDate)}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center justify-between sm:justify-end border-t sm:border-none mt-2 sm:mt-0 pt-3 sm:pt-0">
                    <span
                      className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                        statusColors[visit.status],
                      )}
                    >
                      {visit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
