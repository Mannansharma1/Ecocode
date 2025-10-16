// src/pages/SignupPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { auth, signUp, updateUserProfile, signInWithGoogle } from "../lib/firebase";
import { User, Mail, Lock, ArrowRight, Check, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate?.() as any;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signUp(form.email, form.password);
      if (res.user) {
        await updateUserProfile({ displayName: form.name });
        navigate?.("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.user) navigate?.("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] flex items-center justify-center py-24 px-4">
      <Card className="max-w-md w-full p-8 shadow-xl rounded-2xl border border-[#A0D9B4] bg-white">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-[#326B5D] mb-2">Create an account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Join <span className="font-semibold text-[#326B5D]">CityShield</span> — Let’s make India cleaner & greener 🌱
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FC8A9]"
                placeholder="Full name"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FC8A9]"
                placeholder="you@example.com"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FC8A9]"
                placeholder="Create a password"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#326B5D] text-white hover:bg-[#2A594E]"
              disabled={loading}
            >
              {loading ? "Creating..." : <>Sign In </>}
            </Button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* 🔥 Google Sign-in Button */}
          <Button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 border border-[#7FC8A9] text-[#326B5D] bg-white hover:bg-[#F0FAF3]"
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </Button>

          <div className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#326B5D] font-medium hover:underline">
              Login
            </a>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}
