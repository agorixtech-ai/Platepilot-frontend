import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign In — RestaurantIQ" },
      {
        name: "description",
        content:
          "Sign in to RestaurantIQ to access your dashboard, reports, and AI-powered insights.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
  }),
});

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number };
    let particles: P[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(60, Math.floor((width * height) / 20000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.4 + 0.15,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 18000) {
            const alpha = (1 - d2 / 18000) * 0.15;
            ctx.strokeStyle = `rgba(20,184,166,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20,184,166,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [restaurant, setRestaurant] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#0a0a0c",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -20%, rgba(20,184,166,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(20,184,166,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at -10% 50%, rgba(20,184,166,0.04) 0%, transparent 50%)
          `
        }} />
        <ParticleCanvas />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <header className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-[#0a0a0c]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-white/90 hover:text-white transition-colors">
            <span className="tracking-tight">λgorix</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/restaurant-iq"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="animate-float inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.04] px-4 py-1.5 text-xs font-semibold backdrop-blur mb-6"
            >
              <Sparkles size={12} className="text-teal-400" />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {isSignUp ? "Create your account" : "Welcome back"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {isSignUp ? "Get started with" : "Sign in to"}{" "}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                RestaurantIQ
              </span>
            </h1>
            <p className="text-white/40 text-sm">
              {isSignUp
                ? "No credit card required. Setup in under 3 hours."
                : "Access your AI-powered restaurant dashboard."}
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-[1px] rounded-2xl opacity-50 animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(20,184,166,0.2), transparent 40%, transparent 60%, rgba(20,184,166,0.1))'
              }}
            />
            <div className="relative rounded-2xl border border-white/[0.06] bg-[#0d0d10]/90 backdrop-blur-xl p-8 md:p-10">
              {/* Social buttons */}
              <div className="grid gap-3 mb-6">
                <button
                  type="button"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.05] hover:text-white active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.05] hover:text-white active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0d0d10] px-3 text-white/30">or continue with email</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {isSignUp && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1.5">
                        First name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-teal-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-500/20"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1.5">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-teal-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-500/20"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">
                      Restaurant name
                    </label>
                    <input
                      type="text"
                      value={restaurant}
                      onChange={(e) => setRestaurant(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-teal-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-500/20"
                      placeholder="Your Restaurant"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-teal-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-500/20"
                      placeholder="john@restaurant.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-10 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-teal-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-teal-500/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-teal-400/60 hover:text-teal-300 transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-teal-500 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(20,184,166,0.3)] transition hover:from-teal-400 hover:to-teal-500 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                  </span>
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/40">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-teal-400 hover:text-teal-300 font-medium transition"
                  >
                    {isSignUp ? "Sign in" : "Get started free"}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/20">
            By continuing, you agree to our{" "}
            <a href="#" className="text-white/30 underline hover:text-white/50 transition">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-white/30 underline hover:text-white/50 transition">
              Privacy Policy
            </a>
          </p>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-4 py-2">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              <span className="text-xs text-white/30">
                Enterprise-grade security • SOC 2 compliant
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
