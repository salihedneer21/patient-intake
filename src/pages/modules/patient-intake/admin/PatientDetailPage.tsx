import { useParams } from "react-router-dom";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { PatientIntakeDetail } from "@/components/modules/patient-intake/admin";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Invalid patient ID</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PatientIntakeDetail intakeId={id as Id<"patientIntake">} />
    </div>
  );
}
