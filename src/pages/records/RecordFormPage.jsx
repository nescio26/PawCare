import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateRecord } from "../../hooks/useRecords.js";
import { useUsers } from "../../hooks/useUsers.js";
import { useAuthStore } from "../../store/authStore.js";

// UI Components
import PageHeader from "../../components/shared/PageHeader.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Textarea } from "../../components/ui/textarea.jsx";
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
  Plus,
  Trash2,
  Home,
  FileText,
  Activity,
  Pill,
  Calendar,
} from "lucide-react";

const recordSchema = z.object({
  visit: z.string().min(1, "Visit is required"),
  pet: z.string().min(1, "Pet is required"),
  vet: z.string().min(1, "Vet is required"),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z
    .array(
      z.object({
        medicine: z.string().min(1, "Medicine name required"),
        dosage: z.string().min(1, "Dosage required"),
        duration: z.string().min(1, "Duration required"),
      }),
    )
    .optional(),
  weight: z.coerce.number().positive().optional(),
  temperature: z.coerce.number().positive().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
});

export default function RecordFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const visitId = searchParams.get("visitId");
  const petId = searchParams.get("petId");

  const { data: usersData } = useUsers();
  const { mutate: createRecord, isPending } = useCreateRecord();

  const vets = (usersData?.data || []).filter((u) => u.role === "vet");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      visit: visitId || "",
      pet: petId || "",
      vet: user?.role === "vet" ? user?.id : "",
      prescription: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescription",
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      weight: data.weight || undefined,
      temperature: data.temperature || undefined,
    };
    createRecord(payload, {
      onSuccess: () => navigate("/records"),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <BreadcrumbLink asChild>
              <Link to="/records">Medical Records</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Entry</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Header */}
      <PageHeader
        title="New Medical Record"
        description="Fill out the clinical details and treatment plan for this patient."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Assignment & Vitals */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/40 shadow-sm overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 border-b border-primary/10 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                  Assignment & Vitals
                </h3>
              </div>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold">Attending Vet</Label>
                  <Select
                    value={watch("vet")}
                    onValueChange={(v) => setValue("vet", v)}
                  >
                    <SelectTrigger className="rounded-xl border-border/60">
                      <SelectValue placeholder="Select vet" />
                    </SelectTrigger>
                    <SelectContent>
                      {vets.map((vet) => (
                        <SelectItem key={vet._id} value={vet._id}>
                          {vet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vet && (
                    <p className="text-[10px] font-bold text-destructive uppercase">
                      {errors.vet.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground">
                      Weight (kg)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="3.5"
                      className="rounded-xl"
                      {...register("weight")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground">
                      Temp (°C)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="38.5"
                      className="rounded-xl"
                      {...register("temperature")}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2 border-t border-dashed">
                  <Label className="font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary/60" /> Follow-up
                  </Label>
                  <Input
                    type="date"
                    className="rounded-xl"
                    {...register("followUpDate")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Clinical Notes */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <div className="bg-muted/30 px-4 py-3 border-b flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Clinical Examination
                </h3>
              </div>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Symptoms</Label>
                  <Textarea
                    placeholder="Describe the clinical signs observed..."
                    className="min-h-[80px] rounded-xl focus-visible:ring-primary/20"
                    {...register("symptoms")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-emerald-700">
                    Diagnosis
                  </Label>
                  <Textarea
                    placeholder="Diagnosis conclusion..."
                    className="min-h-[80px] rounded-xl border-emerald-100 bg-emerald-50/10 focus-visible:ring-emerald-200"
                    {...register("diagnosis")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Treatment Plan</Label>
                    <Textarea
                      placeholder="Procedures or instructions..."
                      className="min-h-[100px] rounded-xl"
                      {...register("treatment")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Internal Notes</Label>
                    <Textarea
                      placeholder="Observations for clinic staff..."
                      className="min-h-[100px] rounded-xl"
                      {...register("notes")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prescription Section */}
            <Card className="border-border/40 shadow-sm">
              <div className="bg-amber-50/50 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-amber-700">
                    Prescription
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 border-amber-200 text-amber-700 hover:bg-amber-100"
                  onClick={() =>
                    append({ medicine: "", dosage: "", duration: "" })
                  }
                >
                  <Plus className="w-3 h-3 mr-1.5" />
                  Add Medicine
                </Button>
              </div>

              <CardContent className="pt-6">
                {fields.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-2xl border-muted-foreground/10 bg-muted/5">
                    <Pill className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">
                      No medication prescribed for this visit.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-muted/20 border border-border/40 rounded-2xl items-end group relative"
                      >
                        <div className="md:col-span-5 space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                            Medicine Name
                          </Label>
                          <Input
                            placeholder="e.g. Amoxicillin"
                            className="h-9 rounded-lg bg-background"
                            {...register(`prescription.${index}.medicine`)}
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                            Dosage
                          </Label>
                          <Input
                            placeholder="e.g. 250mg 2x daily"
                            className="h-9 rounded-lg bg-background"
                            {...register(`prescription.${index}.dosage`)}
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                            Duration
                          </Label>
                          <Input
                            placeholder="e.g. 7 days"
                            className="h-9 rounded-lg bg-background"
                            {...register(`prescription.${index}.duration`)}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="px-8 h-11 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isPending ? "Saving..." : "Save Clinical Record"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-xl font-bold text-muted-foreground"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
