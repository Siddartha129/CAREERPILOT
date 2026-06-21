import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Analytics } from "./pages/Analytics.jsx";
import { ApplicationTracker } from "./pages/ApplicationTracker.jsx";
import { InternshipDetails } from "./pages/InternshipDetails.jsx";
import { InternshipExplorer } from "./pages/InternshipExplorer.jsx";
import { Login } from "./pages/Login.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Register } from "./pages/Register.jsx";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "internships", element: <InternshipExplorer /> },
          { path: "internships/:id", element: <InternshipDetails /> },
          { path: "tracker", element: <ApplicationTracker /> },
          { path: "analytics", element: <Analytics /> }
        ]
      }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);
