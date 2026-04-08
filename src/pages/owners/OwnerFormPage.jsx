import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useOwner,
  useCreateOwner,
  useUpdateOwner,
} from "../../hooks/useOwners.js";

// Components
import FormGroup from "../../components/shared/FormGroup.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb.jsx";

// Icons
import { ArrowLeft, Save, UserPlus, Home, User } from "lucide-react";

const ownerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone must be at least 8 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postcode: z.string().optional(),
    })
    .optional(),
});

export default function OwnerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: ownerData, isLoading } = useOwner(id);
  const { mutate: createOwner, isPending: creating } = useCreateOwner();
  const { mutate: updateOwner, isPending: updating } = useUpdateOwner();

  const owner = ownerData?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ownerSchema),
  });

  useEffect(() => {
    if (owner) reset(owner);
  }, [owner, reset]);

  const onSubmit = (data) => {
    if (isEdit) {
      updateOwner(
        { id, data },
        {
          onSuccess: () => navigate(`/owners/${id}`),
        },
      );
    } else {
      createOwner(data, {
        onSuccess: () => navigate("/owners"),
      });
    }
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-0 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/owners"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="h-3.5 w-3.5" /> Owners
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              {isEdit ? `Edit: ${owner?.name}` : "New Registration"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
          title={isEdit ? "Owner Profile" : "Owner Registration"}
          description={
            isEdit
              ? "Modify client details and contact settings"
              : "Add a new client to the database"
          }
        />
      </div>

      <Card className="border-border/60 shadow-xl shadow-black/5 overflow-hidden">
        <CardContent className="p-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="divide-y divide-border/40"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Identity & Contact
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="Full Name" error={errors.name}>
                  <Input
                    placeholder="e.g. Ahmad Abdullah"
                    {...register("name")}
                    className={
                      errors.name
                        ? "border-destructive ring-destructive/20"
                        : "focus-visible:ring-primary/20"
                    }
                  />
                </FormGroup>

                <FormGroup label="Phone Number" error={errors.phone}>
                  <Input
                    placeholder="0123456789"
                    {...register("phone")}
                    className={
                      errors.phone
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }
                  />
                </FormGroup>
              </div>

              <FormGroup label="Email Address (Optional)" error={errors.email}>
                <Input
                  type="email"
                  placeholder="ahmad@example.com"
                  {...register("email")}
                />
              </FormGroup>
            </div>

            {/* Section 2: Location */}
            <div className="p-6 bg-muted/30 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Mailing Address
                </h3>
              </div>

              <FormGroup label="Street Name">
                <Input
                  placeholder="123 Jalan Ampang"
                  {...register("address.street")}
                />
              </FormGroup>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormGroup label="City">
                  <Input
                    placeholder="Shah Alam"
                    {...register("address.city")}
                  />
                </FormGroup>
                <FormGroup label="State">
                  <Input
                    placeholder="Selangor"
                    {...register("address.state")}
                  />
                </FormGroup>
                <FormGroup label="Postcode">
                  <Input
                    placeholder="40150"
                    {...register("address.postcode")}
                  />
                </FormGroup>
              </div>
            </div>

            {/* 4. Sticky-ready Action Footer */}
            <div className="p-6 bg-background flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                // Removed the heavy red background to keep the "Ghost" look clean
                // but kept a subtle red hover effect to signal 'danger'
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                disabled={creating || updating}
              >
                Discard Changes
              </Button>

              <Button
                type="submit"
                disabled={creating || updating}
                className="px-8 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                {creating || updating ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner className="h-4 w-4" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isEdit ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    {isEdit ? "Update Profile" : "Register Owner"}
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

// 5. Helper component to clean up repeating logic and improve spacing consistency
