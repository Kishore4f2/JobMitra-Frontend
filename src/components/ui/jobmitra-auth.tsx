import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Mail, Lock, User, Github, Linkedin, Chrome, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const JobMitraAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(location.pathname === "/register");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker");
  const { login, register } = useAuth();

  useEffect(() => {
    setIsActive(location.pathname === "/register");
    setShowForgot(false);
  }, [location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    try {
      const userData = await login(loginEmail, loginPassword, role);
      let redirectPath = "/dashboard/user";
      if (userData.role === "RECRUITER") redirectPath = "/dashboard/recruiter";
      if (userData.role === "ADMIN") redirectPath = "/dashboard/admin";

      navigate(redirectPath);
    } catch (error) {
      // Error handled by toast in AuthContext
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail })
      });
      toast({ title: "Reset link sent!", description: "Check your email for the reset instructions." });
      setShowForgot(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;
    try {
      await register(regName, regEmail, regPassword, role);
      setIsActive(false); // Switch to login view after successful registration
    } catch (error) {
      // Error handled by toast in AuthContext
    }
  };

  const inputClass =
    "w-full bg-[#0b1220] border border-blue-500/20 text-white placeholder:text-zinc-500 rounded-lg px-5 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 focus:shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all duration-300";

  const RoleToggle = () => (
    <div className="flex gap-2 p-1 rounded-lg bg-[#0b1220] border border-blue-500/10 mb-5">
      {(["seeker", "recruiter"] as const).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRole(r)}
          className={`flex-1 py-2 rounded-md text-xs font-medium transition-all duration-300 ${role === r
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
            : "text-zinc-400 hover:text-zinc-200"
            }`}
        >
          {r === "seeker" ? "Job Seeker" : "Recruiter"}
        </button>
      ))}
    </div>
  );

  const SocialButtons = () => (
    <div className="mt-5">
      <p className="text-zinc-500 text-xs text-center mb-3">Continue with AI-connected accounts</p>
      <div className="flex justify-center gap-3">
        {[Chrome, Github, Linkedin].map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="inline-flex p-2.5 border-2 border-blue-500/20 rounded-lg text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-110"
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 z-30 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .auth-container { animation: fadeInUp 0.6s ease-out; }
        .form-box {
          position: absolute;
          right: 0;
          width: 50%;
          height: 100%;
          background: #020617;
          display: flex;
          align-items: center;
          text-align: center;
          padding: 40px;
          z-index: 1;
          transition: 0.6s ease-in-out 1.2s, visibility 0s 1s;
        }
        .auth-container.active .form-box { right: 50%; }
        .form-box.register-form { visibility: hidden; }
        .auth-container.active .form-box.register-form { visibility: visible; }

        .toggle-box { position: absolute; width: 100%; height: 100%; }
        .toggle-box::before {
          content: '';
          position: absolute;
          left: -250%;
          width: 300%;
          height: 100%;
          background: linear-gradient(135deg, #2563eb, #4f46e5, #2563eb);
          border-radius: 150px;
          z-index: 2;
          transition: 1.8s ease-in-out;
        }
        .auth-container.active .toggle-box::before { left: 50%; }

        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 2;
          transition: 0.6s ease-in-out;
        }
        .toggle-panel.toggle-left {
          left: 0;
          transition-delay: 1.2s;
        }
        .auth-container.active .toggle-panel.toggle-left {
          left: -50%;
          transition-delay: 0.6s;
        }
        .toggle-panel.toggle-right {
          right: -50%;
          transition-delay: 0.6s;
        }
        .auth-container.active .toggle-panel.toggle-right {
          right: 0;
          transition-delay: 1.2s;
        }

        @media screen and (max-width: 768px) {
          .auth-container { height: calc(100vh - 40px) !important; }
          .form-box { bottom: 0; width: 100%; height: 70%; right: 0; padding: 20px; }
          .auth-container.active .form-box { right: 0; bottom: 30%; }
          .toggle-box::before { left: 0; top: -270%; width: 100%; height: 300%; border-radius: 20vw; }
          .auth-container.active .toggle-box::before { left: 0; top: 70%; }
          .toggle-panel { width: 100%; height: 30%; }
          .toggle-panel.toggle-left { top: 0; left: 0; }
          .auth-container.active .toggle-panel.toggle-left { left: 0; top: -30%; }
          .toggle-panel.toggle-right { right: 0; bottom: -30%; }
          .auth-container.active .toggle-panel.toggle-right { bottom: 0; }
        }
      `}</style>

      <div
        className={`auth-container relative w-full max-w-[850px] mx-5 rounded-[30px] border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-[#020617] overflow-hidden ${isActive ? "active" : ""}`}
        style={{ minHeight: "550px" }}
      >
        {/* Login Form */}
        <div className="form-box">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {!showForgot ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0 leading-tight">Welcome Back to JobMitra</h1>
                  <p className="text-zinc-400 text-sm mt-3 mb-5">Sign in to your account</p>
                  <form onSubmit={handleLogin} className="w-full">
                    <div className="relative my-5">
                      <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" className={inputClass} />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="relative my-5">
                      <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className={inputClass} />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="mb-4 -mt-2">
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-sm text-zinc-400 hover:text-blue-400 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <button type="submit" className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] border-none cursor-pointer">
                      Login
                    </button>
                  </form>
                  <SocialButtons />
                </motion.div>
              ) : (
                <motion.div
                  key="forgot-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0 leading-tight">Password Recovery</h1>
                  <p className="text-zinc-400 text-sm mt-3 mb-5">Enter your email to reset password</p>
                  <form onSubmit={handleForgotPassword} className="w-full">
                    <div className="relative my-5">
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Registration Email"
                        className={inputClass}
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] border-none cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="mt-4 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      Back to Login
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Register Form */}
        <div className="form-box register-form">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0 leading-tight">Create Your JobMitra Account</h1>
            <p className="text-zinc-400 text-sm mt-3 mb-5">Start your AI hiring journey</p>
            <RoleToggle />
            <form onSubmit={handleRegister} className="w-full">
              <div className="relative my-5">
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Full Name" className={inputClass} />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              </div>
              <div className="relative my-5">
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" className={inputClass} />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              </div>
              <div className="relative my-5">
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Password" className={inputClass} />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              </div>
              <button type="submit" className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] border-none cursor-pointer">
                Register
              </button>
            </form>
            <SocialButtons />
          </div>
        </div>

        {/* Toggle Overlay */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Hello, Welcome!</h1>
            <p className="text-blue-100/80 text-sm mb-5 max-w-[280px] mx-auto leading-relaxed">
              Start your intelligent hiring journey with smart job matching and secure profiles.
            </p>
            <button
              onClick={() => setIsActive(true)}
              className="w-40 h-11 rounded-lg border-2 border-white/40 bg-transparent text-white font-semibold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome Back!</h1>
            <p className="text-blue-100/80 text-sm mb-5 max-w-[280px] mx-auto leading-relaxed">
              Access your dashboard, smart applications, and recruiter insights instantly.
            </p>
            <button
              onClick={() => setIsActive(false)}
              className="w-40 h-11 rounded-lg border-2 border-white/40 bg-transparent text-white font-semibold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMitraAuth;
