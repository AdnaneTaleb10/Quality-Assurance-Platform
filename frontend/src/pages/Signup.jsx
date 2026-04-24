import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PrimaryButton from "../components/auth/PrimaryButton";
import AuthFooter from "../components/auth/AuthFooter";
import { signup } from "../services/authService";
import { validateRegister } from "../utils/validate";

export default function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const error = validateRegister({ name, email, role, password });
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      await signup({ name, email, role, password });
      toast.success("Account created! You can now log in.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FA] overflow-hidden">
      <div className="flex-grow" />

      <div className="flex justify-center px-4">
        <div className="w-[380px] bg-white border border-[#E2E8F0] rounded-xl shadow-sm pt-5 pb-5 px-10 flex flex-col items-center">

          <div className="mb-2">
            <img src="/favicon.svg" className="w-6 h-6" />
          </div>

          <h1 className="text-[20px] font-semibold text-[#334155]">
            Create Account
          </h1>

          <p className="text-[12px] text-[#64748B] text-center mt-1 mb-4">
            Join the Institutional Excellence Quality Assurance platform.
          </p>

          <form className="w-full" onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="mb-3">
              <label className="block text-[10px] font-semibold text-[#255DAD] uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Julian Pierce"
                className="w-full border-b border-[#CBD5E1] py-1.5 text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#2B6CB0]"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="block text-[10px] font-semibold text-[#255DAD] uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="j.pierce@university.edu"
                className="w-full border-b border-[#CBD5E1] py-1.5 text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#2B6CB0]"
              />
            </div>

            {/* ROLE */}
            <div className="mb-3 relative">
              <label className="block text-[10px] font-semibold text-[#255DAD] uppercase mb-1">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-b border-[#CBD5E1] py-1.5 text-sm text-[#334155] appearance-none bg-transparent focus:outline-none"
              >
                <option value="">Choose institutional role...</option>
                <option value="1">Admin</option>
                <option value="2">Dean</option>
                <option value="3">Head of Department</option>
                <option value="4">Rector</option>
              </select>
              <ChevronDown className="absolute right-0 top-[28px] w-4 h-4 text-[#64748B] pointer-events-none" />
            </div>

            {/* PASSWORD */}
            <div className="mb-5 relative">
              <label className="block text-[10px] font-semibold text-[#255DAD] uppercase mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-b border-[#CBD5E1] py-1.5 text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#2B6CB0] pr-6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-[26px]"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4 text-[#64748B]" />
                  : <Eye    className="w-4 h-4 text-[#64748B]" />
                }
              </button>
            </div>

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "CREATE"}
            </PrimaryButton>

          </form>

          <div className="text-center mt-4">
            <p className="text-[12px] text-[#64748B]">Already have access?</p>
            <Link
              to="/login"
              className="text-[#2B6CB0] text-[12px] font-semibold hover:underline"
            >
              Return to Login
            </Link>
          </div>

        </div>
      </div>

      <div className="flex-grow" />
      <AuthFooter />
    </div>
  );
}