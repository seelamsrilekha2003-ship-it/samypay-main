import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { PaymentProvider } from "./context/PaymentContext";
import PaymentDrawer from "./components/PaymentDrawer";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <PaymentProvider>
          <AppRoutes />
          <PaymentDrawer />
        </PaymentProvider>
      </ToastProvider>
    </HashRouter>
  );
}
