import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useUsers,
  useUpdateUser,
  useDeactivateUser,
  useRegisterStaff,
  useChangePassword,
} from "../../hooks/useUsers.js";
import { useAuthStore } from "../../store/authStore.js";
import { useForm } from "react-hook-form";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
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
import {
  UserCog,
  Edit,
  UserX,
  Home,
  Mail,
  Calendar,
  Plus,
  UserPlus,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";

const roleConfig = {
  admin: {
    color: "bg-rose-50 text-rose-700 border-rose-100",
    label: "Administrator",
  },
  vet: {
    color: "bg-blue-50 text-blue-700 border-blue-100",
    label: "Veterinarian",
  },
  staff: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    label: "Clinic Staff",
  },
};

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const { data, isLoading } = useUsers();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();
  const { mutate: deactivateUser } = useDeactivateUser();
  const { mutate: registerStaff, isPending: registering } = useRegisterStaff();
  const { mutate: changePassword } = useChangePassword();

  const [editingUser, setEditingUser] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const users = data?.data || [];

  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const {
    register: registerNew,
    handleSubmit: handleNewSubmit,
    setValue: setNewValue,
    watch: watchNew,
    reset: resetNew,
    formState: { errors: newErrors },
  } = useForm();

  const openEdit = (user) => {
    setEditingUser(user);
    reset({ name: user.name, role: user.role, password: "" });
  };

  const onEditSubmit = (formData) => {
    const { password, ...rest } = formData;
    updateUser(
      { id: editingUser._id, data: rest },
      {
        onSuccess: () => {
          if (password) {
            changePassword(
              { id: editingUser._id, password },
              { onSuccess: () => setEditingUser(null) },
            );
          } else {
            setEditingUser(null);
          }
        },
      },
    );
  };

  const onAddSubmit = (data) => {
    registerStaff(data, {
      onSuccess: () => {
        setIsOpenModal(false);
        resetNew();
      },
    });
  };

  if (isLoading)
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );

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
            <BreadcrumbPage>Staff Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Staff Management"
        description="Manage clinic personnel, access levels, and account status."
        action={
          currentUser?.role === "admin" && (
            <Button
              onClick={() => setIsOpenModal(true)}
              className="rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          )
        }
      />

      {users.length === 0 ? (
        <EmptyState
          title="No staff members found"
          description="Invite your team to get started."
        />
      ) : (
        <div className="grid gap-3">
          {users.map((user) => {
            const config = roleConfig[user.role] || roleConfig.staff;
            const isMe = user._id === currentUser?.id;

            return (
              <Card
                key={user._id}
                className="group border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <span className="font-black text-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-base text-foreground tracking-tight truncate">
                        {user.name}{" "}
                        {isMe && (
                          <span className="text-primary/60 font-medium">
                            (You)
                          </span>
                        )}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${config.color} border font-bold text-[10px] uppercase tracking-wider py-0 px-2`}
                      >
                        {config.label}
                      </Badge>
                      {!user.isActive && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-500 border-none uppercase text-[10px] font-bold"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 text-primary/40" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary/40" />
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>

                  {!isMe && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5"
                        onClick={() => openEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.isActive && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                          onClick={() => setUserToDelete(user)} // Open confirmation modal
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent
          className="sm:max-w-[425px] rounded-3xl"
          description="Update Staff Account Information"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
              <UserCog className="w-5 h-5 text-primary" />
              Update Account
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onEditSubmit)}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
              <Label className="font-bold ml-1">Full name</Label>
              <Input
                {...register("name")}
                className="rounded-xl h-11"
                placeholder="Enter staff name"
                description="Staff Full Name"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold ml-1">Access level</Label>
              <Select
                value={watch("role")}
                onValueChange={(v) => setValue("role", v)}
              >
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="vet">Veterinarian</SelectItem>
                  <SelectItem value="staff">Clinic Staff</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground px-1">
                Admins have full control, Vets manage records, Staff handle
                appointments.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-bold ml-1">
                New password{" "}
                <span className="text-muted-foreground font-normal">
                  (leave blank to keep current)
                </span>
              </Label>
              <Input
                type="password"
                {...register("password")}
                className="rounded-xl h-11"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="rounded-xl font-bold px-8"
              >
                {updating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Add Staff Dialog ── */}
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent
          className="sm:max-w-[425px] rounded-3xl"
          description="Add New Staff"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
              <UserPlus className="w-5 h-5 text-primary" />
              Register new staff
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleNewSubmit(onAddSubmit)}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
              <Label className="font-bold ml-1">Full name</Label>
              <Input
                {...registerNew("name", { required: true })}
                placeholder="Ali bin Ahmad"
                className="rounded-xl h-11"
              />
              {newErrors.name && (
                <p className="text-xs text-destructive">Name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-bold ml-1">Email address</Label>
              <Input
                type="email"
                {...registerNew("email", { required: true })}
                placeholder="ali@novavet.com"
                className="rounded-xl h-11"
                autoComplete="email"
              />
              {newErrors.email && (
                <p className="text-xs text-destructive">Email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-bold ml-1">Role</Label>
              <Select
                onValueChange={(v) => setNewValue("role", v)}
                defaultValue="staff"
              >
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="vet">Veterinarian</SelectItem>
                  <SelectItem value="staff">Clinic Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold ml-1">Password</Label>
              <Input
                type="password"
                {...registerNew("password", { required: true, minLength: 6 })}
                placeholder="••••••••"
                className="rounded-xl h-11"
                autoComplete="password"
              />
              {newErrors.password && (
                <p className="text-xs text-destructive">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={() => {
                  setIsOpenModal(false);
                  resetNew();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={registering}
                className="rounded-xl font-bold px-8"
              >
                {registering ? "Creating..." : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent
          className="sm:max-w-[400px] rounded-3xl border-rose-100"
          description="delete user"
        >
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-2">
              <UserX className="w-6 h-6 text-rose-600" />
            </div>
            <DialogTitle className="text-center text-xl font-black tracking-tight">
              Delete Staff?
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed capitalize">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                {userToDelete?.name}
              </span>
              ? They will lose all access to the clinic management system
              immediately.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="ghost"
              className="rounded-xl flex-1 font-bold"
              onClick={() => setUserToDelete(null)}
            >
              Keep Account
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl flex-1 font-bold shadow-lg shadow-rose-200"
              onClick={() => {
                deactivateUser(userToDelete._id);
                setUserToDelete(null);
              }}
            >
              Yes, Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
