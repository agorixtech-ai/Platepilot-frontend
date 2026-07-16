import { AppPage } from "@/components/ionic/AppPage";
import { AgorixNav } from "@/components/AgorixNav";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Check, Loader2 } from "lucide-react";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    restaurant: "",
    phone: "",
    posSystem: "",
    message: "",
  });

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          restaurant: form.restaurant,
          phone: form.phone,
          posSystem: form.posSystem,
          message: form.message,
          submittedAt: new Date().toISOString(),
        }),
      });

      // no-cors returns opaque response, so we can't check res.ok
      // If the fetch didn't throw, we treat it as success
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition";

  return (
    <div
      className="dark min-h-screen"
      style={{
        background: "#111113",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <AgorixNav sticky />

      <main className="pt-16 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-4 py-1.5 text-xs font-semibold backdrop-blur mb-6">
              <Calendar size={12} className="text-primary" />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Book your personalized demo
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                See RestaurantIQ in Action
              </span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Fill out the form below and we'll schedule a live walkthrough tailored to your
              restaurant's needs.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            {submitted ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-6">
                  <Check size={32} className="text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">You're on the list!</h2>
                <p className="text-white/60">
                  We'll reach out within 24 hours to schedule your demo.
                </p>
                <Link
                  to="/restaurant-iq"
                  className="inline-flex items-center gap-2 mt-8 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
                >
                  Back to RestaurantIQ
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={update("firstName")}
                      className={inputClass}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={update("lastName")}
                      className={inputClass}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Work email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    placeholder="john@restaurant.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Restaurant name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.restaurant}
                    onChange={update("restaurant")}
                    className={inputClass}
                    placeholder="Your Restaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClass}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Current POS / ERP system
                  </label>
                  <input
                    type="text"
                    value={form.posSystem}
                    onChange={update("posSystem")}
                    className={inputClass}
                    placeholder="e.g. Tally, Petpooja, Toast"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={update("message")}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us what you'd like to see in the demo..."
                  />
                </div>

                {error && <p className="text-destructive text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_rgba(20,184,166,0.35)] transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Schedule My Demo
                      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-white/40">
                  No credit card required · Free setup · We respect your privacy
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoPageRoute() {
  return (
    <AppPage title="Schedule a Demo — RestaurantIQ">
      <DemoPage />
    </AppPage>
  );
}
