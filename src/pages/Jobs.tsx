import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Briefcase, Filter, CheckCircle2, Loader2, Calendar, Bookmark, BookmarkCheck } from "lucide-react";
import { type Job } from "@/data/jobs";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const typeColors: Record<string, string> = {
  "Full-time": "bg-primary/15 text-primary",
  "Part-time": "bg-accent/15 text-accent",
  Remote: "bg-emerald-500/15 text-emerald-400",
  Contract: "bg-amber-500/15 text-amber-400",
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchSavedStatus = async () => {
    if (!user?.id || user.role !== 'SEEKER') return;
    try {
      const data = await apiFetch(`/saved-jobs/${user.id}`);
      setSavedJobIds(new Set(data.map((sj: any) => sj.jobId)));
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
    }
  };

  const handleToggleSave = async (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    if (!user) {
      toast({ title: "Login required", description: "Please login as a seeker to save jobs" });
      navigate("/auth");
      return;
    }
    if (user.role !== 'SEEKER') {
      toast({ title: "Seeker account required", description: "Only job seekers can save jobs" });
      return;
    }

    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await apiFetch(`/saved-jobs/${jobId}?seekerId=${user.id}`, { method: 'DELETE' });
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast({ title: "Job unsaved" });
      } else {
        await apiFetch(`/saved-jobs/${jobId}?seekerId=${user.id}`, { method: 'POST' });
        setSavedJobIds(prev => new Set(prev).add(jobId));
        toast({ title: "Job saved successfully!" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/jobs?page=${page}&size=${pageSize}`);
      const mappedJobs = data.map((j: any) => ({
        id: String(j.id),
        title: j.title,
        company: j.company,
        location: j.location || "Remote",
        type: j.jobType || "Full-time",
        salary: j.salaryRange || "Competitive",
        posted: j.postedAt || "Recently",
        deadline: j.deadline,
        description: j.description,
        tags: j.skills || [],
        qualifications: [],
        responsibilities: []
      }));
      setJobs(mappedJobs);
      setHasMore(data.length === pageSize);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedStatus();
  }, [user?.id, page]);

  const filtered = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "All" || j.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Browse <span className="gradient-text">Opportunities</span>
            </h1>
            <p className="text-muted-foreground">Discover roles matched to your skills</p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", "Full-time", "Remote", "Part-time", "Contract"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${typeFilter === t ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"}`}
                >
                  {t === "All" && <Filter className="w-3.5 h-3.5" />}
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Job Cards */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading live opportunities...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {filtered.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-primary/20 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg font-semibold text-foreground truncate">{job.title}</h3>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${typeColors[job.type] || ""}`}>{job.type}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.posted}</span>
                          {job.deadline && (
                            <span className={`flex items-center gap-1 font-medium ${new Date() > new Date(job.deadline) ? 'text-red-400' : 'text-amber-400'}`}>
                              <Calendar className="w-3.5 h-3.5" />
                              Exp: {new Date(job.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end">
                        <button
                          onClick={(e) => handleToggleSave(e, Number(job.id))}
                          className={`p-2 rounded-full transition-all mb-auto ${savedJobIds.has(Number(job.id)) ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                          {savedJobIds.has(Number(job.id)) ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                        <p className="font-display font-semibold text-foreground mb-2 mt-2">{job.salary}</p>
                        <button onClick={() => setSelectedJob(job)} className="text-sm font-medium text-primary hover:underline">View Details →</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page <span className="text-foreground font-medium">{page + 1}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!hasMore}
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">No jobs match your search.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-none bg-background border-border" style={{ scrollbarWidth: 'none' }}>
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold text-foreground">{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{selectedJob.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedJob.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedJob.posted}</span>
                  {selectedJob.deadline && (
                    <span className={`flex items-center gap-1 font-medium ${new Date() > new Date(selectedJob.deadline) ? 'text-red-400' : 'text-amber-400'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[selectedJob.type] || ""}`}>{selectedJob.type}</span>
                  <span className="font-display font-semibold text-foreground">{selectedJob.salary}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">{tag}</span>
                  ))}
                </div>

                <div>
                  <h4 className="font-display font-semibold text-foreground mb-2">Job Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                </div>

                {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-2">Qualifications</h4>
                    <ul className="space-y-2">
                      {selectedJob.qualifications.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-2">Key Responsibilities</h4>
                    <ul className="space-y-2">
                      {selectedJob.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => navigate("/auth")}
                  disabled={selectedJob.deadline ? new Date() > new Date(selectedJob.deadline) : false}
                  className="w-full rounded-lg px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: selectedJob.deadline && new Date() > new Date(selectedJob.deadline) ? "#3f3f46" : "var(--gradient-primary)" }}
                >
                  {selectedJob.deadline && new Date() > new Date(selectedJob.deadline) ? "Application Period Closed" : "Apply Now"}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
