import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function RootLayout() {
  return (
    <div className="flex h-screen bg-[#FAFAFA] text-[#0B161B] overflow-hidden font-sans">
      {/* Desktop Persistent Sidebar 
         Using your Dark Slate (#0B161B) for high-end contrast
      */}
      <aside className="hidden lg:flex w-72 bg-[#0B161B] shrink-0 z-30 shadow-xl shadow-black/20">
        <Sidebar />
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Navbar 
           Glassmorphism effect or clean solid white with subtle border
        */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md z-20">
          <Navbar />
        </header>

        {/* Main Content Area 
           p-4 md:p-8 provides a luxury "breathing room" feel
        */}
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-full">
            {/* The Outlet renders your Dashboard, Queue, and Analytics components.
               I've added a subtle entrance animation container here.
            */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Outlet />
            </div>
          </div>

          {/* Optional: Subtle footer branding inside scroll area */}
          <footer className="py-6 px-8 border-t border-slate-100 flex justify-between items-center opacity-40 grayscale">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Nova Vet Management System
            </p>
            <p className="text-[10px] font-medium">v2.4.0</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
