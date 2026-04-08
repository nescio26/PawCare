import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Menu, Bell, User as UserIcon } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from "../ui/drawer.jsx";
import Sidebar from "./Sidebar.jsx";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "../../utils/cn.js";

const pageTitles = {
  "/": "Dashboard",
  "/queue": "Live Queue",
  "/owners": "Client Directory",
  "/owners/new": "New Registration",
  "/pets": "Patient Files",
  "/pets/new": "Add Patient",
  "/visits": "Visits Log",
  "/visits/new": "Check-in",
  "/records": "Medical Records",
  "/records/new": "Clinical Entry",
  "/analytics": "Insights",
  "/users": "Staff Access",
};

const roleStyles = {
  admin:
    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400",
  vet: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400",
  staff:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  // Dynamic Title Logic
  const matchedKey = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname === k || pathname.startsWith(k + "/"));

  const title = pageTitles[matchedKey] || "PawCare";

  return (
    <header className="h-16 border-b bg-white/70 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-all">
      {/* Left Side: Navigation & Title */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Drawer direction="left" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-accent transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="focus:outline-none">
              <VisuallyHidden.Root>
                <DrawerTitle>Navigation Menu</DrawerTitle>
                <DrawerDescription>Access clinic departments</DrawerDescription>
              </VisuallyHidden.Root>
              <Sidebar setOpen={setOpen} />
            </DrawerContent>
          </Drawer>
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm md:text-base font-black tracking-tight uppercase text-foreground/90">
            {title}
          </h1>
          <div className="h-1 w-6 bg-primary rounded-full mt-0.5 hidden md:block" />
        </div>
      </div>

      {/* Right Side: Profile & Notifications */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Notification Icon - slightly larger */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
        >
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
        </Button>

        {/* Vertical Divider */}
        <div className="h-10 w-[1px] bg-border hidden sm:block" />

        <div className="flex items-center gap-4 pl-2">
          {/* Text Container - Increased sizes here */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-sm md:text-base font-bold text-foreground leading-none tracking-tight">
              {user?.name}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] md:text-[11px] px-2 py-0.5 h-auto uppercase font-black tracking-widest transition-colors",
                roleStyles[user?.role],
              )}
            >
              {user?.role}
            </Badge>
          </div>

          {/* User Avatar - Slightly larger container */}
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="text-sm md:text-base font-black">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Online Status Dot - scaled up */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
