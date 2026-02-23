import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import FullPageSpinner from "@/components/ui/FullPageSpinner";

export default function IntakeRedirect() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const intake = useQuery(
    api.modules.patientIntake.patientIntake.getMyIntake,
    user?._id ? { userId: user._id } : "skip"
  );

  const initializeIntake = useMutation(api.modules.patientIntake.patientIntake.initializeIntake);

  useEffect(() => {
    if (user && intake === null) {
      initializeIntake({
        userId: user._id,
        email: user.email,
      }).catch(console.error);
    }
  }, [user, intake, initializeIntake]);

  useEffect(() => {
    if (intake) {
      if (intake.intakeCompleted) {
        navigate("/patient", { replace: true });
      } else {
        navigate(`/intake/step/${intake.intakeStep}`, { replace: true });
      }
    }
  }, [intake, navigate]);

  if (isUserLoading || !user || intake === undefined) {
    return <FullPageSpinner />;
  }

  return <FullPageSpinner />;
}
