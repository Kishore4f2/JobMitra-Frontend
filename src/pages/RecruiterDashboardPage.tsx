import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RecruiterDashboardComponent from "@/components/dashboard/RecruiterDashboard";
import { useAuth } from "@/contexts/AuthContext";

const RecruiterDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white">
              Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">{user?.name || "Recruiter"}</span> 🚀
            </h1>
            <p className="text-zinc-400 mt-1">Post jobs, review candidates, and build your dream team.</p>
          </motion.div>
          <RecruiterDashboardComponent />
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
