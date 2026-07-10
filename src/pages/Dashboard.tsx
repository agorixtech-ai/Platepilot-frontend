import { Redirect, Route, Switch } from "react-router-dom";

import { AppPage } from "@/components/ionic/AppPage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getStoredUser } from "@/lib/auth";
import Overview from "./dashboard/Overview";
import Pos from "./dashboard/Pos";
import Tally from "./dashboard/Tally";
import Inventory from "./dashboard/Inventory";
import MenuEngineering from "./dashboard/MenuEngineering";
import Suppliers from "./dashboard/Suppliers";
import MarketPrices from "./dashboard/MarketPrices";
import Branches from "./dashboard/Branches";
import Reviews from "./dashboard/Reviews";
import Ai from "./dashboard/Ai";
import Reports from "./dashboard/Reports";
import Team from "./dashboard/Team";
import Profile from "./dashboard/Profile";
import Settings from "./dashboard/Settings";

/* One IonPage for the whole dashboard: the inner Switch swaps content while
   the sidebar/header shell stays mounted. DashboardLayout owns scrolling. */
export default function DashboardPage() {
  /* Declarative guard: an imperative history.replace() during the initial
     Ionic route transition gets swallowed, so redirect at render time. */
  if (!getStoredUser()) return <Redirect to="/login" />;

  return (
    <AppPage title="Dashboard — PlatePilot" scroll={false}>
      <DashboardLayout>
        <Switch>
          <Route exact path="/dashboard" component={Overview} />
          <Route exact path="/dashboard/pos" component={Pos} />
          <Route exact path="/dashboard/tally" component={Tally} />
          <Route exact path="/dashboard/inventory" component={Inventory} />
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
      </DashboardLayout>
    </AppPage>
  );
}
