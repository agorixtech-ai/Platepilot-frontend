import { lazy, Suspense, type ComponentType } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { AppPage } from "@/components/ionic/AppPage";
import { DashboardLayout, pageKeyOf } from "@/components/dashboard/DashboardLayout";
import { canOpenPage, getStoredUser } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { isNativeApp } from "@/lib/native";

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
// Phone-first modules (bottom tabs: Home · Insights · Alerts · AI · More)
const MobileHome = lazy(() => import("./dashboard/MobileHome"));
const Insights = lazy(() => import("./dashboard/Insights"));
const Alerts = lazy(() => import("./dashboard/Alerts"));
const FoodCost = lazy(() => import("./dashboard/FoodCost"));
const Purchasing = lazy(() => import("./dashboard/Purchasing"));
const Waste = lazy(() => import("./dashboard/Waste"));
const More = lazy(() => import("./dashboard/More"));
const MobileSales = lazy(() => import("./dashboard/MobileSales"));
const MobileInventory = lazy(() => import("./dashboard/MobileInventory"));
const MobileMenu = lazy(() => import("./dashboard/MobileMenu"));
const MobileAi = lazy(() => import("./dashboard/MobileAi"));
const MobileBranches = lazy(() => import("./dashboard/MobileBranches"));

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
  const compact = useIsMobile() || isNativeApp();
  if (!getStoredUser()) return <Redirect to="/login" />;

  return (
    <AppPage title="Dashboard — PlatePielet" scroll={false}>
      <DashboardLayout>
        <Suspense fallback={<div className="min-h-full bg-background" aria-busy="true" />}>
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={gate("overview", compact ? MobileHome : Overview)}
            />
            {/* New modules reuse existing role keys (matching the endpoints they call),
                so no backend/auth/pages.py change or role re-grant is needed. */}
            <Route exact path="/dashboard/insights" component={Insights} />
            <Route exact path="/dashboard/alerts" render={gate("overview", Alerts)} />
            <Route exact path="/dashboard/food-cost" render={gate("overview", FoodCost)} />
            <Route exact path="/dashboard/purchasing" render={gate("inventory", Purchasing)} />
            <Route exact path="/dashboard/waste" render={gate("inventory", Waste)} />
            <Route exact path="/dashboard/more" component={More} />
            <Route exact path="/dashboard/pos" render={gate("pos", compact ? MobileSales : Pos)} />
            <Route exact path="/dashboard/tally" render={gate("tally", Tally)} />
            <Route
              exact
              path="/dashboard/inventory"
              render={gate("inventory", compact ? MobileInventory : Inventory)}
            />
            <Route exact path="/dashboard/menu" render={gate("menu", Menu)} />
            <Route
              exact
              path="/dashboard/menu-engineering"
              render={gate("menu-engineering", compact ? MobileMenu : MenuEngineering)}
            />
            <Route exact path="/dashboard/suppliers" render={gate("suppliers", Suppliers)} />
            <Route
              exact
              path="/dashboard/market-prices"
              render={gate("market-prices", MarketPrices)}
            />
            <Route
              exact
              path="/dashboard/branches"
              render={gate("branches", compact ? MobileBranches : Branches)}
            />
            <Route exact path="/dashboard/reviews" render={gate("reviews", Reviews)} />
            <Route exact path="/dashboard/ai" render={gate("ai", compact ? MobileAi : Ai)} />
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
