import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Users, CheckCircle, XCircle, FileText, User,
  ChevronDown, X, Loader2, Plus, TrendingUp, Clock, Eye,
  Mail, Calendar, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  jobType: string;
  salaryRange: string;
  experience: string;
  deadline?: string;
  applicants?: number;
}

interface Application {
  id: number;
  jobId: number;
  seekerName: string;
  seekerEmail: string;
  resumeFile: string;
  status: string;
  appliedAt: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const RecruiterDashboardComponent = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    rejected: 0,
    pending: 0
  });

  const [jobForm, setJobForm] = useState({
    company: "",
    title: "",
    salary: "",
    experience: "Fresher",
    description: "",
    location: "Bengaluru, KA",
    type: "Full-time",
    deadline: "",
    skills: ""
  });

  const fetchJobs = async () => {
    if (!user?.id) return;
    try {
      const [jobsData, statsData] = await Promise.all([
        apiFetch(`/jobs/recruiter/${user.id}`),
        apiFetch(`/jobs/recruiter/stats/${user.id}`).catch(() => ({
          totalJobs: 0, totalApplicants: 0, shortlisted: 0, rejected: 0, pending: 0
        }))
      ]);
      setJobs(jobsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: number) => {
    setLoadingApps(true);
    try {
      const data = await apiFetch(`/applications/job/${jobId}`);
      setApplications(data);
      setSelectedJobId(jobId);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to fetch applications", variant: "destructive" });
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.id]);

  const statsConfig = [
    { icon: Briefcase, label: "Active Jobs", value: String(stats.totalJobs), color: "from-blue-500 to-indigo-500" },
    { icon: Users, label: "Total Applicants", value: String(stats.totalApplicants), color: "from-violet-500 to-purple-500" },
    { icon: CheckCircle, label: "Shortlisted", value: String(stats.shortlisted), color: "from-emerald-500 to-teal-500" },
    { icon: Clock, label: "Pending Review", value: String(stats.pending), color: "from-blue-400 to-cyan-500" },
  ];

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.company || !jobForm.title || !user?.id) {
      toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await apiFetch("/jobs/create", {
        method: "POST",
        body: JSON.stringify({
          title: jobForm.title,
          company: jobForm.company,
          salaryRange: jobForm.salary,
          description: jobForm.description,
          recruiterId: user.id,
          jobType: jobForm.type,
          location: jobForm.location,
          experience: jobForm.experience,
          deadline: jobForm.deadline,
          skills: jobForm.skills.split(',').map(s => s.trim()).filter(s => s !== "")
        }),
      });

      toast({ title: "🚀 Job posted successfully!", description: `${jobForm.title} at ${jobForm.company}` });
      setJobForm({ company: "", title: "", salary: "", experience: "Fresher", description: "", location: "Bengaluru, KA", type: "Full-time", deadline: "", skills: "" });
      setShowForm(false);
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to post job. Please check your connection or role permissions.", variant: "destructive" });
    }
  };

  const handleStatusUpdate = async (appId: number, status: string) => {
    try {
      await apiFetch(`/applications/${appId}/status?status=${status}`, { method: "PUT" });
      toast({ title: "Status Updated", description: `Application marked as ${status}` });
      if (selectedJobId) fetchApplications(selectedJobId);

      // Update stats as well
      const statsData = await apiFetch(`/jobs/recruiter/stats/${user?.id}`);
      setStats(statsData);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update status", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading recruiter dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#0b1220] p-5 shadow-sm"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${s.color} opacity-[0.05] rounded-bl-full`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-display text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-5 h-5" /> Post New Job
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" /> Your Job Postings
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-blue-500/10 bg-[#0b1220]/50 p-8 text-center">
                <p className="text-zinc-500">No jobs posted yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => fetchApplications(job.id)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all duration-300 ${selectedJobId === job.id ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-blue-500/10 bg-[#0b1220] hover:border-blue-500/30'}`}
                >
                  <h4 className="font-semibold text-white truncate">{job.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{job.company} · {job.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{job.experience}</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Users className="w-3 h-3" /> View Applicants</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Applicants Panel */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Candidates
            {selectedJobId && <Badge className="ml-auto bg-blue-500/15 text-blue-400 border-blue-500/30">{applications.length}</Badge>}
          </h3>
          <div className="rounded-2xl border border-blue-500/10 bg-[#0b1220] p-6 lg:min-h-[500px]">
            {!selectedJobId ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Users className="w-12 h-12 text-zinc-800 mb-4" />
                <p className="text-zinc-500 max-w-[250px]">Select a job posting from the left to view interested candidates</p>
              </div>
            ) : loadingApps ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <FileText className="w-12 h-12 text-zinc-800 mb-4" />
                <p className="text-zinc-500">No applications received yet for this position.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.map((app) => (
                  <div key={app.id} className="rounded-xl border border-blue-500/10 bg-[#0a0f1a] p-4 space-y-3 transition-all hover:border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                        {app.seekerName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-white text-sm truncate">{app.seekerName}</h5>
                        <p className="text-[10px] text-zinc-500 truncate">{app.seekerEmail}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] uppercase ${app.status === 'hr_round' ? 'border-emerald-500/50 text-emerald-400' : app.status === 'rejected' ? 'border-red-500/50 text-red-400' : 'border-amber-500/50 text-amber-400'}`}>
                        {app.status === 'hr_round' ? 'Shortlisted' : app.status}
                      </Badge>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedApplicant(app)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-blue-500/25 bg-blue-500/10 text-blue-400 text-[10px] font-bold hover:bg-blue-500/20 transition-all"
                    >
                      <Eye className="w-3 h-3" /> View Applicant Details
                    </button>

                    {
                      app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'hr_round')}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applicant Details Modal */}
      <AnimatePresence>
        {selectedApplicant && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md px-0 sm:px-4 py-0 sm:py-4"
            onClick={() => setSelectedApplicant(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-blue-500/20 bg-[#0b1220] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-blue-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {selectedApplicant.seekerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base leading-tight">{selectedApplicant.seekerName}</h3>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Applicant Profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Application Status</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${selectedApplicant.status === 'hr_round'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : selectedApplicant.status === 'rejected'
                        ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                    {selectedApplicant.status === 'hr_round' ? '✓ Shortlisted' : selectedApplicant.status === 'rejected' ? '✗ Rejected' : '⏳ Pending Review'}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-500/10" />

                {/* Email */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0f1a] border border-blue-500/10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-sm text-white font-medium truncate">{selectedApplicant.seekerEmail}</p>
                  </div>
                </div>

                {/* Applied Date */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0f1a] border border-blue-500/10">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Applied On</p>
                    <p className="text-sm text-white font-medium">
                      {selectedApplicant.appliedAt
                        ? new Date(selectedApplicant.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Recently'}
                    </p>
                  </div>
                </div>

                {/* Resume */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0f1a] border border-blue-500/10">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Resume</p>
                    {selectedApplicant.resumeFile && selectedApplicant.resumeFile.startsWith('http') ? (
                      <a
                        href={selectedApplicant.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Open Resume <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Resume file not available online yet</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedApplicant.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { handleStatusUpdate(selectedApplicant.id, 'hr_round'); setSelectedApplicant(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/20"
                    >
                      ✓ Shortlist
                    </button>
                    <button
                      onClick={() => { handleStatusUpdate(selectedApplicant.id, 'rejected'); setSelectedApplicant(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-900/20"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl rounded-2xl border border-blue-500/20 bg-[#0b1220] shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Sticky header */}
              <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-blue-500/10 flex-shrink-0">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" /> Create Job Listing
                </h2>
                <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white transition-colors ml-4">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Job Title</label>
                      <input
                        value={jobForm.title}
                        onChange={(e) => setJobForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Senior Backend Dev"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Company</label>
                      <input
                        value={jobForm.company}
                        onChange={(e) => setJobForm(f => ({ ...f, company: e.target.value }))}
                        placeholder="e.g. Mitra Tech"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Package (LPA)</label>
                      <input
                        value={jobForm.salary}
                        onChange={(e) => setJobForm(f => ({ ...f, salary: e.target.value }))}
                        placeholder="e.g. 12-18 LPA"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Location</label>
                      <input
                        value={jobForm.location}
                        onChange={(e) => setJobForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Mumbai, Remote"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Job Type</label>
                      <select
                        value={jobForm.type}
                        onChange={(e) => setJobForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white outline-none text-sm appearance-none"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Experience</label>
                      <select
                        value={jobForm.experience}
                        onChange={(e) => setJobForm(f => ({ ...f, experience: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white outline-none text-sm appearance-none"
                      >
                        <option value="Fresher">Fresher</option>
                        <option value="Experienced">Experienced</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Application Deadline</label>
                      <input
                        type="date"
                        value={jobForm.deadline}
                        onChange={(e) => setJobForm(f => ({ ...f, deadline: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Required Skills (comma separated)</label>
                    <input
                      value={jobForm.skills}
                      onChange={(e) => setJobForm(f => ({ ...f, skills: e.target.value }))}
                      placeholder="e.g. React, TypeScript, Node.js"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Description</label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Briefly describe the role..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 outline-none text-sm resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xl shadow-blue-900/40">
                      Publish Position
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default RecruiterDashboardComponent;
