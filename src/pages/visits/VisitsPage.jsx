import { useNavigate } from "react-router-dom";
import { useTodayVisits } from "../../hooks/useVisits.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Plus } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { formatTime } from "../../utils/formatDate.js";

const statusColors = {
  waiting: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function VisitsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useTodayVisits();

  const visits = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's Visits"
        description="All check-ins for today"
        action={
          user?.role !== "vet" && (
            <Button onClick={() => navigate("/visits/new")} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Visit
            </Button>
          )
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : visits.length === 0 ? (
        <EmptyState
          title="No visits today"
          description="Check in a pet to get started"
          action={
            user?.role !== "vet" && (
              <Button onClick={() => navigate("/visits/new")} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Visit
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-3">
          {visits.map((visit) => (
            <Card key={visit._id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {visit.queueNo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {visit.pet?.name}
                    <span className="text-muted-foreground font-normal capitalize">
                      {" "}
                      · {visit.pet?.species}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {visit.owner?.name}
                    {visit.reason && ` · ${visit.reason}`}
                    {visit.vet && ` · ${visit.vet.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(visit.visitDate)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      statusColors[visit.status]
                    }`}
                  >
                    {visit.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
