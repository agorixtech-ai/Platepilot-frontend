import { useState, type FormEvent, type ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import EyeIcon from "@/components/ui/icons/eye-icon";
import EyeOffIcon from "@/components/ui/icons/eye-off-icon";
import LogoutIcon from "@/components/ui/icons/logout-icon";

import { CARD, SectionTitle } from "@/components/dashboard/MobileUI";
import { NAV_ITEMS, pageKeyOf } from "@/components/dashboard/navItems";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  canOpenPage,
  changePassword,
  clearTokens,
  getMe,
  getStoredUser,
  logout,
  updateProfile,
  updateStoredUser,
} from "@/lib/auth";
import { isNativeApp } from "@/lib/native";

// Mirrors backend validation (auth/models.py + auth/utils.validate_password_strength)
// so people see what's wrong before the server rejects it.
const NAME_RE = /^[\p{L} '.-]+$/u;
const PASSWORD_RULES: { label: string; ok: (p: string) => boolean }[] = [
  { label: "8+ characters", ok: (p) => p.length >= 8 },
  { label: "Uppercase letter", ok: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", ok: (p) => /[a-z]/.test(p) },
  { label: "Number", ok: (p) => /\d/.test(p) },
  { label: "Special character", ok: (p) => /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(p) },
];

function nameError(value: string): string | null {
  if (value.length < 2) return "Name must be at least 2 characters.";
  if (value.length > 100) return "Name must be 100 characters or fewer.";
  if (!NAME_RE.test(value)) return "Use letters, spaces, hyphens, apostrophes and dots only.";
  return null;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
      {children}
    </span>
  );
}

export default function Profile() {
  const history = useHistory();
  const qc = useQueryClient();
  const compact = useIsMobile() || isNativeApp();

  // Same key as DashboardLayout so both stay in sync (header initials, sidebar name).
  const { data } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const fresh = await getMe();
      if (fresh) updateStoredUser(fresh);
      return fresh;
    },
    staleTime: 30_000,
  });
  const user = data ?? getStoredUser();

  const [name, setName] = useState(() => getStoredUser()?.full_name ?? "");
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  if (!user) return null;

  const initials = user.full_name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });
  const modules = NAV_ITEMS.filter(
    (i) => i.to !== "/dashboard/profile" && canOpenPage(pageKeyOf(i.to), user),
  );

  const trimmed = name.trim();
  const nameDirty = trimmed !== user.full_name;
  const rulesMet = PASSWORD_RULES.map((r) => r.ok(next));
  const canChangePw =
    !!current && rulesMet.every(Boolean) && next === confirm && next !== current && !savingPw;

  const saveName = async (e: FormEvent) => {
    e.preventDefault();
    const err = nameError(trimmed);
    setNameErr(err);
    if (err) return;
    setSavingName(true);
    try {
      const updated = await updateProfile(trimmed);
      qc.setQueryData(["auth", "me"], updated);
      setName(updated.full_name);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't update your profile.");
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!canChangePw) return;
    setSavingPw(true);
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't change your password.");
    } finally {
      setSavingPw(false);
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch {
      clearTokens();
    }
    toast.success("Signed out successfully.");
    history.push("/login");
  };

  const pwType = show ? "text" : "password";
  const primaryBtn =
    "w-full rounded-full bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-opacity disabled:opacity-40";

  return (
    <div className="mx-auto max-w-xl space-y-1 px-4 pb-4">
      {!compact && (
        <h1 className="pb-2 text-2xl font-bold tracking-tight text-foreground">Profile</h1>
      )}

      <div className="flex items-center gap-4 rounded-2xl bg-success/10 p-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-[22px] font-bold text-primary-foreground">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-bold text-foreground">{user.full_name}</p>
          <p className="truncate text-[13px] text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.role_name && <Chip>{user.role_name}</Chip>}
            {user.is_admin && <Chip>Admin</Chip>}
            {user.is_verified && (
              <Chip>
                <ShieldCheck className="h-3 w-3 text-success" /> Verified
              </Chip>
            )}
          </div>
        </div>
      </div>
      <p className="pt-1 text-center text-[11px] text-muted-foreground">
        Member since {memberSince}
      </p>

      <SectionTitle>Personal details</SectionTitle>
      <form onSubmit={saveName} className={`${CARD} space-y-3 p-4`}>
        <Field label="Full name" error={nameErr ?? undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameErr(null);
            }}
            autoComplete="name"
            maxLength={100}
          />
        </Field>
        <Field label="Email">
          <Input value={user.email} readOnly disabled />
        </Field>
        <button type="submit" disabled={!nameDirty || savingName} className={primaryBtn}>
          {savingName ? "Saving…" : "Save changes"}
        </button>
      </form>

      <SectionTitle
        right={
          user.provider === "local" ? (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="flex items-center gap-1 text-[12px] font-semibold text-primary"
            >
              {show ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
              {show ? "Hide" : "Show"}
            </button>
          ) : undefined
        }
      >
        Change password
      </SectionTitle>
      {user.provider === "local" ? (
        <form onSubmit={savePassword} className={`${CARD} space-y-3 p-4`}>
          <Field label="Current password">
            <Input
              type={pwType}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Field label="New password">
            <Input
              type={pwType}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              maxLength={128}
            />
          </Field>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {PASSWORD_RULES.map((r, i) => (
              <span
                key={r.label}
                className={`flex items-center gap-1 text-[11px] ${
                  rulesMet[i] ? "text-success" : "text-muted-foreground"
                }`}
              >
                {rulesMet[i] ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                {r.label}
              </span>
            ))}
          </div>
          <Field
            label="Confirm new password"
            error={confirm && next !== confirm ? "Passwords don't match." : undefined}
          >
            <Input
              type={pwType}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              maxLength={128}
            />
          </Field>
          <button type="submit" disabled={!canChangePw} className={primaryBtn}>
            {savingPw ? "Updating…" : "Update password"}
          </button>
        </form>
      ) : (
        <p className={`${CARD} p-4 text-[13px] text-muted-foreground`}>
          You signed in with {user.provider}, so your password is managed there.
        </p>
      )}

      <SectionTitle>Your access</SectionTitle>
      <div className={`${CARD} p-4`}>
        <p className="mb-2 text-[12px] text-muted-foreground">
          {user.is_admin
            ? "Administrator — you can open every module."
            : "Modules your role can open. Ask an admin to change this."}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {modules.map((m) => (
            <span
              key={m.to}
              className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success"
            >
              {m.label}
            </span>
          ))}
          {modules.length === 0 && (
            <span className="text-[12px] text-muted-foreground">No modules assigned yet.</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-destructive/40 bg-card py-3 text-[14px] font-semibold text-destructive"
      >
        <LogoutIcon className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
