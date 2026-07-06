import { type ReactNode, useEffect } from "react";
import { IonPage, useIonViewWillEnter } from "@ionic/react";

/* Ionic keeps previous pages mounted in the navigation stack, so the title
   must be re-applied on every view activation, not just on mount. */
export function usePageTitle(title?: string) {
  useIonViewWillEnter(() => {
    if (title) document.title = title;
  }, [title]);
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}

/**
 * Shared page wrapper for the Ionic shell.
 *
 * Uses a plain scroll container instead of IonContent so the existing
 * Tailwind pages keep their document-style scrolling, backgrounds, and
 * position:fixed overlays exactly as designed.
 */
export function AppPage({
  children,
  title,
  scroll = true,
}: {
  children: ReactNode;
  title?: string;
  scroll?: boolean;
}) {
  usePageTitle(title);
  return (
    <IonPage className="app-ion-page">
      {scroll ? <div className="app-page-scroll">{children}</div> : children}
    </IonPage>
  );
}
