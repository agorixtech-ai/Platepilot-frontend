import { Link } from "react-router-dom";

import { AppPage } from "@/components/ionic/AppPage";

export default function NotFoundPage() {
  return (
    <AppPage title="Page not found — PlatePilot">
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </AppPage>
  );
}
