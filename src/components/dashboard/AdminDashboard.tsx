import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, Shield, Trash2, Search, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    recruiterId: number;
    recruiterName?: string;
}

interface Application {
    id: number;
    jobId: number;
    seekerId: number;
    seekerName: string;
    seekerEmail: string;
    status: string;
    appliedAt: string;
    jobTitle?: string;
}

interface Stats {
    totalUsers: number;
    totalRecruiters: number;
    totalSeekers: number;
    totalJobs: number;
    totalApplications: number;
    blockedUsers: number;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "RECRUITER" | "SEEKER">("ALL");
    const [activeTab, setActiveTab] = useState<"users" | "jobs" | "applications">("users");
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [usersData, jobsData, appsData, statsData] = await Promise.all([
                apiFetch("/admin/users"),
                apiFetch("/admin/jobs"),
                apiFetch("/admin/applications"),
                apiFetch("/admin/stats")
            ]);

            setUsers(Array.isArray(usersData) ? usersData : []);
            setJobs(Array.isArray(jobsData) ? jobsData : []);
            setApplications(Array.isArray(appsData) ? appsData : []);
            setStats(statsData);
        } catch (error: any) {
            console.error("Dashboard Fetch Error:", error);
            toast({
                title: "Error",
                description: "Failed to fetch dashboard data. Please check if backend is running.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "blocked" : "active";
        try {
            await apiFetch(`/admin/users/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus }),
            });
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
            toast({ title: "Success", description: `User ${newStatus === "active" ? "unblocked" : "blocked"} successfully` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update user status", variant: "destructive" });
        }
    };

    const handleUpdateRole = async (id: number, currentRole: string) => {
        const newRole = currentRole === "RECRUITER" ? "SEEKER" : "RECRUITER";
        try {
            await apiFetch(`/admin/users/${id}/role`, {
                method: "PUT",
                body: JSON.stringify({ role: newRole }),
            });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            toast({ title: "Success", description: `User role changed to ${newRole}` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
            setUsers(users.filter(u => u.id !== id));
            toast({ title: "Success", description: "User deleted successfully" });
            fetchAllData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
        }
    };

    const handleDeleteJob = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await apiFetch(`/admin/jobs/${id}`, { method: "DELETE" });
            setJobs(jobs.filter(j => j.id !== id));
            toast({ title: "Success", description: "Job deleted successfully" });
            fetchAllData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
        }
    };

    const handleDeleteApplication = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await apiFetch(`/admin/applications/${id}`, { method: "DELETE" });
            setApplications(applications.filter(a => a.id !== id));
            toast({ title: "Success", description: "Application deleted successfully" });
            fetchAllData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete application", variant: "destructive" });
        }
    };

    const filteredUsers = (users || []).filter(u => {
        const matchesSearch = u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || u?.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const filteredJobs = (jobs || []).filter(j =>
        j?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j?.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApplications = (applications || []).filter(a =>
        a?.seekerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a?.seekerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] p-8 pt-24 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Admin Control Center
                        </h1>
                        <p className="text-zinc-500 mt-1 text-sm">Manage users, recruiters, and platform access</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchAllData}
                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/20 transition-all text-sm font-medium"
                        >
                            Refresh Data
                        </button>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#0b1220] border border-blue-500/20 rounded-xl pl-10 pr-4 py-2.5 w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "blue", tab: "users", role: "ALL" },
                        { label: "Recruiters", value: stats?.totalRecruiters || 0, icon: Briefcase, color: "indigo", tab: "users", role: "RECRUITER" },
                        { label: "Live Jobs", value: stats?.totalJobs || 0, icon: Shield, color: "purple", tab: "jobs" },
                        { label: "Applications", value: stats?.totalApplications || 0, icon: UserCheck, color: "emerald", tab: "applications" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => {
                                setActiveTab(stat.tab as any);
                                if (stat.role) setRoleFilter(stat.role as any);
                                setSearchTerm("");
                            }}
                            className="bg-[#0b1220] border border-blue-500/10 p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${stat.color}-500/10 transition-all`} />
                            <div className="flex items-center gap-4">
                                <div className={`p-3 bg-${stat.color}-500/10 rounded-xl text-${stat.color}-400`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-blue-500/10">
                    <div className="flex gap-4">
                        {(["users", "jobs", "applications"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setSearchTerm("");
                                }}
                                className={`px-6 py-3 text-sm font-medium transition-all relative capitalize ${activeTab === tab ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabLine"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === "users" && (
                        <div className="flex items-center gap-2 pb-2">
                            {(["ALL", "RECRUITER", "SEEKER"] as const).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all border ${roleFilter === role
                                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                                        }`}
                                >
                                    {role === "ALL" ? "All Users" : role === "RECRUITER" ? "Recruiters" : "Job Seekers"}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-[#0b1220] border border-blue-500/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-blue-500/10 bg-blue-500/5">
                                    {activeTab === "users" && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">User Details</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Role</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Status</th>
                                        </>
                                    )}
                                    {activeTab === "jobs" && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Job Title</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Recruiter</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Company / Location</th>
                                        </>
                                    )}
                                    {activeTab === "applications" && (
                                        <>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Applicant</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Applied For</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Applied At</th>
                                        </>
                                    )}
                                    <th className="px-6 py-4 text-sm font-semibold text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-500/5">
                                <AnimatePresence mode="wait">
                                    {activeTab === "users" && filteredUsers.map((u) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-blue-500/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">
                                                        {u.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-zinc-100">{u.name}</p>
                                                        <p className="text-sm text-zinc-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${u.role === "ADMIN" ? "bg-purple-500/20 text-purple-400" :
                                                    u.role === "RECRUITER" ? "bg-indigo-500/20 text-indigo-400" :
                                                        "bg-blue-500/20 text-blue-400"
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1.5 text-sm ${u.status === "active" ? "text-emerald-400" : "text-red-400"}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                                                    {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {u.role !== "ADMIN" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(u.id, u.status)}
                                                                title={u.status === "active" ? "Block User" : "Unblock User"}
                                                                className={`p-2 rounded-lg transition-all ${u.status === "active" ? "hover:bg-red-500/20 text-red-400" : "hover:bg-emerald-500/20 text-emerald-400"
                                                                    }`}
                                                            >
                                                                {u.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateRole(u.id, u.role)}
                                                                title="Change Role"
                                                                className="p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-all"
                                                            >
                                                                <Shield className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                title="Delete User"
                                                                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}

                                    {activeTab === "jobs" && filteredJobs.map((j) => (
                                        <motion.tr
                                            key={j.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-blue-500/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4 font-semibold text-zinc-100">{j.title}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-100 font-medium">{j.recruiterName || "Unknown"}</span>
                                                    <span className="text-[10px] text-zinc-600">ID: #{j.recruiterId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-100">{j.company}</span>
                                                    <span className="text-sm text-zinc-500">{j.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteJob(j.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}

                                    {activeTab === "applications" && filteredApplications.map((a) => (
                                        <motion.tr
                                            key={a.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-blue-500/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-zinc-100">{a.seekerName}</p>
                                                    <p className="text-sm text-zinc-500">{a.seekerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-100 font-medium">{a.jobTitle || "Job Not Found"}</span>
                                                    <span className="text-[10px] text-zinc-600">ID: #{a.jobId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${a.status === "accepted" ? "bg-emerald-500/20 text-emerald-400" :
                                                    a.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                                        "bg-blue-500/20 text-blue-400"
                                                    }`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">{new Date(a.appliedAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteApplication(a.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
                {((activeTab === "users" && filteredUsers.length === 0) ||
                    (activeTab === "jobs" && filteredJobs.length === 0) ||
                    (activeTab === "applications" && filteredApplications.length === 0)) && (
                        <div className="py-20 text-center text-zinc-500 bg-blue-500/5">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No {activeTab} found matching your search.</p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default AdminDashboard;
