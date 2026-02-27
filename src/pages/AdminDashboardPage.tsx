import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import Footer from "@/components/Footer";

const AdminDashboardPage = () => {
    return (
        <div className="min-h-screen bg-[#020617]">
            <Navbar />
            <AdminDashboard />
            <Footer />
        </div>
    );
};

export default AdminDashboardPage;
