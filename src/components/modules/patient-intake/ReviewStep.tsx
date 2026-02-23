import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon, CheckIcon } from "lucide-react";

interface ReviewStepProps {
  userId: Id<"users">;
  intake: Doc<"patientIntake">;
  onEdit: (step: number) => void;
  onComplete: () => void;
}

export function ReviewStep({ userId, intake, onEdit, onComplete }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeIntake = useMutation(api.modules.patientIntake.patientIntake.completeIntake);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeIntake({ userId });
      onComplete();
    } catch (err) {
      console.error("Failed to complete intake:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Please review your information below. Click &quot;Edit&quot; on any section to make changes.
      </p>

      {/* Demographics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Demographics</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(1)}
            className="h-8"
          >
            <EditIcon className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-muted-foreground">Name:</span>{" "}
              {intake.firstName} {intake.lastName}
            </div>
            <div>
              <span className="text-muted-foreground">Date of Birth:</span>{" "}
              {formatDate(intake.dateOfBirth)}
            </div>
            <div>
              <span className="text-muted-foreground">Sex at Birth:</span>{" "}
              {intake.sexAtBirth}
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>{" "}
              {intake.phone}
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>{" "}
              {intake.email}
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span>{" "}
              {intake.preferredLanguage}
            </div>
            <div>
              <span className="text-muted-foreground">Weight:</span>{" "}
              {intake.weightLbs} lbs
            </div>
            <div>
              <span className="text-muted-foreground">Height:</span>{" "}
              {intake.heightFt}&apos;{intake.heightIn}&quot;
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Address</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(2)}
            className="h-8"
          >
            <EditIcon className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{intake.street}</p>
          <p>
            {intake.city}, {intake.state} {intake.zipCode}
          </p>
        </CardContent>
      </Card>

      {/* Insurance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Insurance</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(3)}
            className="h-8"
          >
            <EditIcon className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-muted-foreground">Provider:</span>{" "}
              {intake.insuranceProvider}
            </div>
            <div>
              <span className="text-muted-foreground">Policy #:</span>{" "}
              {intake.policyNumber}
            </div>
            <div>
              <span className="text-muted-foreground">Group #:</span>{" "}
              {intake.groupNumber}
            </div>
            <div>
              <span className="text-muted-foreground">Policyholder:</span>{" "}
              {intake.policyholderName}
            </div>
            <div>
              <span className="text-muted-foreground">Relationship:</span>{" "}
              {intake.relationshipToPatient}
            </div>
            <div>
              <span className="text-muted-foreground">Effective Date:</span>{" "}
              {formatDate(intake.coverageEffectiveDate)}
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <div>
              <span className="text-muted-foreground">Card Front:</span>{" "}
              {intake.insuranceCardFrontStorageId ? (
                <span className="text-green-600">Uploaded</span>
              ) : (
                <span className="text-muted-foreground">Not uploaded</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Card Back:</span>{" "}
              {intake.insuranceCardBackStorageId ? (
                <span className="text-green-600">Uploaded</span>
              ) : (
                <span className="text-muted-foreground">Not uploaded</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Medical History</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(4)}
            className="h-8"
          >
            <EditIcon className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div>
            <span className="text-muted-foreground">Medical Conditions:</span>{" "}
            {intake.medicalConditions && intake.medicalConditions.length > 0
              ? intake.medicalConditions.map((c) => c.conditionName).join(", ")
              : "None reported"}
          </div>
          <div>
            <span className="text-muted-foreground">Medications:</span>{" "}
            {intake.medications && intake.medications.length > 0
              ? intake.medications.map((m) => m.medicationName).join(", ")
              : "None reported"}
          </div>
          <div>
            <span className="text-muted-foreground">Allergies:</span>{" "}
            {intake.allergies && intake.allergies.length > 0
              ? intake.allergies.map((a) => a.allergen).join(", ")
              : "None reported"}
          </div>
        </CardContent>
      </Card>

      {/* Consent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Consent Forms</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(5)}
            className="h-8"
          >
            <EditIcon className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            {intake.telehealthConsentAccepted ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <span className="h-4 w-4 rounded-full border" />
            )}
            <span>Telehealth Consent</span>
          </div>
          <div className="flex items-center gap-2">
            {intake.hipaaConsentAccepted ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <span className="h-4 w-4 rounded-full border" />
            )}
            <span>HIPAA Authorization</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => onEdit(5)}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? "Submitting..." : "Submit & Complete Intake"}
        </Button>
      </div>
    </div>
  );
}
