import { useEffect } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hooks
import { usePet, useCreatePet, useUpdatePet } from "../../hooks/usePets.js";
import { useOwners } from "../../hooks/useOwners.js";

// UI Components
import FormGroup from "@/components/shared/FormGroup.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
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
  Save,
  PawPrint,
  User,
  Home,
  Info,
  Loader2,
  Target,
} from "lucide-react";

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Required"),
  breed: z.string().min(1, "Breed is required"),
  gender: z.enum(["male", "female", "unknown"]),
  dateOfBirth: z.string().optional(),
  weight: z.coerce.number().positive().optional(),
  color: z.string().optional(),
  microchipNo: z.string().optional(),
  owner: z.string().min(1, "Owner assignment is required"),
});

export default function PetFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const preselectedOwner = searchParams.get("ownerId");

  const { data: petData, isLoading } = usePet(id);
  const { data: ownersData } = useOwners();
  const { mutate: createPet, isPending: creating } = useCreatePet();
  const { mutate: updatePet, isPending: updating } = useUpdatePet();

  const owners = ownersData?.data || [];
  const isBusy = creating || updating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      gender: "unknown",
      species: "dog",
      owner: preselectedOwner || "",
    },
  });

  useEffect(() => {
    if (petData?.data) {
      const pet = petData.data;
      reset({
        ...pet,
        owner: pet.owner?._id || pet.owner,
        dateOfBirth: pet.dateOfBirth
          ? new Date(pet.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [petData, reset]);

  const onSubmit = (data) => {
    const payload = { ...data, weight: data.weight || undefined };
    if (isEdit) {
      updatePet(
        { id, data: payload },
        { onSuccess: () => navigate(`/pets/${id}`) },
      );
    } else {
      createPet(payload, { onSuccess: () => navigate("/pets") });
    }
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-0 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Breadcrumbs */}
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/pets"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="h-3.5 w-3.5" /> Patients
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              {isEdit ? `Edit: ${petData?.data?.name}` : "New Patient"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Header with consistent back button */}
      <div className="flex items-start gap-5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-xl border-border bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent hover:text-accent-foreground shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title={isEdit ? "Patient Profile" : "New Registration"}
          description={
            isEdit
              ? `Updating health records for ${petData?.data?.name}`
              : "Register a new pet and assign a primary owner"
          }
        />
      </div>

      {/* 3. Main Form Card - Matching Owner UI */}
      <Card className="border-border/60 shadow-xl shadow-black/5 overflow-hidden">
        <CardContent className="p-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="divide-y divide-border/40"
          >
            {/* Section 1: Owner  */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Owner
                </h3>
              </div>

              <FormGroup label="Select Primary Owner" error={errors.owner}>
                <Select
                  value={watch("owner")}
                  onValueChange={(v) => setValue("owner", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Search for owner by name or phone" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner._id} value={owner._id}>
                        {owner.name}{" "}
                        <span className="text-muted-foreground/60 ml-1 text-xs">
                          ({owner.phone})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormGroup>
            </div>

            {/* Section 2: Pet Details */}
            <div className="p-6 bg-muted/30 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Patient Identity
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="Pet Name" error={errors.name}>
                  <Input placeholder="e.g. Luna" {...register("name")} />
                </FormGroup>

                <FormGroup label="Species">
                  <Select
                    value={watch("species")}
                    onValueChange={(v) => setValue("species", v)}
                  >
                    <SelectTrigger className="h-11 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["dog", "cat", "bird", "rabbit", "reptile", "other"].map(
                        (s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Breed" error={errors.breed}>
                  <Input
                    placeholder="e.g. Golden Retriever"
                    {...register("breed")}
                  />
                </FormGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label="Gender">
                    <Select
                      value={watch("gender")}
                      onValueChange={(v) => setValue("gender", v)}
                    >
                      <SelectTrigger className="h-11 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormGroup>
                  <FormGroup label="Weight (kg)">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...register("weight")}
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Date of Birth">
                  <Input type="date" {...register("dateOfBirth")} />
                </FormGroup>

                <FormGroup label="Microchip No. (Optional)">
                  <div className="relative">
                    <Input
                      placeholder="15-digit number"
                      {...register("microchipNo")}
                    />
                    <Info className="absolute right-3 top-3 h-4 w-4 text-muted-foreground/40" />
                  </div>
                </FormGroup>
              </div>
            </div>

            {/* Section 4: Action Footer */}
            <div className="p-6 bg-background flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                disabled={isBusy}
              >
                Discard Changes
              </Button>

              <Button
                type="submit"
                disabled={isBusy}
                className="px-8 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 min-w-[160px]"
              >
                {isBusy ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isEdit ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Target className="h-4 w-4" />
                    )}
                    {isEdit ? "Update Records" : "Register Patient"}
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
