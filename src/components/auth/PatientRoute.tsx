import { Navigate, Outlet } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import { useAuthHydration } from "@/lib/auth-hydration";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { api } from "../../../convex/_generated/api";

export default function PatientRoute() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const showLoader = useAuthHydration(isAuthLoading || isUserLoading);

  const intake = useQuery(
    api.modules.patientIntake.patientIntake.getMyIntake,
    user?._id ? { userId: user._id } : "skip"
  );

  if (showLoader) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Still loading user data (user being auto-created)
  if (user === undefined || user === null) {
    return <FullPageSpinner />;
  }

  // Check if user is active
  if (!user.isActive) {
    return <Navigate to="/account-inactive" replace />;
  }

  // Not a patient - redirect to admin dashboard
  if (user.role !== "patient") {
    return <Navigate to="/admin" replace />;
  }

  // Still loading intake data
  if (intake === undefined) {
    return <FullPageSpinner />;
  }

  // If intake is not completed, redirect to intake funnel
  if (!intake?.intakeCompleted) {
    return <Navigate to="/intake" replace />;
  }

  return <Outlet />;
}
