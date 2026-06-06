"use client";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const pwStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthMeta = [
    null,
    { label: "Weak", color: "bg-rose-500 text-rose-500" },
    { label: "Fair", color: "bg-amber-500 text-amber-500" },
    { label: "Good", color: "bg-emerald-500 text-emerald-500" },
    { label: "Strong", color: "bg-cyan-500 text-cyan-500" },
  ][pwStrength];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      alert("Account created!");
    }, 1400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2ede8] font-sans p-5">
      <div className="w-full max-w-[420px] bg-[#faf7f4] p-10 rounded-2xl border border-black/5 shadow-xl">
        
        <h2 className="text-2xl font-bold text-[#1a1208] mb-2">Create account</h2>
        <p className="text-sm text-[#9c836a] mb-6">
          Already a member? <a href="/Login" className="text-[#8b5e3c] font-medium hover:underline">Sign in</a>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#9c836a] uppercase tracking-wider">
              Full name
            </label>
            <input
              type="text"
              required
              placeholder="Jane Smith"
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-lg border border-[#e5d9cc] bg-white text-sm outline-none focus:border-[#8b5e3c] focus:ring-1 focus:ring-[#8b5e3c]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#9c836a] uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="jane@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg border border-[#e5d9cc] bg-white text-sm outline-none focus:border-[#8b5e3c] focus:ring-1 focus:ring-[#8b5e3c]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#9c836a] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Min. 8 characters"
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg border border-[#e5d9cc] bg-white text-sm outline-none focus:border-[#8b5e3c] focus:ring-1 focus:ring-[#8b5e3c]"
            />
            
            {/* Dynamic Password Strength Visual Indicator */}
            {password && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                        i <= pwStrength ? strengthMeta?.color.split(" ")[0] : "bg-[#e5d9cc]"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[11px] font-semibold min-w-[36px] text-right ${strengthMeta?.color.split(" ")[1]}`}>
                  {strengthMeta?.label}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-[#9c836a] leading-relaxed mt-1">
            By signing up you agree to our <a href="#" className="text-[#8b5e3c] hover:underline">Terms</a> and <a href="#" className="text-[#8b5e3c] hover:underline">Privacy Policy</a>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`text-white font-semibold rounded-lg p-3.5 text-sm hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 mt-2 ${
              success ? "bg-emerald-600" : "bg-[#8b5e3c]"
            }`}
          >
            {loading ? "Creating..." : success ? "Account created! ✓" : "Create my account →"}
          </button>
        </form>

       

      </div>
    </div>
  );
}