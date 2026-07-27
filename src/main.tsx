import ReactDOM from "react-dom/client";

/* Ionic structural styles — required for IonApp/IonPage/IonContent layout.
   Optional Ionic theme/utility CSS is intentionally NOT imported so the
   existing Tailwind design system stays untouched. */
import "@ionic/react/css/core.css";
import "@ionic/react/css/structure.css";

/* Self-hosted Inter (variable, 100–900 in one subsetted woff2). Replaces the
   render-blocking Google Fonts <link> that used to live in index.html — no
   third-party DNS/TLS on first paint. */
import "@fontsource-variable/inter";

import "./styles.css";
import App from "./App";

/* No StrictMode: IonReactRouter's page-transition stack manager is not
   StrictMode-safe (double-mounted effects freeze transitions mid-flight). */
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
