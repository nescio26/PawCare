import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function RootLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex w-64 border-r bg-card shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/5">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
