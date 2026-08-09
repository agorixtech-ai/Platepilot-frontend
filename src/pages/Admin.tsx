import { useMemo, useState, type ReactNode } from "react";
import { Link, Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  MailCheck,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users as UsersIcon,
  X,
} from "lucide-react";

import { AppPage } from "@/components/ionic/AppPage";
import { AppLogo } from "@/components/AppLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TONE_ICON_BG, type Tone } from "@/components/dashboard/shared";
import { cn } from "@/lib/utils";
import {
  clearTokens,
  createRole,
  deleteRole,
  getStoredUser,
  listPages,
  listRoles,
  listUsers,
  logout as apiLogout,
  updateRole,
  updateUser,
  type AdminUser,
  type PageInfo,
  type Role,
} from "@/lib/auth";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", to: "/admin" },
  { icon: UsersIcon, label: "Users", to: "/admin/users" },
  { icon: KeyRound, label: "Roles", to: "/admin/roles" },
];

/* Shared queries — react-query dedupes them across the admin screens. */
function useAdminUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: listUsers, staleTime: 30_000 });
}

function useRoles() {
  return useQuery({ queryKey: ["admin", "roles"], queryFn: listRoles, staleTime: 30_000 });
}

function usePages() {
  return useQuery({ queryKey: ["admin", "pages"], queryFn: listPages, staleTime: Infinity });
}

/* ── Shell ───────────────────────────────────────────────── */
function AdminShell({ children }: { children: ReactNode }) {
  const history = useHistory();
  const { pathname } = useLocation();
  const me = getStoredUser();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      clearTokens();
    }
    toast.success("Signed out successfully.");
    history.push("/login");
  };

  const initials = (me?.full_name ?? "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarProvider className="dashboard-shell min-h-screen bg-background">
      <Sidebar collapsible="icon" className="border-r border-sidebar-border/80 bg-sidebar">
        <SidebarHeader className="!gap-0 !p-0 shrink-0 border-b border-sidebar-border/80">
          <div className="flex h-full w-full items-center justify-between gap-2 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <AppLogo
              to="/admin"
              showText
              subtitle="Admin Console"
              className="flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center"
              textWrapperClassName="group-data-[collapsible=icon]:hidden"
              textClassName="text-sidebar-foreground"
              subtitleClassName="text-sidebar-primary/80"
            />
            <SidebarTrigger
              title="Collapse sidebar"
              className="h-9 w-9 shrink-0 rounded-xl text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="py-2 overflow-x-hidden">
          <SidebarGroup className="px-2 py-1">
            <SidebarGroupLabel className="px-2 pb-1.5 pt-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.to}
                      tooltip={item.label}
                      className={cn(
                        "h-10 rounded-xl text-[13px] font-medium text-sidebar-foreground",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
                      )}
                    >
                      <Link to={item.to} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/80 p-3 gap-2">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-sidebar-border/60">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-[12px] font-semibold leading-tight text-sidebar-foreground">
                {me?.full_name ?? "Admin"}
              </p>
              <p className="truncate text-[10px] text-sidebar-foreground/50">Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 flex-1 justify-start gap-2 rounded-lg px-2 text-[11px] font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex flex-col overflow-hidden bg-background dashboard-canvas">
        <header className="sticky top-0 z-[var(--z-sticky)] shrink-0 border-b border-border bg-card">
          <div className="dashboard-topbar-inner flex w-full items-center gap-3 px-4 sm:px-6 md:px-8">
            <SidebarTrigger className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground [&_svg]:size-4 md:hidden" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Admin console
              </h1>
              <p className="hidden text-[12px] text-muted-foreground sm:block">
                Platform-wide accounts and access — signed in as {me?.email}
              </p>
            </div>
            <Badge className="shrink-0 gap-1.5 rounded-full bg-primary/15 text-primary hover:bg-primary/15">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Badge>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof UsersIcon;
  tone: Tone;
  hint?: string;
}) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardContent className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              TONE_ICON_BG[tone],
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-[20px] font-bold leading-tight tabular-nums text-foreground">{value}</p>
        {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

/* ── Overview ────────────────────────────────────────────── */
function AdminOverview() {
  const { data: users, isLoading, error } = useAdminUsers();

  const stats = useMemo(() => {
    const list = users ?? [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: list.length,
      admins: list.filter((u) => u.is_admin).length,
      verified: list.filter((u) => u.is_verified).length,
      newThisWeek: list.filter((u) => new Date(u.created_at).getTime() >= weekAgo).length,
      google: list.filter((u) => u.provider === "google").length,
      recent: [...list]
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 5),
    };
  }, [users]);

  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  const n = (v: number) => (isLoading ? "…" : v.toLocaleString());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total users" value={n(stats.total)} icon={UsersIcon} tone="primary" />
        <StatCard label="Admins" value={n(stats.admins)} icon={ShieldCheck} tone="info" />
        <StatCard
          label="Verified"
          value={n(stats.verified)}
          icon={MailCheck}
          tone="success"
          hint={`${n(stats.google)} via Google`}
        />
        <StatCard
          label="New this week"
          value={n(stats.newThisWeek)}
          icon={UserPlus}
          tone="warning"
        />
      </div>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardContent className="px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent signups</h2>
            <Link to="/admin/users" className="text-[12px] font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border/60">
            {stats.recent.map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-2.5">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-muted text-[11px] font-bold text-muted-foreground">
                    {u.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{u.full_name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{u.email}</p>
                </div>
                {u.is_admin && (
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    Admin
                  </Badge>
                )}
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!isLoading && stats.recent.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No users yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Users ───────────────────────────────────────────────── */
function AdminUsers() {
  const queryClient = useQueryClient();
  const me = getStoredUser();
  const [q, setQ] = useState("");
  const { data: users, isLoading, error } = useAdminUsers();
  const { data: roles } = useRoles();

  const patchUser = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { is_admin?: boolean; role_id?: string | null };
      message: string;
    }) => updateUser(id, patch),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
      toast.success(vars.message);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = (users ?? []).filter((u: AdminUser) =>
    `${u.full_name} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="pl-9"
          />
        </div>
        <span className="shrink-0 text-[12px] text-muted-foreground">
          {filtered.length} of {users?.length ?? 0}
        </span>
      </div>

      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}

      <div className="rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Loading users…
                </TableCell>
              </TableRow>
            )}
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.full_name}
                  {u.id === me?.id && (
                    <span className="ml-2 text-[11px] text-muted-foreground">(you)</span>
                  )}
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {u.provider}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <select
                    value={u.role_id ?? ""}
                    disabled={patchUser.isPending}
                    onChange={(e) =>
                      patchUser.mutate({
                        id: u.id,
                        patch: { role_id: e.target.value || null },
                        message: e.target.value ? "Role updated." : "Role cleared.",
                      })
                    }
                    className="h-8 rounded-lg border border-input bg-background px-2 text-[12px] font-medium text-foreground outline-none focus:border-primary/70"
                  >
                    <option value="">No access</option>
                    {(roles ?? []).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {/* Own row is locked — the backend rejects self-revoke anyway */}
                  <ToggleSwitch
                    checked={u.is_admin}
                    disabled={u.id === me?.id || patchUser.isPending}
                    onCheckedChange={(checked) =>
                      patchUser.mutate({
                        id: u.id,
                        patch: { is_admin: checked },
                        message: checked ? "Admin access granted." : "Admin access revoked.",
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No users match “{q}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ── Roles ───────────────────────────────────────────────── */
function RoleEditor({
  role,
  pages,
  onClose,
}: {
  role: Role | null; // null = creating
  pages: PageInfo[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(role?.name ?? "");
  const [selected, setSelected] = useState<string[]>(role?.pages ?? []);

  const save = useMutation({
    mutationFn: () =>
      role ? updateRole(role.id, name.trim(), selected) : createRole(name.trim(), selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(role ? "Role updated." : "Role created.");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const groups = [...new Set(pages.map((p) => p.group))];
  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  return (
    <Card className="border border-primary/30 bg-card shadow-sm">
      <CardContent className="px-5 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {role ? `Edit role — ${role.name}` : "New role"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Role name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Branch Manager"
          className="mb-4 max-w-sm"
          autoFocus
        />

        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Pages this role can open
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-1.5 text-[11px] font-semibold text-foreground">{g}</p>
              <div className="space-y-1.5">
                {pages
                  .filter((p) => p.group === g)
                  .map((p) => (
                    <label
                      key={p.key}
                      className="flex cursor-pointer items-center gap-2 text-[12px] text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(p.key)}
                        onChange={() => toggle(p.key)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                      />
                      {p.label}
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Button
            size="sm"
            disabled={name.trim().length < 2 || save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? "Saving…" : role ? "Save changes" : "Create role"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {selected.length} of {pages.length} pages
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminRoles() {
  const queryClient = useQueryClient();
  const { data: roles, isLoading, error } = useRoles();
  const { data: pages } = usePages();
  const [editing, setEditing] = useState<Role | null | undefined>(undefined); // undefined = closed

  const remove = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role deleted — its users now have no page access.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pageLabel = (key: string) => pages?.find((p) => p.key === key)?.label ?? key;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">
          A role is a named set of dashboard pages. Assign one per user under Users.
        </p>
        <Button size="sm" onClick={() => setEditing(null)} disabled={editing !== undefined}>
          <Plus className="mr-1.5 h-4 w-4" />
          New role
        </Button>
      </div>

      {editing !== undefined && pages && (
        <RoleEditor
          key={editing?.id ?? "new"}
          role={editing}
          pages={pages}
          onClose={() => setEditing(undefined)}
        />
      )}

      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading roles…</p>}

      <div className="grid gap-3 md:grid-cols-2">
        {(roles ?? []).map((r) => (
          <Card key={r.id} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="px-5 py-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{r.name}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {r.user_count} user{r.user_count === 1 ? "" : "s"} · {r.pages.length} page
                    {r.pages.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setEditing(r)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(r.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {r.pages.length === 0 && (
                  <span className="text-[11px] text-muted-foreground">No pages</span>
                )}
                {r.pages.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px] font-medium">
                    {pageLabel(p)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  // Declarative guard (see Dashboard.tsx) — the backend enforces it too.
  const user = getStoredUser();
  if (!user) return <Redirect to="/login" />;
  if (!user.is_admin) return <Redirect to="/dashboard" />;

  return (
    <AppPage title="Admin — PlatePielet" scroll={false}>
      <AdminShell>
        <Switch>
          <Route exact path="/admin" component={AdminOverview} />
          <Route exact path="/admin/users" component={AdminUsers} />
          <Redirect to="/admin" />
        </Switch>
      </AdminShell>
    </AppPage>
  );
}
