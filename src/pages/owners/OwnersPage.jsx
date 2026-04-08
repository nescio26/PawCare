import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOwners, useDeleteOwner } from "../../hooks/useOwners.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";
import {
  Plus,
  Search,
  Phone,
  Mail,
  ChevronRight,
  Trash2,
  Users,
  Home,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

export default function OwnersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useOwners(search);
  const { mutate: deleteOwner } = useDeleteOwner();

  const owners = data?.data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      {/* 1. Breadcrumbs */}
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
            <BreadcrumbPage>Owners</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Header with Fixed Description (using span instead of div) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader
          title="Owners"
          description={
            <span className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4" />
              {owners.length} registered clients
            </span>
          }
        />
        {user?.role !== "vet" && (
          <Button
            onClick={() => navigate("/owners/new")}
            className="shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
        )}
      </div>

      {/* 3. Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search by name, phone, or email..."
          className="pl-10 h-11 bg-background border-border/60 shadow-sm focus-visible:ring-primary/20 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 4. Owners List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : owners.length === 0 ? (
        <EmptyState
          title="No owners found"
          description={
            search
              ? `No results for "${search}"`
              : "Your client database is currently empty."
          }
          action={
            user?.role !== "vet" && (
              <Button onClick={() => navigate("/owners/new")} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Register New Owner
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-3">
          {owners.map((owner) => (
            <Card
              key={owner._id}
              className="group relative overflow-hidden border-border/50 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer"
              onClick={() => navigate(`/owners/${owner._id}`)}
            >
              <CardContent className="flex items-center gap-5 p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="text-lg font-bold">
                    {owner.name?.substring(0, 1).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                    {owner.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Phone className="w-3.5 h-3.5" />
                      {owner.phone}
                    </div>
                    {owner.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        {owner.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {user?.role === "admin" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Permanently delete this owner?")) {
                          deleteOwner(owner._id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
