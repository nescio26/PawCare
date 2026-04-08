import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Menu, Bell } from "lucide-react";
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
  "/owners": "Owners",
  "/owners/new": "Register Owner",
  "/pets": "Pets",
  "/pets/new": "Register Pet",
  "/visits": "Visits",
  "/visits/new": "New Visit",
  "/records": "Medical Records",
  "/records/new": "New Record",
  "/analytics": "Analytics",
  "/users": "Staff Management",
};

const roleColors = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  vet: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  staff: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const matchedKey = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname === k || pathname.startsWith(k + "/"));

  const title = pageTitles[matchedKey] || "Nova Vet";

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Drawer direction="left" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
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
        <h1 className="text-sm md:text-lg font-bold tracking-tight uppercase truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold leading-none">
            {user?.name}
          </span>
          <Badge
            variant="secondary"
            className={cn(
              "text-[9px] px-2 py-0 h-4 mt-1 uppercase font-black border-none",
              roleColors[user?.role],
            )}
          >
            {user?.role}
          </Badge>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-background shadow-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
