import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import SeekerDashboard from "./pages/SeekerDashboard";
import UserDashboardPage from "./pages/UserDashboardPage";
import RecruiterDashboardPage from "./pages/RecruiterDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// AppRoutes component to access useAuth
const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/jobs" element={user ? <Jobs /> : <Navigate to="/auth" replace />} />
      <Route path="/seeker" element={<Navigate to="/dashboard/user" replace />} />
      <Route path="/dashboard/user" element={<UserDashboardPage />} />
      <Route path="/dashboard/recruiter" element={<RecruiterDashboardPage />} />
      <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
      <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// App entry point with admin routing
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
