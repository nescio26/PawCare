import { useAuthStore } from "../../store/authStore.js";
import { useTodayVisits } from "../../hooks/useVisits.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import StatCard from "../../components/shared/StatCard.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { formatTime } from "../../utils/formatDate.js";
import { cn } from "../../utils/cn.js";

const statusColors = {
  waiting:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200/50",
  "in-progress":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50",
  done: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200/50",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50",
};

export default function VetDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading } = useTodayVisits();

  const visits = data?.data || [];
  const waiting = visits.filter((v) => v.status === "waiting").length;
  const inProgress = visits.filter((v) => v.status === "in-progress").length;
  const done = visits.filter((v) => v.status === "done").length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={`Welcome back, Dr. ${user?.name.split(" ")[0]}`}
        description="Here is what your patient queue looks like today."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Waiting"
          value={waiting}
          icon={Clock}
          className="border-l-4 border-l-yellow-400 shadow-sm hover:shadow-md transition-shadow"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Stethoscope}
          className="border-l-4 border-l-blue-400 shadow-sm hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Completed"
          value={done}
          icon={CheckCircle}
          className="border-l-4 border-l-green-400 shadow-sm hover:shadow-md transition-shadow"
        />
      </div>

      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-muted/5">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight">
              Today's Queue
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Manage your assigned medical appointments
            </p>
          </div>
          <Badge variant="outline" className="rounded-md font-mono px-3">
            {visits.length} Total
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-450px)] min-h-[400px]">
            {visits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No patients in the queue
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Enjoy your break!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {visits.map((visit) => (
                  <div
                    key={visit._id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    {/* Queue Indicator */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <span className="text-[10px] font-bold uppercase tracking-tighter leading-none opacity-60">
                          No
                        </span>
                        <span className="text-lg font-black leading-none">
                          {visit.queueNo}
                        </span>
                      </div>

                      {/* Mobile Title View */}
                      <div className="sm:hidden flex-1">
                        <h4 className="font-bold text-base leading-tight">
                          {visit.pet?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {visit.pet?.species}
                        </p>
                      </div>
                    </div>

                    {/* Details Info */}
                    <div className="flex-1 min-w-0">
                      <div className="hidden sm:flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-foreground">
                          {visit.pet?.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 uppercase h-4"
                        >
                          {visit.pet?.species}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <Users className="w-3.5 h-3.5" />
                          {visit.owner?.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(visit.visitDate)}
                        </span>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-dashed">
                      <span
                        className={cn(
                          "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border shadow-xs",
                          statusColors[visit.status],
                        )}
                      >
                        {visit.status}
                      </span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted opacity-0 group-hover:opacity-100 transition-all hidden sm:flex">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
