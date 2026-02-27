import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast({ title: "Error", description: "Invalid or missing token.", variant: "destructive" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match!", variant: "destructive" });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await apiFetch("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, newPassword })
            });
            setSuccess(true);
            toast({ title: "Success!", description: "Your password has been reset successfully." });
            setTimeout(() => navigate("/auth"), 3000);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-[#0b1220] border border-blue-500/20 text-white placeholder:text-zinc-500 rounded-lg px-5 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 focus:shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all duration-300";

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md p-8 rounded-[30px] border border-blue-500/20 bg-[#020617] shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create New Password</h1>
                    <p className="text-zinc-400 text-sm mt-2">Secure your JobMitra account with a new password</p>
                </div>

                {success ? (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center py-6"
                    >
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Password Reset!</h2>
                        <p className="text-zinc-400 text-sm">Redirecting you to login page...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-2 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className={inputClass}
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-2 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    className={inputClass}
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] border-none cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </button>

                        {!token && (
                            <p className="text-center text-red-400 text-xs mt-4">
                                Error: Password reset token is missing. Please use the link from your email.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => navigate("/auth")}
                            className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
