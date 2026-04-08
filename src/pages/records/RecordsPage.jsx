import { useNavigate } from "react-router-dom";
import { useTodayVisits } from "../../hooks/useVisits.js";
import { useRecordByVisit } from "../../hooks/useRecords.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Plus, FileText, ChevronRight, Stethoscope, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { formatDate } from "../../utils/formatDate.js";
import { Badge } from "../../components/ui/badge.jsx";
import { cn } from "../../utils/cn.js";

export default function RecordsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useTodayVisits();

  const visits = data?.data || [];
  const doneVisits = visits.filter((v) => v.status === "done");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Medical Records"
        description="Records from today's completed visits"
        action={
          user?.role !== "staff" && (
            <Button
              onClick={() => navigate("/records/new")}
              className="rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Record
            </Button>
          )
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : doneVisits.length === 0 ? (
        <EmptyState
          title="No completed visits today"
          description="Records are automatically ready for entry once a visit is marked as 'Done'."
        />
      ) : (
        <div className="grid gap-4">
          {doneVisits.map((visit) => (
            <VisitRecordRow
              key={visit._id}
              visit={visit}
              navigate={navigate}
              userRole={user?.role}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VisitRecordRow({ visit, navigate, userRole }) {
  const { data: recordData, isLoading: isRecordLoading } = useRecordByVisit(
    visit._id,
  );
  const record = recordData?.data;

  return (
    <Card
      className="group border-border/40 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() =>
        record
          ? navigate(`/records/${record._id}`)
          : navigate(
              `/records/new?visitId=${visit._id}&petId=${visit.pet?._id}`,
            )
      }
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4 sm:p-5">
          {/* Enhanced Icon Box */}
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
            <FileText className="w-6 h-6 transition-transform group-hover:scale-110" />
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-black text-base text-foreground tracking-tight truncate">
                {visit.pet?.name}
              </h4>
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0 h-4 uppercase font-bold tracking-widest bg-muted/50"
              >
                {visit.pet?.species}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <User className="w-3.5 h-3.5 text-primary/60" />
                {visit.owner?.name}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Stethoscope className="w-3.5 h-3.5 text-primary/60" />
                Dr. {visit.vet?.name || "Unassigned"}
              </span>
            </div>
          </div>

          {/* Status Badge & Action */}
          <div className="flex items-center gap-4 shrink-0">
            {isRecordLoading ? (
              <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
            ) : record ? (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                  Status
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 transition-colors uppercase text-[10px] font-black px-3 shadow-xs">
                  Completed
                </Badge>
              </div>
            ) : (
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">
                  Action
                </span>
                <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 transition-colors uppercase text-[10px] font-black px-3 shadow-xs">
                  Pending Entry
                </Badge>
              </div>
            )}

            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-primary/10 transition-all duration-300">
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Subtle Bottom Accent - only shows on hover */}
        <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-700" />
      </CardContent>
    </Card>
  );
}
