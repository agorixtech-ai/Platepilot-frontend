import ReactDOM from "react-dom/client";

/* Ionic structural styles — required for IonApp/IonPage/IonContent layout.
   Optional Ionic theme/utility CSS is intentionally NOT imported so the
   existing Tailwind design system stays untouched. */
import "@ionic/react/css/core.css";
import "@ionic/react/css/structure.css";

import "./styles.css";
import App from "./App";

/* No StrictMode: IonReactRouter's page-transition stack manager is not
   StrictMode-safe (double-mounted effects freeze transitions mid-flight). */
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
