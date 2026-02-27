import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Briefcase, CheckCircle2, Star, FileText, TrendingUp, XCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import ApplyModal from "@/components/dashboard/ApplyModal";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange: string;
  experience: string;
  description: string;
  postedAt: string;
}

interface Application {
  id: number;
  jobId: number;
  status: string;
}

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [jobsData, appsData] = await Promise.all([
        apiFetch("/jobs"),
        user?.id ? apiFetch(`/applications/seeker/${user.id}`) : Promise.resolve([])
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const getJobStatus = (jobId: number) => {
    const app = applications.find(a => a.jobId === jobId);
    return app ? app.status : null;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "hr_round": return { label: "Shortlisted for HR Round", icon: CheckCircle2, color: "text-emerald-400" };
      case "rejected": return { label: "Rejected", icon: XCircle, color: "text-rose-400" };
      default: return { label: "Application Pending", icon: Clock, color: "text-amber-400" };
    }
  };

  const seekerStats = [
    { icon: FileText, label: "Applications", value: String(applications.length), color: "text-primary" },
    { icon: Star, label: "Saved Jobs", value: "0", color: "text-amber-400" },
    { icon: TrendingUp, label: "Profile Views", value: "0", color: "text-emerald-400" },
    { icon: CheckCircle2, label: "Match Score", value: "N/A", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold mb-1">
              Hi, <span className="gradient-text">{user?.name || "Job Seeker"}</span> Mitra 👋
            </h1>
            <p className="text-muted-foreground">Discover and apply to your next opportunity</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {seekerStats.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-5">
                <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
                <p className="font-display text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or companies..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Jobs */}
          <h2 className="font-display text-xl font-semibold mb-4">Recommended for You</h2>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground text-center py-10 glass-card rounded-xl">No jobs found matching your search.</p>
              ) : (
                filtered.map((job) => {
                  const status = getJobStatus(job.id);
                  const statusInfo = status ? getStatusDisplay(status) : null;

                  return (
                    <div
                      key={job.id}
                      className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg font-semibold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.postedAt || "Recently Published"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                          <div className="flex gap-4 text-xs font-medium">
                            <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">{job.jobType}</span>
                            <span className="px-2 py-1 rounded bg-secondary text-muted-foreground">{job.experience}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display font-semibold text-foreground mb-4">₹{job.salaryRange} LPA</p>
                          {statusInfo ? (
                            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusInfo.color}`}>
                              <statusInfo.icon className="w-4 h-4" /> {statusInfo.label}
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="rounded-lg px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                              style={{ background: "var(--gradient-primary)" }}
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <ApplyModal
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
          onClose={() => setSelectedJob(null)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default SeekerDashboard;
