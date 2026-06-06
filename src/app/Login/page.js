"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result?.error) {
      router.push("/Dashboard");
    } else {
      alert(result.error || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2ede8] font-sans p-5">
      <div className="w-full max-w-[420px] bg-[#faf7f4] p-10 rounded-2xl border border-black/5 shadow-xl">
        
        <h2 className="text-2xl font-bold text-[#1a1208] mb-2">Sign In</h2>
        <p className="text-sm text-[#9c836a] mb-6">
          New here? <a href="/Signup" className="text-[#8b5e3c] font-medium hover:underline">Create an account</a>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#9c836a] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg border border-[#e5d9cc] bg-white text-sm outline-none focus:border-[#8b5e3c] focus:ring-1 focus:ring-[#8b5e3c]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#9c836a] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg border border-[#e5d9cc] bg-white text-sm outline-none focus:border-[#8b5e3c] focus:ring-1 focus:ring-[#8b5e3c]"
            />
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-[#8b5e3c] font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#8b5e3c] text-white font-semibold rounded-lg p-3.5 text-sm hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        {/* Divider */}
       

      </div>
    </div>
  );
}