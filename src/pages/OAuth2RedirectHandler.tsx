import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleOAuthLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const id = params.get("id");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role");
    const error = params.get("error");

    if (error) {
      toast({
        title: "Login Failed",
        description: error === "OAuth2AllowedForJobSeekerOnly" 
          ? "OAuth login is currently restricted to Job Seekers only." 
          : "An error occurred during authentication.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (token && id && name && email && role) {
      handleOAuthLogin({
        id: parseInt(id, 10) || id,
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        role: decodeURIComponent(role),
        token
      });

      // Retrieve where they came from before starting OAuth
      const returnPath = localStorage.getItem("oauth_return_to") || "/dashboard/user";
      localStorage.removeItem("oauth_return_to");
      
      // Navigate exactly to the same page or their designated path
      navigate(returnPath, { replace: true });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid authentication response.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [location, navigate, handleOAuthLogin]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="font-medium text-lg">Finalizing Login...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
