import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AccountInactive from "./pages/auth/AccountInactive";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ErrorPage from "./pages/Error";
import GuestRoute from "./components/auth/GuestRoute";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import PatientRoute from "./components/auth/PatientRoute";
import IntakeRoute from "./components/auth/IntakeRoute";

// Patient Intake Module
import IntakePage from "./pages/modules/patient-intake/IntakePage";
import IntakeRedirect from "./pages/modules/patient-intake/IntakeRedirect";
import PatientsListPage from "./pages/modules/patient-intake/admin/PatientsListPage";
import PatientDetailPage from "./pages/modules/patient-intake/admin/PatientDetailPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // Guest routes (unauthenticated users)
      {
        element: <GuestRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />,
          },
        ],
      },
      // Authenticated routes (any authenticated user, even inactive)
      {
        element: <AuthenticatedRoute />,
        children: [
          {
            path: "/account-inactive",
            element: <AccountInactive />,
          },
        ],
      },
      // Admin routes
      {
        element: <AdminRoute />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/patients",
            element: <PatientsListPage />,
          },
          {
            path: "/admin/patients/:id",
            element: <PatientDetailPage />,
          },
        ],
      },
      // Patient intake routes (must complete before accessing patient dashboard)
      {
        element: <IntakeRoute />,
        children: [
          {
            path: "/intake",
            element: <IntakeRedirect />,
          },
          {
            path: "/intake/step/:step",
            element: <IntakePage />,
          },
        ],
      },
      // Patient routes (requires completed intake)
      {
        element: <PatientRoute />,
        children: [
          {
            path: "/patient",
            element: <PatientDashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export type AppRoute = (typeof router)["routes"][number];
