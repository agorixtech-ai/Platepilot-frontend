import {
  Component,
  lazy,
  Suspense,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "./components/theme-provider";
import { reportLovableError } from "./lib/lovable-error-reporting";

// Route-level chunks keep marketing and dashboard-only dependencies out of the
// initial download. Each screen is fetched only when its route is opened.
const IndexPage = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const DemoPage = lazy(() => import("./pages/Demo"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

/* mode: "md" keeps one consistent look across iOS/Android/desktop so the
   existing Tailwind design system renders identically everywhere.
   animated: false matches the previous router (no page transitions) and
   avoids Ionic's stack transitions on pages that use plain scroll
   containers instead of IonContent. */
setupIonicReact({ mode: "md", animated: false });

const queryClient = new QueryClient();

function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-busy="true" />;
}

function LazyRoute({ component: Page }: { component: ComponentType }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Page />
    </Suspense>
  );
}

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
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
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
      <ThemeProvider>
        <RootErrorBoundary>
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet id="main">
                <Route exact path="/" render={() => <LazyRoute component={IndexPage} />} />
                <Route exact path="/login" render={() => <LazyRoute component={LoginPage} />} />
                <Route exact path="/signup" render={() => <LazyRoute component={SignupPage} />} />
                <Route exact path="/demo" render={() => <LazyRoute component={DemoPage} />} />
                <Route path="/dashboard" render={() => <LazyRoute component={DashboardPage} />} />
                <Route render={() => <LazyRoute component={NotFoundPage} />} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </RootErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
