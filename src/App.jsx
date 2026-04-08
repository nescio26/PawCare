import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import RootLayout from "./components/layout/RootLayout.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import VetDashboard from "./pages/dashboard/VetDashboard.jsx";
import StaffDashboard from "./pages/dashboard/StaffDashboard.jsx";
import OwnersPage from "./pages/owners/OwnersPage.jsx";
import OwnerDetailPage from "./pages/owners/OwnerDetailPage.jsx";
import OwnerFormPage from "./pages/owners/OwnerFormPage.jsx";
import PetsPage from "./pages/pets/PetsPage.jsx";
import PetDetailPage from "./pages/pets/PetDetailPage.jsx";
import PetFormPage from "./pages/pets/PetFormPage.jsx";
import QueuePage from "./pages/queue/QueuePage.jsx";
import VisitsPage from "./pages/visits/VisitsPage.jsx";
import VisitFormPage from "./pages/visits/VisitFormPage.jsx";
import RecordsPage from "./pages/records/RecordsPage.jsx";
import RecordFormPage from "./pages/records/RecordFormPage.jsx";
import AnalyticsPage from "./pages/analytics/AnalyticsPage.jsx";
import UsersPage from "./pages/users/UsersPage.jsx";

const DashboardRedirect = () => {
  const { user } = useAuthStore();
  if (user?.role === "admin") return <Navigate to="/dashboard/admin" />;
  if (user?.role === "vet") return <Navigate to="/dashboard/vet" />;
  return <Navigate to="/dashboard/staff" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<DashboardRedirect />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/vet" element={<VetDashboard />} />
          <Route path="/dashboard/staff" element={<StaffDashboard />} />
          <Route path="/owners" element={<OwnersPage />} />
          <Route path="/owners/new" element={<OwnerFormPage />} />
          <Route path="/owners/:id" element={<OwnerDetailPage />} />
          <Route path="/owners/:id/edit" element={<OwnerFormPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pets/new" element={<PetFormPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/pets/:id/edit" element={<PetFormPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/visits" element={<VisitsPage />} />
          <Route path="/visits/new" element={<VisitFormPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/records/new" element={<RecordFormPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
