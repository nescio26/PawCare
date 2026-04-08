import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { useLogout } from "../../hooks/useAuth.js";
import { cn } from "../../utils/cn.js";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  ClipboardList,
  ListOrdered,
  FileText,
  BarChart3,
  UserCog,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    roles: ["admin", "vet", "staff"],
  },
  {
    label: "Queue",
    icon: ListOrdered,
    href: "/queue",
    roles: ["admin", "vet", "staff"],
  },
  {
    label: "Owners",
    icon: Users,
    href: "/owners",
    roles: ["admin", "vet", "staff"],
  },
  {
    label: "Pets",
    icon: PawPrint,
    href: "/pets",
    roles: ["admin", "vet", "staff"],
  },
  {
    label: "Visits",
    icon: ClipboardList,
    href: "/visits",
    roles: ["admin", "vet", "staff"],
  },
  {
    label: "Records",
    icon: FileText,
    href: "/records",
    roles: ["admin", "vet"],
  },
  { label: "Analytics", icon: BarChart3, href: "/analytics", roles: ["admin"] },
  { label: "Staff", icon: UserCog, href: "/users", roles: ["admin"] },
];

export default function Sidebar({ setOpen }) {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const filtered = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="w-full flex flex-col h-full bg-card shrink-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <PawPrint className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none tracking-tight">
              Nova Vet
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">
              Clinic System
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filtered.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            onClick={() => setOpen?.(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            setOpen?.(false);
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
