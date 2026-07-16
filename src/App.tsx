import { Component, type ErrorInfo, type ReactNode } from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "./components/theme-provider";
import { reportLovableError } from "./lib/lovable-error-reporting";
import IndexPage from "./pages/Index";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DemoPage from "./pages/Demo";
import RestaurantIQPage from "./pages/RestaurantIQ";
import DashboardPage from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFound";

/* mode: "md" keeps one consistent look across iOS/Android/desktop so the
   existing Tailwind design system renders identically everywhere.
   animated: false matches the previous router (no page transitions) and
   avoids Ionic's stack transitions on pages that use plain scroll
   containers instead of IonContent. */
setupIonicReact({ mode: "md", animated: false });

const queryClient = new QueryClient();

class RootErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
    reportLovableError(error, { boundary: "root_error_boundary" });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <RootErrorBoundary>
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet id="main">
                <Route exact path="/" component={IndexPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignupPage} />
                <Route exact path="/demo" component={DemoPage} />
                <Route exact path="/restaurant-iq" component={RestaurantIQPage} />
                <Route path="/dashboard" component={DashboardPage} />
                <Route component={NotFoundPage} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </RootErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
