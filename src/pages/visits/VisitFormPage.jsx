import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hooks
import { useCreateVisit } from "../../hooks/useVisits.js";
import { useOwners } from "../../hooks/useOwners.js";
import { usePetsByOwner } from "../../hooks/usePets.js";

// Components
import FormGroup from "../../components/shared/FormGroup.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";

// Icons
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  User,
  Dog,
  Stethoscope,
} from "lucide-react";

const visitSchema = z.object({
  pet: z.string().min(1, "Please select a pet"),
  owner: z.string().min(1, "Please select an owner"),
  reason: z.string().optional(),
});

export default function VisitFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPet = searchParams.get("petId");
  const preselectedOwner = searchParams.get("ownerId");

  const [selectedOwner, setSelectedOwner] = useState(preselectedOwner || "");
  const { data: ownersData, isLoading: loadingOwners } = useOwners();
  const { data: petsData, isLoading: loadingPets } =
    usePetsByOwner(selectedOwner);
  const { mutate: createVisit, isPending: isCheckingIn } = useCreateVisit();

  const owners = ownersData?.data || [];
  const pets = petsData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      owner: preselectedOwner || "",
      pet: preselectedPet || "",
    },
  });

  // Watch values for reactive UI
  const watchedOwner = watch("owner");
  const watchedPet = watch("pet");

  useEffect(() => {
    if (preselectedOwner) {
      setSelectedOwner(preselectedOwner);
      setValue("owner", preselectedOwner);
    }
    if (preselectedPet) {
      setValue("pet", preselectedPet);
    }
  }, [preselectedOwner, preselectedPet, setValue]);

  const onSubmit = (data) => {
    createVisit(data, {
      onSuccess: () => navigate("/visits"),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-0 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Breadcrumbs */}
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/visits"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="h-3.5 w-3.5" /> Visits
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              New Check-in
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Header */}
      <div className="flex items-start gap-5 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-xl border-border bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title="New Check-in"
          description="Register a patient arrival and reason for visit"
        />
      </div>

      {/* 3. Form Card */}
      <Card className="border-border/60 shadow-xl shadow-black/5 overflow-hidden">
        <CardContent className="p-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="divide-y divide-border/40"
          >
            {/* Section: Client & Patient Selection */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Registration Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="Client / Owner" error={errors.owner}>
                  <Select
                    value={watchedOwner}
                    onValueChange={(v) => {
                      setValue("owner", v);
                      setSelectedOwner(v);
                      setValue("pet", ""); // Reset pet when owner changes
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select owner" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner._id} value={owner._id}>
                          {owner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Patient / Pet" error={errors.pet}>
                  <Select
                    value={watchedPet}
                    onValueChange={(v) => setValue("pet", v)}
                    disabled={!selectedOwner || loadingPets}
                  >
                    <SelectTrigger className="bg-background">
                      <div className="flex items-center gap-2">
                        <Dog className="h-4 w-4 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            loadingPets
                              ? "Loading..."
                              : selectedOwner
                                ? "Select pet"
                                : "Select owner first"
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet._id} value={pet._id}>
                          {pet.name} ({pet.species})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormGroup>
              </div>
            </div>

            {/* Section: Clinical Reason */}
            <div className="p-6 bg-muted/30 space-y-6">
              <FormGroup label="Reason for Visit (Optional)">
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 bg-background"
                    placeholder="e.g. Vaccination, persistent cough, etc."
                    {...register("reason")}
                  />
                </div>
              </FormGroup>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-background flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isCheckingIn}
                className="px-8 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                {isCheckingIn ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner className="h-4 w-4" /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Complete Check-in
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
