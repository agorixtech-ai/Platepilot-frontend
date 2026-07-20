import type { ReactNode } from "react";
import { AppLogo } from "@/components/AppLogo";

const AUTH_ANIMATIONS = `
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .auth-spin-slow{animation:spin-slow 60s linear infinite}
  .auth-spin-slow-r{animation:spin-slow 45s linear infinite reverse}
  @keyframes authFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .auth-fade-up{animation:authFadeUp 0.3s ease-out both}
`;

export function AuthPageShell({
  children,
  visual,
  minHeight = 640,
}: {
  children: ReactNode;
  visual: ReactNode;
  minHeight?: number;
}) {
  return (
    <div
      className="auth-page min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background text-foreground"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{AUTH_ANIMATIONS}</style>

      <div className="absolute top-[8%] left-[8%] w-[480px] h-[480px] rounded-full bg-primary/[0.06] blur-[140px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(22,163,74,0.08) 0%, transparent 55%)",
        }}
      />

      <main
        className="auth-card w-full max-w-[1100px] rounded-[28px] flex flex-col md:flex-row p-3 md:p-4 relative z-10"
        style={{ minHeight }}
      >
        <div className="w-full md:w-[50%] p-7 md:p-10 flex flex-col">
          <div className="mb-8">
            <AppLogo
              to="/"
              showText
              className="hover:opacity-80 transition-opacity"
              textClassName="font-extrabold text-2xl tracking-tight text-foreground"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-[380px] w-full mx-auto">
            {children}
          </div>
        </div>
        {visual}
      </main>
    </div>
  );
}

export function AuthVisualPanel({ children }: { children: ReactNode }) {
  return (
    <div className="auth-visual hidden md:flex w-[50%] rounded-[20px] flex-col justify-between p-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(21,32,25,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(21,32,25,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {children}
    </div>
  );
}
