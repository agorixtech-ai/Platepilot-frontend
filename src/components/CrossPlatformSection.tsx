import { useId } from "react";
import { Check, Globe } from "lucide-react";
import "./cross-platform.css";

const FEATURES = [
  "Web Application",
  "Android App",
  "Tablet Optimized",
  "Cloud Sync",
  "Real-Time Updates",
] as const;

/** Mini PlatePielet dashboard mock shown inside device frames. */
function ScreenUI({ variant = "desktop" }: { variant?: "desktop" | "phone" }) {
  const gradId = useId().replace(/:/g, "");
  const phone = variant === "phone";

  return (
    <div className={`xp-screen${phone ? " xp-screen--phone" : ""}`}>
      <div className="xp-screen-bar">
        <span className="xp-brand-dot" />
        <span className="xp-brand-name">PlatePielet</span>
      </div>

      {phone ? (
        <>
          <div className="xp-phone-kpis">
            <div>
              <small>Sales</small>
              <strong>₹2.4L</strong>
            </div>
            <div>
              <small>Food cost</small>
              <strong>28%</strong>
            </div>
          </div>
          <svg className="xp-chart" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 30 L20 24 L40 28 L60 14 L80 20 L100 8 L120 12 L120 40 L0 40 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M0 30 L20 24 L40 28 L60 14 L80 20 L100 8 L120 12"
              fill="none"
              stroke="#16A34A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="xp-phone-tabs" aria-hidden>
            <span className="is-on" />
            <span />
            <span />
            <span />
            <span />
          </div>
        </>
      ) : (
        <>
          <div className="xp-screen-meta">
            <span />
            <span />
            <span />
          </div>
          <svg className="xp-chart" viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={`${gradId}-d`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 36 L18 28 L36 32 L54 18 L72 24 L90 10 L120 16 L120 48 L0 48 Z"
              fill={`url(#${gradId}-d)`}
            />
            <path
              d="M0 36 L18 28 L36 32 L54 18 L72 24 L90 10 L120 16"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="xp-screen-rows">
            <span />
            <span />
            <span />
          </div>
        </>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M3.6 2.8l9.8 9.2-2.7 2.7L3 5.4c-.3-.4-.3-1.5.6-2.6z" />
      <path fill="#FBBC04" d="M3 18.6l7.7-7.3 2.7 2.7-9.8 9.2c-.9-1.1-.9-2.2-.6-2.6z" />
      <path fill="#4285F4" d="M16.8 10.3l-3.1-1.8-2.8 2.7 2.8 2.7 3.1-1.8c1.2-.7 1.2-1.9 0-2.8z" />
      <path fill="#34A853" d="M10.9 11.2L3.6 2.8C4.1 2.2 4.8 2 5.4 2.3l11.4 6.5-6 2.4z" />
    </svg>
  );
}

export function CrossPlatformSection() {
  return (
    <section className="xp-section" id="platforms-everywhere" aria-labelledby="xp-heading">
      <div className="xp-inner">
        <div className="xp-badge">
          <Globe size={14} strokeWidth={2.25} />
          <span>Cross-platform</span>
        </div>

        <h2 id="xp-heading" className="xp-title">
          Available Everywhere
        </h2>
        <p className="xp-sub">
          Same PlatePielet Restaurant OS on web and Android — sales, food cost, and Pilot AI in your
          pocket.
        </p>

        <div className="xp-devices" aria-hidden>
          <div className="xp-device xp-monitor">
            <div className="xp-bezel">
              <ScreenUI />
            </div>
            <div className="xp-stand" />
            <div className="xp-base" />
          </div>

          <div className="xp-device xp-laptop">
            <div className="xp-bezel">
              <ScreenUI />
            </div>
            <div className="xp-laptop-deck" />
          </div>

          <div className="xp-device xp-tablet">
            <div className="xp-bezel xp-bezel-flat">
              <ScreenUI />
            </div>
          </div>

          <div className="xp-device xp-phone">
            <div className="xp-bezel xp-bezel-phone">
              <div className="xp-notch" />
              <ScreenUI variant="phone" />
            </div>
          </div>
        </div>

        <ul className="xp-pills">
          {FEATURES.map((label) => (
            <li key={label} className="xp-pill">
              <Check size={14} strokeWidth={2.75} />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="xp-stores">
          <a href="/demo" className="xp-store-btn" aria-label="Get it on Google Play">
            <PlayIcon />
            <span className="xp-store-copy">
              <small>Get it on</small>
              <strong>Google Play</strong>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
