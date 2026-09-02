import { AppPage } from "@/components/ionic/AppPage";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { login as apiLogin, testLogin, type AuthTokens } from "../lib/auth";
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
function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // Admins land on the admin console, everyone else on the dashboard.
  const goAfterLogin = (data: AuthTokens) =>
    history.push(data.user.is_admin ? "/admin" : "/dashboard");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Fill in all fields.");
      return;
    }
    setIsLoading(true);
    apiLogin(email, password)
      .then((data) => {
        toast.success("Welcome back!");
        goAfterLogin(data);
      })
      .catch((err) => toast.error(err.message || "Login failed."))
      .finally(() => setIsLoading(false));
  };

  // TEMPORARY: one-click demo login (test@gmail.com / test@123)
  const handleTestLogin = () => {
    setIsLoading(true);
    testLogin()
      .then((data) => {
        toast.success("Signed in as test user!");
        goAfterLogin(data);
      })
      .catch((err) => toast.error(err.message || "Test login failed."))
      .finally(() => setIsLoading(false));
  };

  return (
    <AuthPageShell
      visual={
        <AuthVisualPanel>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full auth-pill mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Secure Login</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              One dashboard for
              <br />
              <span className="text-[#D97706]">every outlet</span>
            </h2>
            <p className="mt-4 text-sm text-white/80 leading-relaxed max-w-[300px]">
              Sign in with your email and password. Sessions are secured with signed JWT tokens.
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
              { label: "JWT", icon: "🔑", pos: "top-[4%] left-[50%] -translate-x-1/2" },
              { label: "Encrypted", icon: "🔐", pos: "top-[50%] left-[4%] -translate-y-1/2" },
              { label: "Multi-tenant", icon: "🏢", pos: "top-[50%] right-[4%] -translate-y-1/2" },
              { label: "Role-based", icon: "✓", pos: "bottom-[4%] left-[50%] -translate-x-1/2" },
            ].map((b) => (
              <div
                key={b.label}
                className={`absolute ${b.pos} flex items-center gap-1.5 px-2.5 py-1.5 rounded-full auth-badge-float shadow-lg`}
              >
                <span className="text-xs">{b.icon}</span>
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
          <Lock className="w-5 h-5" />
        </AuthIconBox>
        <h1 className="text-[26px] font-extrabold text-foreground tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground font-medium mb-7">
          Sign in with your email and password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                autoFocus
                placeholder="user@enterprise.com"
                className="w-full pl-10 pr-4 py-3 auth-input border focus:border-primary/70 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground font-medium outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 auth-input border focus:border-primary/70 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground font-medium outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AuthSubmitButton disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </AuthSubmitButton>
        </form>

        {/* Test user (TEMPORARY — remove before production) */}
        <button
          type="button"
          onClick={handleTestLogin}
          disabled={isLoading}
          className="auth-btn-secondary mt-4 w-full py-3 border border-dashed rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FlaskConical className="w-4 h-4" />
          Login as Test User
        </button>

        <p className="text-center text-[12px] text-muted-foreground font-medium mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}

export default function LoginPageRoute() {
  return (
    <AppPage title="Sign In — PlatePielet">
      <LoginPage />
    </AppPage>
  );
}
