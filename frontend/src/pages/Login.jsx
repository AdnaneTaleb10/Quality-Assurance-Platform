import { useState } from "react";
import { Mail, Key } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import PrimaryButton from "../components/auth/PrimaryButton";
import AuthFooter from "../components/auth/AuthFooter";
import { login } from "../services/authService";
import { validateLogin } from "../utils/validate";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const error = validateLogin({ email, password });
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      const result = await login({ email, password });
      toast.success(`Welcome back, ${result.user.name}!`);

      const role = result.user.role;
      if (role === "Admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7FA] relative font-sans">
      <div className="w-[380px] bg-white border border-[#E2E8F0] rounded-xl shadow-sm pt-10 pb-8 px-10 flex flex-col items-center">
        <div className="mb-4">
          <img src="/favicon.svg" className="w-6 h-6" />
        </div>

        <h1 className="text-[20px] font-semibold text-[#334155] mb-8">
          Log in
        </h1>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[10px] font-semibold text-[#255DAD] uppercase mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@institution.org"
                className="w-full pl-10 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2B6CB0]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-semibold text-[#255DAD] uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2B6CB0]"
              />
            </div>
          </div>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </PrimaryButton>
        </form>

        <div className="w-full h-px bg-[#E2E8F0] my-6" />

        <div className="text-center">
          <p className="text-[13px] text-[#64748B]">Don't have an account?</p>
          <Link
            to="/signup"
            className="text-[#2B6CB0] text-[13px] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <AuthFooter absolute />
    </div>
  );
}
