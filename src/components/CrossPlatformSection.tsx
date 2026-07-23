import { useId } from "react";
import { Check, Globe } from "lucide-react";

const FEATURES = [
  "Web Application",
  "Android App",
  "Tablet Optimized",
  "Cloud Sync",
  "Real-Time Updates",
] as const;

function ScreenUI() {
  const gradId = useId().replace(/:/g, "");

  return (
    <div className="xp-screen">
      <div className="xp-screen-bar" />
      <div className="xp-screen-meta">
        <span />
        <span />
        <span />
      </div>
      <svg className="xp-chart" viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 36 L18 28 L36 32 L54 18 L72 24 L90 10 L120 16 L120 48 L0 48 Z"
          fill={`url(#${gradId})`}
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
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
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
        <p className="xp-sub">Manage your restaurant from anywhere.</p>

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
              <ScreenUI />
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
          {/* <a href="/demo" className="xp-store-btn" aria-label="Download on the App Store">
            <AppleIcon />
            <span className="xp-store-copy">
              <small>Download on the</small>
              <strong>App Store</strong>
            </span>
          </a> */}
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
