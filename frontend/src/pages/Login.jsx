import { useState } from "react";
import { Mail, Key } from "lucide-react";
import PrimaryButton from "../components/auth/PrimaryButton";
import AuthFooter from "../components/auth/AuthFooter";
import { Link } from "react-router-dom";

export default function Login() {

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("LOGIN DATA:", { email, password });

    // ici plus tard -> appel backend
    // fetch("/api/login", ...)
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

        {/*  FORM */}
        <form className="w-full" onSubmit={handleSubmit}>

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          <PrimaryButton type="submit">
            Connect
          </PrimaryButton>

        </form>

        <div className="w-full h-px bg-[#E2E8F0] my-6"></div>

        <div className="text-center">
          <p className="text-[13px] text-[#64748B]">
            Don’t have an account?
          </p>

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