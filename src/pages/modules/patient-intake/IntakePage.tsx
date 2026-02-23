import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import {
  IntakeLayout,
  DemographicsForm,
  AddressForm,
  InsuranceForm,
  MedicalHistoryForm,
  ConsentForm,
  ReviewStep,
} from "@/components/modules/patient-intake";

export default function IntakePage() {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const currentStep = step ? parseInt(step, 10) : 1;

  // Get intake record
  const intake = useQuery(
    api.modules.patientIntake.patientIntake.getMyIntake,
    user?._id ? { userId: user._id } : "skip"
  );

  // Initialize intake mutation
  const initializeIntake = useMutation(api.modules.patientIntake.patientIntake.initializeIntake);

  // Initialize intake if not exists
  useEffect(() => {
    if (user && intake === null) {
      initializeIntake({
        userId: user._id,
        email: user.email,
      }).catch(console.error);
    }
  }, [user, intake, initializeIntake]);

  // Redirect to patient dashboard if intake is complete
  useEffect(() => {
    if (intake?.intakeCompleted) {
      navigate("/patient", { replace: true });
    }
  }, [intake, navigate]);

  // Redirect to current step if trying to skip ahead
  useEffect(() => {
    if (intake && currentStep > intake.intakeStep) {
      navigate(`/intake/step/${intake.intakeStep}`, { replace: true });
    }
  }, [intake, currentStep, navigate]);

  if (isUserLoading || !user || intake === undefined) {
    return <FullPageSpinner />;
  }

  if (intake === null) {
    return <FullPageSpinner />;
  }

  const handleNext = () => {
    navigate(`/intake/step/${currentStep + 1}`);
  };

  const handleBack = () => {
    navigate(`/intake/step/${currentStep - 1}`);
  };

  const handleEdit = (step: number) => {
    navigate(`/intake/step/${step}`);
  };

  const handleComplete = () => {
    navigate("/patient", { replace: true });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Address";
      case 3:
        return "Insurance Information";
      case 4:
        return "Medical History";
      case 5:
        return "Consent Forms";
      case 6:
        return "Review & Submit";
      default:
        return "Patient Intake";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Please provide your personal and demographic information.";
      case 2:
        return "Enter your current residential address.";
      case 3:
        return "Provide your insurance details for billing purposes.";
      case 4:
        return "Share your medical history to help us provide better care. This step is optional.";
      case 5:
        return "Review and accept the required consent forms.";
      case 6:
        return "Review all your information before submitting.";
      default:
        return "";
    }
  };

  return (
    <IntakeLayout
      currentStep={currentStep}
      title={getStepTitle()}
      description={getStepDescription()}
    >
      {currentStep === 1 && (
        <DemographicsForm
          userId={user._id}
          intake={intake}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <AddressForm
          userId={user._id}
          intake={intake}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <InsuranceForm
          userId={user._id}
          intake={intake}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <MedicalHistoryForm
          userId={user._id}
          intake={intake}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 5 && (
        <ConsentForm
          userId={user._id}
          intake={intake}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 6 && (
        <ReviewStep
          userId={user._id}
          intake={intake}
          onEdit={handleEdit}
          onComplete={handleComplete}
        />
      )}
    </IntakeLayout>
  );
}
