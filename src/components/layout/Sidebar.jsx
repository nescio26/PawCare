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
  HeartPulse,
} from "lucide-react";

const navItems = [
  {
    group: "General",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        roles: ["admin", "vet", "staff"],
      },
      {
        label: "Live Queue",
        icon: ListOrdered,
        href: "/queue",
        roles: ["admin", "vet", "staff"],
      },
    ],
  },
  {
    group: "Management",
    items: [
      {
        label: "Client Directory",
        icon: Users,
        href: "/owners",
        roles: ["admin", "vet", "staff"],
      },
      {
        label: "Patient Files",
        icon: PawPrint,
        href: "/pets",
        roles: ["admin", "vet", "staff"],
      },
      {
        label: "Visits Log",
        icon: ClipboardList,
        href: "/visits",
        roles: ["admin", "vet", "staff"],
      },
      {
        label: "Medical Records",
        icon: FileText,
        href: "/records",
        roles: ["admin", "vet"],
      },
    ],
  },
  {
    group: "Admin",
    items: [
      {
        label: "Analytics",
        icon: BarChart3,
        href: "/analytics",
        roles: ["admin"],
      },
      {
        label: "Staff Management",
        icon: UserCog,
        href: "/users",
        roles: ["admin"],
      },
    ],
  },
];

export default function Sidebar({ setOpen }) {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  return (
    <aside className="w-full flex flex-col h-full bg-white border-r border-border shrink-0">
      <div className="p-7 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
            <HeartPulse className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-tight text-foreground uppercase">
              Paw<span className="text-primary">Care</span>
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-[0.2em]">
              Medical CMS
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        {navItems.map((section) => {
          const filteredItems = section.items.filter((i) =>
            i.roles.includes(user?.role),
          );
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.group} className="space-y-2">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                {section.group}
              </h3>
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/"}
                    onClick={() => setOpen?.(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                      )}
                    />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-muted/40 border border-border/50 p-2 space-y-2">
          <button
            onClick={() => {
              logout();
              setOpen?.(false);
            }}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
