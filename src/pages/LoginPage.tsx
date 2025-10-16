// src/pages/LoginPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { signIn, signInWithGoogle } from "../lib/firebase";
import { Mail, Lock, Send, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate?.() as any;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(form.email, form.password);
      navigate?.("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate?.("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] flex items-center justify-center py-24 px-4">
      <Card className="max-w-md w-full p-8 shadow-xl border border-gray-200">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold text-[#326B5D] mb-2">Welcome Back!</h2>
          <p className="text-sm text-gray-600 mb-6">Log in to continue to <strong>CityShield</strong></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-gray-700">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7FC8A9]"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block text-sm text-gray-700">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#7FC8A9]"
                  placeholder="Password"
                />
              </div>
            </label>

            {error && <div className="text-sm text-red-600 text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#326B5D] text-white hover:bg-[#2A594E]"
              disabled={loading}
            >
              {loading ? "Signing in..." : <>Log in </>}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center justify-center">
            <span className="h-[1px] w-16 bg-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or</span>
            <span className="h-[1px] w-16 bg-gray-300" />
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </Button>

          <div className="mt-6 text-sm text-gray-600 text-center">
            New here?{" "}
            <Link to="/signup" className="text-[#326B5D] font-medium hover:underline">
              Create an account
            </Link>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}
