import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Upload, FileText, CheckCircle, XCircle, Briefcase, MapPin, Clock,
  Settings, LogOut, ChevronRight, Bookmark, Search,
  CheckCircle2, Loader2, Edit3, X, BarChart3, Linkedin, Bell, BellPlus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import AtsScorePanel from "./AtsScorePanel";
import { apiFetch } from "@/lib/api";
import ApplyModal from "./ApplyModal";

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
  deadline?: string;
}

interface AppliedJob {
  id: string;
  company: string;
  role: string;
  location: string;
  status: "pending" | "shortlisted" | "rejected";
  appliedDate: string;
}

// Mock data removed in favor of real API data


const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const statusConfig = {
  pending: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]" },
  shortlisted: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", glow: "shadow-[0_0_12px_rgba(59,130,246,0.15)]" },
  rejected: { color: "bg-red-500/20 text-red-400 border-red-500/30", glow: "shadow-[0_0_12px_rgba(239,68,68,0.15)]" },
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [showApplied, setShowApplied] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: user?.name || "Job Seeker",
    skills: "",
    experience: "",
    location: "",
    linkedin: "",
  });

  const [jobAlerts, setJobAlerts] = useState<any[]>([]);
  const [newAlert, setNewAlert] = useState({ keyword: "", location: "" });
  const [showAddAlert, setShowAddAlert] = useState(false);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      const [jobsData, userApps, profileData, savedData, alertsData] = await Promise.all([
        apiFetch("/jobs"),
        apiFetch(`/applications/seeker/${user.id}`),
        apiFetch(`/profile/${user.id}`).catch(() => ({})),
        apiFetch(`/saved-jobs/${user.id}`).catch(() => []),
        apiFetch(`/alerts/user/${user.id}`).catch(() => [])
      ]);

      setJobs(jobsData);
      setSavedJobs(savedData);
      setJobAlerts(alertsData);

      if (profileData && profileData.userId) {
        setEditForm({
          name: user.name,
          skills: profileData.skills || "",
          experience: profileData.experience || "",
          location: profileData.location || "",
          linkedin: profileData.linkedinUrl || "",
        });
        if (profileData.photoUrl) {
          setPhotoUrl(profileData.photoUrl);
        }
      }

      const enriched = userApps.map((app: any) => {
        const job = jobsData.find((j: any) => j.id === app.jobId);
        return {
          id: String(app.id),
          company: job?.company || "Unknown",
          role: job?.title || "Position",
          location: job?.location || "Remote",
          status: app.status || "pending",
          appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"
        };
      });
      setAppliedJobs(enriched);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await apiFetch("/alerts", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          keyword: newAlert.keyword,
          location: newAlert.location
        })
      });
      toast({ title: "Job alert created!", description: `We'll notify you about ${newAlert.keyword} jobs in ${newAlert.location}.` });
      setNewAlert({ keyword: "", location: "" });
      setShowAddAlert(false);
      fetchDashboardData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    if (!user?.id) return;
    try {
      await apiFetch(`/alerts/${alertId}?userId=${user.id}`, { method: "DELETE" });
      toast({ title: "Alert removed" });
      fetchDashboardData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleSaveJob = async (jobId: number) => {
    if (!user?.id) return;
    const isSaved = savedJobs.some(sj => sj.jobId === jobId);

    try {
      if (isSaved) {
        await apiFetch(`/saved-jobs/${jobId}?seekerId=${user.id}`, { method: "DELETE" });
        toast({ title: "Removed from saved" });
      } else {
        await apiFetch(`/saved-jobs/${jobId}?seekerId=${user.id}`, { method: "POST" });
        toast({ title: "Job saved!" });
      }
      fetchDashboardData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const toggleApplied = () => {
    setShowApplied(true);
    setShowSaved(false);
    setTimeout(() => {
      document.getElementById('applied-jobs-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleSaved = () => {
    setShowSaved(true);
    setShowApplied(false);
    setTimeout(() => {
      document.getElementById('saved-jobs-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const stats = [
    { icon: Briefcase, label: "Applied Jobs", value: String(appliedJobs.length), color: "from-blue-500 to-indigo-500", clickable: true, onClick: toggleApplied },
    { icon: FileText, label: "Saved Jobs", value: String(savedJobs.length), color: "from-purple-500 to-indigo-600", clickable: true, onClick: toggleSaved },
    { icon: Clock, label: "Pending", value: String(appliedJobs.filter(a => a.status === 'pending').length), color: "from-amber-500 to-orange-500", clickable: false },
    { icon: CheckCircle, label: "Shortlisted", value: String(appliedJobs.filter(a => a.status === 'shortlisted' || a.status === 'hr_round').length), color: "from-emerald-500 to-teal-500", clickable: false },
  ];

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setResumeUploaded(true);
      toast({ title: "Resume uploaded successfully!", description: "Your resume is ready for applications." });
    }
  };

  const handleApplyJob = () => {
    toast({ title: "✅ Application sent successfully!", description: "Your resume has been submitted." });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await apiFetch(`/profile/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editForm.name,
          skills: editForm.skills,
          experience: editForm.experience,
          location: editForm.location,
          linkedinUrl: editForm.linkedin
        })
      });
      toast({ title: "Profile updated successfully!" });
      setShowEditDrawer(false);
      fetchDashboardData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await apiFetch(`/profile/${user.id}/photo`, {
        method: "POST",
        body: formData,
      });

      setPhotoUrl(response.photoUrl);
      toast({ title: "Photo updated successfully!" });
      fetchDashboardData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-[#0b1220] p-6 md:p-8">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20" />
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10 w-full">
          {/* Left: Avatar & Info */}
          <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                <div className="w-full h-full rounded-full bg-[#0b1220] flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={`${photoUrl}${photoUrl.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        setPhotoUrl(null); // Fallback to initial
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">{user?.name?.charAt(0) || "U"}</span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-[#0a0f1a]">
                <CheckCircle2 className="w-3 h-3" />
              </div>

              {/* Photo Upload Overlay */}
              <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingPhoto ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <div className="text-white text-xs text-center px-2">Change<br />Photo</div>}
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              </label>
            </div>

            <div className="flex-1 mt-2">
              <h2 className="font-display text-2xl font-bold text-white">{user?.name || "Job Seeker"}</h2>
              <p className="text-zinc-400 text-sm">{user?.email || "user@email.com"}</p>
              <Badge className="mt-2 bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs">Job Seeker</Badge>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button onClick={() => setShowEditDrawer(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all duration-300">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>

            {/* Resume Status */}
            {resumeUploaded && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Resume Uploaded
              </div>
            )}
          </div>
        </div>

        {/* FileUpload Drop Zone */}
        {!resumeUploaded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="relative mt-6 rounded-xl border border-blue-500/20 bg-[#0a0f1a] overflow-hidden"
          >
            <FileUpload onChange={handleFileUpload} />
          </motion.div>
        )}
      </div>

      {/* ATS Resume Analysis — shows after upload */}
      <AnimatePresence>
        {resumeUploaded && <AtsScorePanel />}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp}
            transition={{ delay: 0.1 + i * 0.06 }}
            onClick={() => s.clickable && s.onClick && s.onClick()}
            className={`relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#0b1220] p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] ${s.clickable ? "cursor-pointer" : ""}`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${s.color} opacity-[0.07] rounded-bl-full`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-display text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{s.label}</p>
            {s.clickable && <p className="text-xs text-blue-400 mt-2">View details →</p>}
          </motion.div>
        ))}
      </div>

      {/* Latest Opportunities Section */}
      <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="rounded-2xl border border-blue-500/20 bg-[#0b1220] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-white">Latest Opportunities</h3>
          <Briefcase className="w-5 h-5 text-blue-400" />
        </div>
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">No jobs available at the moment.</div>
          ) : (
            jobs.slice(0, 5).map((job) => {
              const isApplied = appliedJobs.some(app => app.role === job.title && app.company === job.company);
              return (
                <div key={job.id} className="rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/30 transition-all">
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-white">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="text-blue-400/80 font-medium">₹{job.salaryRange} LPA</span>
                      {job.deadline && (
                        <span className={`font-medium ${new Date() > new Date(job.deadline) ? 'text-red-400' : 'text-amber-400'}`}>
                          Last Date: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSaveJob(job.id)}
                      className={`p-2 rounded-lg border transition-all ${savedJobs.some(sj => sj.jobId === job.id)
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                        : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-600'
                        }`}
                      title={savedJobs.some(sj => sj.jobId === job.id) ? "Unsave Job" : "Save Job"}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobs.some(sj => sj.jobId === job.id) ? 'fill-current' : ''}`} />
                    </button>

                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                        <CheckCircle className="w-3 h-3" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedJob(job)}
                        disabled={job.deadline ? new Date() > new Date(job.deadline) : false}
                        className="whitespace-nowrap rounded-lg px-4 py-2 bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-all disabled:bg-zinc-800 disabled:text-zinc-500"
                      >
                        {job.deadline && new Date() > new Date(job.deadline) ? "Closed" : "Apply Now"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Job Alerts Section */}
      <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="rounded-2xl border border-blue-500/20 bg-[#0b1220] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-display text-xl font-bold text-white">Job Alerts</h3>
          </div>
          <button
            onClick={() => setShowAddAlert(!showAddAlert)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all"
          >
            <BellPlus className="w-4 h-4" /> Create Alert
          </button>
        </div>

        <AnimatePresence>
          {showAddAlert && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddAlert}
              className="mb-8 p-4 rounded-xl border border-blue-500/10 bg-[#0a0f1a] space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 block mb-1.5 uppercase tracking-wider">Keyword (Job Title, Skill)</label>
                  <input
                    required
                    value={newAlert.keyword}
                    onChange={(e) => setNewAlert({ ...newAlert, keyword: e.target.value })}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-[#0b1220] border border-blue-500/20 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 block mb-1.5 uppercase tracking-wider">Location</label>
                  <input
                    required
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                    placeholder="e.g. Remote"
                    className="w-full bg-[#0b1220] border border-blue-500/20 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddAlert(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">Set Alert</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobAlerts.length === 0 ? (
            <div className="col-span-full py-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              You haven't set any job alerts yet. Create one to get notified!
            </div>
          ) : (
            jobAlerts.map((alert) => (
              <div key={alert.id} className="group relative rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-4 hover:border-blue-500/30 transition-all">
                <div className="flex flex-col gap-1 pr-8">
                  <h4 className="font-semibold text-white">{alert.keyword}</h4>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5"><MapPin className="w-3 h-3" />{alert.location || 'Anywhere'}</p>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Active Notification</span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        {showApplied && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div id="applied-jobs-panel" className="rounded-2xl border border-blue-500/20 bg-[#0b1220] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">Applied Jobs</h3>
                <button onClick={() => setShowApplied(false)} className="text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              {appliedJobs.length === 0 ? (
                <p className="text-zinc-500 text-center py-10">You haven't applied to any jobs yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appliedJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/25 ${statusConfig[job.status as keyof typeof statusConfig]?.glow || ""}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-display font-semibold text-white text-base">{job.role}</h4>
                          <p className="text-sm text-zinc-400 flex items-center gap-1.5 mt-1"><Briefcase className="w-3.5 h-3.5" />{job.company}</p>
                        </div>
                        <Badge className={`text-xs border ${statusConfig[job.status as keyof typeof statusConfig]?.color || ""}`}>{job.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span>{job.appliedDate}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Jobs Panel */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div id="saved-jobs-panel" className="rounded-2xl border border-purple-500/20 bg-[#0b1220] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">Saved Opportunities</h3>
                <button onClick={() => setShowSaved(false)} className="text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              {savedJobs.length === 0 ? (
                <p className="text-zinc-500 text-center py-10">No saved jobs yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-purple-500/10 bg-[#0a0f1a] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/25"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-display font-semibold text-white text-base">{job.title}</h4>
                          <p className="text-sm text-zinc-400 flex items-center gap-1.5 mt-1"><Briefcase className="w-3.5 h-3.5" />{job.company}</p>
                        </div>
                        <button
                          onClick={async () => {
                            await apiFetch(`/saved-jobs/${job.jobId}?seekerId=${user?.id}`, { method: 'DELETE' });
                            fetchDashboardData();
                          }}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                        <button onClick={() => {
                          const originalJob = jobs.find(j => j.id === job.jobId);
                          if (originalJob) setSelectedJob(originalJob);
                        }} className="text-blue-400 hover:underline">Apply Now</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Drawer */}
      <AnimatePresence>
        {showEditDrawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditDrawer(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md border-l border-blue-500/20 bg-[#0b1220] shadow-2xl overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-xl font-bold text-white">Edit Profile</h3>
                  <button onClick={() => setShowEditDrawer(false)} className="text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form className="space-y-5" onSubmit={handleSaveProfile}>

                  {[
                    { label: "Name", key: "name", icon: User },
                    { label: "Skills", key: "skills", icon: BarChart3 },
                    { label: "Experience", key: "experience", icon: Briefcase },
                    { label: "Location", key: "location", icon: MapPin },
                    { label: "LinkedIn", key: "linkedin", icon: Linkedin },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          value={editForm[field.key as keyof typeof editForm]}
                          onChange={(e) => setEditForm((f) => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0a0f1a] border border-blue-500/20 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all"
                        />
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    Save Changes
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {selectedJob && (
        <ApplyModal
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
          deadline={selectedJob.deadline}
          onClose={() => setSelectedJob(null)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default UserDashboard;
