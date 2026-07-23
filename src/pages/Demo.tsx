import { AppPage } from "@/components/ionic/AppPage";
import { AgorixNav } from "@/components/AgorixNav";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Check, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/apiBase";

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
      const res = await fetch(`${API_URL}/demo-requests`, {
        method: "POST",
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

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || `HTTP ${res.status}`);
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition";

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <AgorixNav sticky variant="light" />

      <main className="pt-16 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-4 py-1.5 text-xs font-semibold backdrop-blur mb-6">
              <Calendar size={12} className="text-primary" />
              <span className="text-brand-gradient">Book your personalized demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-brand-gradient">See PlatePilot in Action</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
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
                <p className="text-muted-foreground">
                  We'll reach out within 24 hours to schedule your demo.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 mt-8 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition"
                >
                  Back to Home
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-border bg-card p-8 md:p-10"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Work email
                  </label>
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
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
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

                <p className="text-center text-xs text-muted-foreground">
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
    <AppPage title="Schedule a Demo — PlatePilot">
      <DemoPage />
    </AppPage>
  );
}
