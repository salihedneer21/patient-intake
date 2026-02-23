import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PlusIcon, XIcon } from "lucide-react";

interface MedicalHistoryFormProps {
  userId: Id<"users">;
  intake: Doc<"patientIntake"> | null;
  onNext: () => void;
  onBack: () => void;
}

interface MedicalConditionEntry {
  conditionName: string;
  onsetDate?: string;
  currentStatus?: string;
  severity?: string;
}

interface MedicationEntry {
  medicationName: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
}

interface AllergyEntry {
  allergen: string;
  reactionDescription?: string;
  severityLevel?: string;
}

export function MedicalHistoryForm({ userId, intake, onNext, onBack }: MedicalHistoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [conditions, setConditions] = useState<MedicalConditionEntry[]>([]);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [allergies, setAllergies] = useState<AllergyEntry[]>([]);

  const updateMedicalHistory = useMutation(api.modules.patientIntake.patientIntake.updateMedicalHistory);
  const skipMedicalHistory = useMutation(api.modules.patientIntake.patientIntake.skipMedicalHistory);
  const medicalConditionsList = useQuery(api.modules.patientIntake.patientIntake.getMedicalConditions);

  useEffect(() => {
    if (intake) {
      if (intake.medicalConditions) {
        setConditions(intake.medicalConditions);
      }
      if (intake.medications) {
        setMedications(intake.medications);
      }
      if (intake.allergies) {
        setAllergies(intake.allergies);
      }
    }
  }, [intake]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Filter out empty entries
      const validConditions = conditions.filter((c) => c.conditionName.trim());
      const validMedications = medications.filter((m) => m.medicationName.trim());
      const validAllergies = allergies.filter((a) => a.allergen.trim());

      await updateMedicalHistory({
        userId,
        medicalConditions: validConditions.length > 0 ? validConditions : undefined,
        medications: validMedications.length > 0 ? validMedications : undefined,
        allergies: validAllergies.length > 0 ? validAllergies : undefined,
      });
      onNext();
    } catch (err) {
      console.error("Failed to save medical history:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await skipMedicalHistory({ userId });
      onNext();
    } catch (err) {
      console.error("Failed to skip medical history:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Condition handlers
  const addCondition = () => {
    setConditions([...conditions, { conditionName: "", onsetDate: "", currentStatus: "", severity: "" }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof MedicalConditionEntry, value: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    setConditions(updated);
  };

  // Medication handlers
  const addMedication = () => {
    setMedications([...medications, { medicationName: "", dosage: "", frequency: "", startDate: "" }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof MedicationEntry, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  // Allergy handlers
  const addAllergy = () => {
    setAllergies([...allergies, { allergen: "", reactionDescription: "", severityLevel: "" }]);
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const updateAllergy = (index: number, field: keyof AllergyEntry, value: string) => {
    const updated = [...allergies];
    updated[index] = { ...updated[index], [field]: value };
    setAllergies(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Medical Conditions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Medical Conditions</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCondition}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Condition
          </Button>
        </div>

        {conditions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conditions added</p>
        ) : (
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Label className="text-sm">Condition {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeCondition(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Select
                    value={condition.conditionName}
                    onChange={(e) => updateCondition(index, "conditionName", e.target.value)}
                  >
                    <option value="">Select condition...</option>
                    {medicalConditionsList?.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Onset Date</Label>
                    <Input
                      type="date"
                      value={condition.onsetDate || ""}
                      onChange={(e) => updateCondition(index, "onsetDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <Select
                      value={condition.currentStatus || ""}
                      onChange={(e) => updateCondition(index, "currentStatus", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="managed">Managed</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Severity</Label>
                    <Select
                      value={condition.severity || ""}
                      onChange={(e) => updateCondition(index, "severity", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Current Medications</Label>
          <Button type="button" variant="outline" size="sm" onClick={addMedication}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Medication
          </Button>
        </div>

        {medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No medications added</p>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Label className="text-sm">Medication {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeMedication(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  placeholder="Medication name"
                  value={medication.medicationName}
                  onChange={(e) => updateMedication(index, "medicationName", e.target.value)}
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Dosage</Label>
                    <Input
                      placeholder="e.g., 10mg"
                      value={medication.dosage || ""}
                      onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Frequency</Label>
                    <Input
                      placeholder="e.g., Once daily"
                      value={medication.frequency || ""}
                      onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="date"
                      value={medication.startDate || ""}
                      onChange={(e) => updateMedication(index, "startDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Allergies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Allergies</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAllergy}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Allergy
          </Button>
        </div>

        {allergies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No allergies added</p>
        ) : (
          <div className="space-y-4">
            {allergies.map((allergy, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Label className="text-sm">Allergy {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeAllergy(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  placeholder="Allergen (e.g., Penicillin)"
                  value={allergy.allergen}
                  onChange={(e) => updateAllergy(index, "allergen", e.target.value)}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Reaction Description</Label>
                    <Input
                      placeholder="e.g., Hives, difficulty breathing"
                      value={allergy.reactionDescription || ""}
                      onChange={(e) => updateAllergy(index, "reactionDescription", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Severity Level</Label>
                    <Select
                      value={allergy.severityLevel || ""}
                      onChange={(e) => updateAllergy(index, "severityLevel", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                      <option value="life-threatening">Life-threatening</option>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
