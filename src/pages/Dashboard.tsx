import { lazy, Suspense, type ComponentType } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { AppPage } from "@/components/ionic/AppPage";
import { DashboardLayout, pageKeyOf } from "@/components/dashboard/DashboardLayout";
import { canOpenPage, getStoredUser } from "@/lib/auth";

// Dashboard sections are independent screens. Lazy loading prevents charts,
// maps, and AI UI from being downloaded before the user opens them.
const Overview = lazy(() => import("./dashboard/Overview"));
const Pos = lazy(() => import("./dashboard/Pos"));
const Tally = lazy(() => import("./dashboard/Tally"));
const Inventory = lazy(() => import("./dashboard/Inventory"));
const Menu = lazy(() => import("./dashboard/Menu"));
const MenuEngineering = lazy(() => import("./dashboard/MenuEngineering"));
const Suppliers = lazy(() => import("./dashboard/Suppliers"));
const MarketPrices = lazy(() => import("./dashboard/MarketPrices"));
const Branches = lazy(() => import("./dashboard/Branches"));
const Reviews = lazy(() => import("./dashboard/Reviews"));
const Ai = lazy(() => import("./dashboard/Ai"));
const Reports = lazy(() => import("./dashboard/Reports"));
const Team = lazy(() => import("./dashboard/Team"));
const Profile = lazy(() => import("./dashboard/Profile"));
const Settings = lazy(() => import("./dashboard/Settings"));

/* Route-level access gate. The backend 403s these endpoints anyway; this keeps
   a blocked user from landing on an empty screen full of errors. */
function Gated({ page, component: Page }: { page: string; component: ComponentType }) {
  const { pathname } = useLocation();
  if (canOpenPage(page)) return <Page />;
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-lg font-semibold text-foreground">No access to this page</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Your role doesn&apos;t include <span className="font-medium">{pageKeyOf(pathname)}</span>.
        Ask an admin to update it.
      </p>
    </div>
  );
}

const gate = (page: string, component: ComponentType) => () => (
  <Gated page={page} component={component} />
);

/* One IonPage for the whole dashboard: the inner Switch swaps content while
   the sidebar/header shell stays mounted. DashboardLayout owns scrolling. */
export default function DashboardPage() {
  /* Declarative guard: an imperative history.replace() during the initial
     Ionic route transition gets swallowed, so redirect at render time. */
  if (!getStoredUser()) return <Redirect to="/login" />;

  return (
    <AppPage title="Dashboard — PlatePielet" scroll={false}>
      <DashboardLayout>
        <Suspense fallback={<div className="min-h-full bg-background" aria-busy="true" />}>
          <Switch>
            <Route exact path="/dashboard" render={gate("overview", Overview)} />
            <Route exact path="/dashboard/pos" render={gate("pos", Pos)} />
            <Route exact path="/dashboard/tally" render={gate("tally", Tally)} />
            <Route exact path="/dashboard/inventory" render={gate("inventory", Inventory)} />
            <Route exact path="/dashboard/menu" render={gate("menu", Menu)} />
            <Route
              exact
              path="/dashboard/menu-engineering"
              render={gate("menu-engineering", MenuEngineering)}
            />
            <Route exact path="/dashboard/suppliers" render={gate("suppliers", Suppliers)} />
            <Route
              exact
              path="/dashboard/market-prices"
              render={gate("market-prices", MarketPrices)}
            />
            <Route exact path="/dashboard/branches" render={gate("branches", Branches)} />
            <Route exact path="/dashboard/reviews" render={gate("reviews", Reviews)} />
            <Route exact path="/dashboard/ai" render={gate("ai", Ai)} />
            <Route exact path="/dashboard/reports" render={gate("reports", Reports)} />
            <Route exact path="/dashboard/team" render={gate("team", Team)} />
            <Route exact path="/dashboard/profile" component={Profile} />
            <Route exact path="/dashboard/settings" render={gate("settings", Settings)} />
            <Redirect to="/dashboard" />
          </Switch>
        </Suspense>
      </DashboardLayout>
    </AppPage>
  );
}
