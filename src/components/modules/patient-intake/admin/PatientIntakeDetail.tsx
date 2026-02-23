import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntakeStatusBadge } from "./IntakeStatusBadge";
import { DocumentViewer } from "./DocumentViewer";
import { ArrowLeftIcon, SaveIcon, TrashIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

interface PatientIntakeDetailProps {
  intakeId: Id<"patientIntake">;
}

export function PatientIntakeDetail({ intakeId }: PatientIntakeDetailProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const intake = useQuery(api.modules.patientIntake.admin.getIntakeById, { intakeId });
  const updateIntake = useMutation(api.modules.patientIntake.admin.updateIntake);
  const deleteIntake = useMutation(api.modules.patientIntake.admin.deleteIntake);

  const [formData, setFormData] = useState<Record<string, string>>({});

  if (intake === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (intake === null) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Patient intake record not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/admin/patients")}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      firstName: intake.firstName,
      lastName: intake.lastName,
      phone: intake.phone,
      email: intake.email,
      street: intake.street,
      city: intake.city,
      state: intake.state,
      zipCode: intake.zipCode,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateIntake({
        intakeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
      toast.success("Patient information updated");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update patient information");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this patient intake record? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteIntake({ intakeId });
      toast.success("Patient intake record deleted");
      navigate("/admin/patients");
    } catch (err) {
      toast.error("Failed to delete patient intake record");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTimestamp = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/patients")}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              {intake.firstName && intake.lastName
                ? `${intake.firstName} ${intake.lastName}`
                : "Patient Details"}
            </h1>
            <div className="mt-1">
              <IntakeStatusBadge
                completed={intake.intakeCompleted}
                step={intake.intakeStep}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <SaveIcon className="mr-1 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <TrashIcon className="mr-1 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
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
                {intake.phone || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                {intake.email}
              </div>
              <div>
                <span className="text-muted-foreground">Preferred Language:</span>{" "}
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
          )}
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Street</Label>
                <Input
                  value={formData.street || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input
                  value={formData.zipCode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="text-sm">
              <p>{intake.street || "—"}</p>
              <p>
                {intake.city || "—"}, {intake.state || "—"} {intake.zipCode || "—"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-muted-foreground">Provider:</span>{" "}
              {intake.insuranceProvider || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Policy #:</span>{" "}
              {intake.policyNumber || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Group #:</span>{" "}
              {intake.groupNumber || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Policyholder:</span>{" "}
              {intake.policyholderName || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Relationship:</span>{" "}
              {intake.relationshipToPatient || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Effective Date:</span>{" "}
              {formatDate(intake.coverageEffectiveDate)}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
            <DocumentViewer
              storageId={intake.insuranceCardFrontStorageId}
              label="Insurance Card (Front)"
            />
            <DocumentViewer
              storageId={intake.insuranceCardBackStorageId}
              label="Insurance Card (Back)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium mb-2">Medical Conditions</p>
            {intake.medicalConditions && intake.medicalConditions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {intake.medicalConditions.map((condition: { conditionName: string; severity?: string; currentStatus?: string }, i: number) => (
                  <li key={i}>
                    {condition.conditionName}
                    {condition.severity && ` (${condition.severity})`}
                    {condition.currentStatus && ` - ${condition.currentStatus}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">None reported</p>
            )}
          </div>

          <div>
            <p className="font-medium mb-2">Medications</p>
            {intake.medications && intake.medications.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {intake.medications.map((medication: { medicationName: string; dosage?: string; frequency?: string }, i: number) => (
                  <li key={i}>
                    {medication.medicationName}
                    {medication.dosage && ` - ${medication.dosage}`}
                    {medication.frequency && `, ${medication.frequency}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">None reported</p>
            )}
          </div>

          <div>
            <p className="font-medium mb-2">Allergies</p>
            {intake.allergies && intake.allergies.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {intake.allergies.map((allergy: { allergen: string; severityLevel?: string; reactionDescription?: string }, i: number) => (
                  <li key={i}>
                    {allergy.allergen}
                    {allergy.severityLevel && ` (${allergy.severityLevel})`}
                    {allergy.reactionDescription && ` - ${allergy.reactionDescription}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">None reported</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Consent */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Forms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {intake.telehealthConsentAccepted ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <span className="h-4 w-4 rounded-full border" />
            )}
            <span>Telehealth Consent</span>
            {intake.telehealthConsentDate && (
              <span className="text-muted-foreground">
                ({formatTimestamp(intake.telehealthConsentDate)})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {intake.hipaaConsentAccepted ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <span className="h-4 w-4 rounded-full border" />
            )}
            <span>HIPAA Authorization</span>
            {intake.hipaaConsentDate && (
              <span className="text-muted-foreground">
                ({formatTimestamp(intake.hipaaConsentDate)})
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-muted-foreground">Created:</span>{" "}
            {formatTimestamp(intake.createdAt)}
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>{" "}
            {formatTimestamp(intake.updatedAt)}
          </div>
          <div>
            <span className="text-muted-foreground">User ID:</span>{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">{intake.userId}</code>
          </div>
          <div>
            <span className="text-muted-foreground">Intake ID:</span>{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">{intake._id}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
