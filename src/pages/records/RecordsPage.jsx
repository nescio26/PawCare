import { Link, useNavigate } from "react-router-dom";
import { useTodayVisits } from "../../hooks/useVisits.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";
import { Plus, Home } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import VisitRecordRow from "./VisitRecordRow.jsx";

export default function RecordsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useTodayVisits();

  const visits = data?.data || [];
  const doneVisits = visits.filter((v) => v.status === "done");

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
            <BreadcrumbPage>Medical Records</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
        <div className="py-20 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : doneVisits.length === 0 ? (
        <EmptyState
          title="No Complete Visits Today"
          description="Records are automatically ready for entry once a visit is marked as 'Done'"
        />
      ) : (
        <div className="grid gap-3">
          {" "}
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
