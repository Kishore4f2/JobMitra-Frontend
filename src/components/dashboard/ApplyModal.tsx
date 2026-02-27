import React, { useState } from "react";
import { X, Upload, Loader2, FileText, Calendar } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ApplyModalProps {
    jobId: number;
    jobTitle: string;
    companyName: string;
    deadline?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ApplyModal = ({ jobId, jobTitle, companyName, deadline, onClose, onSuccess }: ApplyModalProps) => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    const isDeadlinePassed = deadline ? new Date() > new Date(deadline) : false;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                toast({ title: "Invalid File", description: "Please upload a PDF resume", variant: "destructive" });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user?.id || isDeadlinePassed) return;

        setLoading(true);
        const data = new FormData();
        data.append("jobId", String(jobId));
        data.append("seekerId", String(user.id));
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("resume", file);

        try {
            const response = await apiFetch("/applications/apply", {
                method: "POST",
                body: data,
            });

            if (typeof response === 'string' && response.includes("deadline")) {
                toast({ title: "Deadline Passed", description: response, variant: "destructive" });
                return;
            }

            toast({ title: "Application Submitted", description: `You've applied for ${jobTitle} at ${companyName}` });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Could not submit application", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-slate-950 rounded-2xl p-8 w-full max-w-lg border border-slate-800 shadow-2xl relative my-auto" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none rounded-2xl" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Apply for Opportunity</h2>
                        <p className="text-sm text-slate-400 mt-1">{jobTitle} <span className="text-blue-500 font-semibold">@ {companyName}</span></p>
                        {deadline && (
                            <div className={`mt-3 flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border ${isDeadlinePassed ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                <Calendar className="w-3.5 h-3.5" />
                                Deadline: {new Date(deadline).toLocaleDateString()} {isDeadlinePassed && "(Passed)"}
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-600"
                                placeholder="Edit your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-600"
                                placeholder="Edit your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resume (PDF Only)</label>
                        <div className="relative group min-h-[160px]">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                disabled={isDeadlinePassed}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                            />
                            <div className={`h-full border-2 border-dashed border-slate-800 group-hover:border-blue-500/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${isDeadlinePassed ? 'bg-zinc-900/50 opacity-50' : 'bg-slate-900/30'}`}>
                                {file ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className="text-sm font-semibold text-white truncate max-w-full px-4">{file.name}</span>
                                        <span className="text-xs text-blue-400 font-medium">Click to change file</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-300">Click or drag resume here</span>
                                        <span className="text-xs text-slate-500 font-medium">Only PDF files accepted</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!file || loading || isDeadlinePassed}
                            className="w-full rounded-xl px-6 py-4 font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-30 disabled:hover:brightness-100 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-zinc-700 disabled:to-zinc-800"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isDeadlinePassed ? (
                                "Application Period Closed"
                            ) : (
                                "Confirm & Submit Application"
                            )}
                        </button>
                        <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-medium">Secure application process by JobMithra</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;
