import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hooks
import { usePet, useCreatePet, useUpdatePet } from "../../hooks/usePets.js";
import { useOwners } from "../../hooks/useOwners.js";

// UI & Icons
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
import { ArrowLeft, Loader2, PawPrint, User, Info } from "lucide-react";

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Required"),
  breed: z.string().min(1, "Breed is required"),
  gender: z.enum(["male", "female", "unknown"]),
  dateOfBirth: z.string().optional(),
  weight: z.coerce.number().positive().optional(),
  color: z.string().optional(),
  microchipNo: z.string().optional(),
  owner: z.string().min(1, "Owner is required"),
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
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full border shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader
          title={isEdit ? "Edit Patient" : "New Patient"}
          description={
            isEdit
              ? `Updating records for ${petData?.data?.name}`
              : "Register a new pet to the system"
          }
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Section 1: Owner Selection */}
        <Card className="border-primary/10 shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-6 py-3 border-b flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Owner Assignment
            </h3>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Select Owner
              </Label>
              <Select
                value={watch("owner")}
                onValueChange={(v) => setValue("owner", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Search and select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner._id} value={owner._id}>
                      {owner.name}{" "}
                      <span className="text-muted-foreground ml-2 text-xs">
                        ({owner.phone})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.owner && (
                <p className="text-xs text-destructive">
                  {errors.owner.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Pet Details */}
        <Card className="shadow-md border-primary/5">
          <div className="bg-muted/30 px-6 py-3 border-b flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Pet Identity
            </h3>
          </div>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Pet Name
                </Label>
                <Input
                  placeholder="e.g. Luna"
                  className="h-11"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Species
                </Label>
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
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Breed
                </Label>
                <Input
                  placeholder="e.g. Golden Retriever"
                  className="h-11"
                  {...register("breed")}
                />
                {errors.breed && (
                  <p className="text-xs text-destructive">
                    {errors.breed.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">
                    Gender
                  </Label>
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
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="h-11"
                    {...register("weight")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  className="h-11"
                  {...register("dateOfBirth")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  Microchip No <Info className="w-3 h-3 opacity-50" />
                </Label>
                <Input
                  placeholder="15-digit number"
                  className="h-11"
                  {...register("microchipNo")}
                />
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="min-w-[140px] shadow-lg shadow-primary/20"
                disabled={isBusy}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Records"
                ) : (
                  "Register Patient"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
