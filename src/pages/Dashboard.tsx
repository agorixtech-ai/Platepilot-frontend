import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { AppPage } from "@/components/ionic/AppPage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getStoredUser } from "@/lib/auth";

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

/* One IonPage for the whole dashboard: the inner Switch swaps content while
   the sidebar/header shell stays mounted. DashboardLayout owns scrolling. */
export default function DashboardPage() {
  /* Declarative guard: an imperative history.replace() during the initial
     Ionic route transition gets swallowed, so redirect at render time. */
  if (!getStoredUser()) return <Redirect to="/login" />;

  return (
    <AppPage title="Dashboard — PlatePilot" scroll={false}>
      <DashboardLayout>
        <Suspense fallback={<div className="min-h-full bg-background" aria-busy="true" />}>
          <Switch>
            <Route exact path="/dashboard" component={Overview} />
            <Route exact path="/dashboard/pos" component={Pos} />
            <Route exact path="/dashboard/tally" component={Tally} />
            <Route exact path="/dashboard/inventory" component={Inventory} />
            <Route exact path="/dashboard/menu" component={Menu} />
            <Route exact path="/dashboard/menu-engineering" component={MenuEngineering} />
            <Route exact path="/dashboard/suppliers" component={Suppliers} />
            <Route exact path="/dashboard/market-prices" component={MarketPrices} />
            <Route exact path="/dashboard/branches" component={Branches} />
            <Route exact path="/dashboard/reviews" component={Reviews} />
            <Route exact path="/dashboard/ai" component={Ai} />
            <Route exact path="/dashboard/reports" component={Reports} />
            <Route exact path="/dashboard/team" component={Team} />
            <Route exact path="/dashboard/profile" component={Profile} />
            <Route exact path="/dashboard/settings" component={Settings} />
            <Redirect to="/dashboard" />
          </Switch>
        </Suspense>
      </DashboardLayout>
    </AppPage>
  );
}
