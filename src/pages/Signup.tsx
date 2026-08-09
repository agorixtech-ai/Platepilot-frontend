import { AppPage } from "@/components/ionic/AppPage";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { register as apiRegister } from "../lib/auth";
import { AuthPageShell, AuthVisualPanel } from "@/components/auth/AuthPageShell";
import { AuthIconBox, AuthSubmitButton } from "@/components/auth/AuthFormShared";

/* ── Spinner ─────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ── Main ────────────────────────────────────────────────── */
function SignupPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const pwdChecks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special", ok: /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password) },
  ];
  const strength = pwdChecks.filter((c) => c.ok).length;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (strength < 5) {
      toast.error("Password doesn't meet all requirements.");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms.");
      return;
    }
    setIsLoading(true);
    // Registration signs the user straight in (OTP verification is disabled).
    apiRegister(fullName, email, password)
      .then(() => {
        toast.success("Welcome to PlatePielet!");
        history.push("/dashboard");
      })
      .catch((err) => toast.error(err.message || "Registration failed."))
      .finally(() => setIsLoading(false));
  };

  return (
    <AuthPageShell
      minHeight={680}
      visual={
        <AuthVisualPanel>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full auth-pill mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Secure Signup</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Your account,
              <br />
              <span className="text-[#D97706]">ready in seconds</span>
            </h2>
            <p className="mt-4 text-sm text-white/80 leading-relaxed max-w-[300px]">
              Passwords are hashed with bcrypt and sessions are secured with signed JWT tokens.
            </p>
          </div>

          <div className="relative w-[260px] h-[260px] mx-auto flex items-center justify-center my-6">
            <div className="w-[240px] h-[240px] rounded-full border auth-orbital-ring absolute auth-spin-slow" />
            <div className="w-[170px] h-[170px] rounded-full border auth-orbital-ring absolute auth-spin-slow-r" />
            <div className="w-[100px] h-[100px] rounded-full border auth-orbital-ring absolute auth-spin-slow" />
            <div className="w-16 h-16 rounded-full auth-orbital-core flex items-center justify-center z-10">
              <span className="text-xl font-extrabold">λ</span>
            </div>
            {[
              { label: "JWT Session", pos: "top-[4%] left-[50%] -translate-x-1/2" },
              { label: "Encrypted", pos: "top-[50%] left-[2%] -translate-y-1/2" },
              { label: "Secure", pos: "top-[50%] right-[2%] -translate-y-1/2" },
              { label: "Multi-tenant", pos: "bottom-[4%] left-[50%] -translate-x-1/2" },
            ].map((b) => (
              <div
                key={b.label}
                className={`absolute ${b.pos} px-2.5 py-1.5 rounded-full auth-badge-float shadow-lg`}
              >
                <span className="text-[10px] font-semibold text-[var(--brand-muted)] whitespace-nowrap">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </AuthVisualPanel>
      }
    >
      <div className="auth-fade-up">
        <AuthIconBox>
          <User className="w-5 h-5" />
        </AuthIconBox>
        <h1 className="text-[26px] font-extrabold text-foreground tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground font-medium mb-7">
          Fill in your details — you'll be signed in right away.
        </p>

        <form className="space-y-3.5" onSubmit={handleRegister}>
          {/* Full name */}
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 auth-input border focus:border-primary/70 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground font-medium outline-none transition"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@enterprise.com"
                className="w-full pl-10 pr-4 py-3 auth-input border focus:border-primary/70 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground font-medium outline-none transition"
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 auth-input border focus:border-primary/70 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground font-medium outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= strength
                          ? strength <= 2
                            ? "bg-destructive"
                            : strength <= 3
                              ? "bg-warning"
                              : "bg-success"
                          : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {pwdChecks.map((c) => (
                    <span
                      key={c.label}
                      className={`text-[10px] font-semibold ${c.ok ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {c.ok ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                className={`w-full pl-10 pr-10 py-3 auth-input border rounded-xl text-sm text-foreground placeholder:text-muted-foreground font-medium outline-none transition focus:ring-2 focus:ring-primary/10
                          ${confirmPassword && confirmPassword !== password ? "border-destructive/50 focus:border-destructive/70" : "focus:border-primary/70"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-[11px] text-destructive mt-1 font-medium">Passwords do not match</p>
            )}
          </div>
          {/* Terms */}
          <div className="flex items-start gap-2.5 pt-0.5">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-border bg-secondary text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer mt-0.5 shrink-0"
            />
            <span className="text-[12px] font-medium text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <button type="button" className="auth-link font-bold hover:underline">
                Terms
              </button>{" "}
              and{" "}
              <button type="button" className="auth-link font-bold hover:underline">
                Privacy Policy
              </button>
            </span>
          </div>

          <AuthSubmitButton disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                Creating account…
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </AuthSubmitButton>
        </form>

        <p className="text-center text-[12px] text-muted-foreground font-medium mt-5">
          Already have an account?{" "}
          <Link to="/login" className="auth-link font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}

export default function SignupPageRoute() {
  return (
    <AppPage title="Create Account — PlatePielet">
      <SignupPage />
    </AppPage>
  );
}
