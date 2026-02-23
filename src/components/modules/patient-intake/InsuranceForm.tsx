import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FileUpload } from "./FileUpload";

interface InsuranceFormProps {
  userId: Id<"users">;
  intake: Doc<"patientIntake"> | null;
  onNext: () => void;
  onBack: () => void;
}

export function InsuranceForm({ userId, intake, onNext, onBack }: InsuranceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",
    policyholderName: "",
    relationshipToPatient: "self",
    coverageEffectiveDate: "",
    insuranceCardFrontStorageId: undefined as Id<"_storage"> | undefined,
    insuranceCardBackStorageId: undefined as Id<"_storage"> | undefined,
  });

  const updateInsurance = useMutation(api.modules.patientIntake.patientIntake.updateInsurance);
  const insuranceProviders = useQuery(api.modules.patientIntake.patientIntake.getInsuranceProviders);

  useEffect(() => {
    if (intake) {
      setFormData({
        insuranceProvider: intake.insuranceProvider || "",
        policyNumber: intake.policyNumber || "",
        groupNumber: intake.groupNumber || "",
        policyholderName: intake.policyholderName || "",
        relationshipToPatient: intake.relationshipToPatient || "self",
        coverageEffectiveDate: intake.coverageEffectiveDate || "",
        insuranceCardFrontStorageId: intake.insuranceCardFrontStorageId,
        insuranceCardBackStorageId: intake.insuranceCardBackStorageId,
      });
    }
  }, [intake]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.insuranceProvider) newErrors.insuranceProvider = "Insurance provider is required";
    if (!formData.policyNumber.trim()) newErrors.policyNumber = "Policy number is required";
    if (!formData.groupNumber.trim()) newErrors.groupNumber = "Group number is required";
    if (!formData.policyholderName.trim()) newErrors.policyholderName = "Policyholder name is required";
    if (!formData.coverageEffectiveDate) newErrors.coverageEffectiveDate = "Coverage effective date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateInsurance({
        userId,
        insuranceProvider: formData.insuranceProvider,
        policyNumber: formData.policyNumber.trim(),
        groupNumber: formData.groupNumber.trim(),
        policyholderName: formData.policyholderName.trim(),
        relationshipToPatient: formData.relationshipToPatient,
        coverageEffectiveDate: formData.coverageEffectiveDate,
        insuranceCardFrontStorageId: formData.insuranceCardFrontStorageId,
        insuranceCardBackStorageId: formData.insuranceCardBackStorageId,
      });
      onNext();
    } catch (err) {
      console.error("Failed to save insurance:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
        <Select
          id="insuranceProvider"
          value={formData.insuranceProvider}
          onChange={(e) => handleChange("insuranceProvider", e.target.value)}
          aria-invalid={!!errors.insuranceProvider}
        >
          <option value="">Select provider...</option>
          {insuranceProviders?.map((provider) => (
            <option key={provider._id} value={provider.name}>
              {provider.name}
            </option>
          ))}
        </Select>
        {errors.insuranceProvider && (
          <p className="text-sm text-destructive">{errors.insuranceProvider}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="policyNumber">Policy Number *</Label>
          <Input
            id="policyNumber"
            value={formData.policyNumber}
            onChange={(e) => handleChange("policyNumber", e.target.value)}
            aria-invalid={!!errors.policyNumber}
          />
          {errors.policyNumber && (
            <p className="text-sm text-destructive">{errors.policyNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupNumber">Group Number *</Label>
          <Input
            id="groupNumber"
            value={formData.groupNumber}
            onChange={(e) => handleChange("groupNumber", e.target.value)}
            aria-invalid={!!errors.groupNumber}
          />
          {errors.groupNumber && (
            <p className="text-sm text-destructive">{errors.groupNumber}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="policyholderName">Policyholder Name *</Label>
        <Input
          id="policyholderName"
          value={formData.policyholderName}
          onChange={(e) => handleChange("policyholderName", e.target.value)}
          aria-invalid={!!errors.policyholderName}
        />
        {errors.policyholderName && (
          <p className="text-sm text-destructive">{errors.policyholderName}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="relationshipToPatient">Relationship to Patient *</Label>
          <Select
            id="relationshipToPatient"
            value={formData.relationshipToPatient}
            onChange={(e) => handleChange("relationshipToPatient", e.target.value)}
          >
            <option value="self">Self</option>
            <option value="spouse">Spouse</option>
            <option value="parent">Parent</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverageEffectiveDate">Coverage Effective Date *</Label>
          <Input
            id="coverageEffectiveDate"
            type="date"
            value={formData.coverageEffectiveDate}
            onChange={(e) => handleChange("coverageEffectiveDate", e.target.value)}
            aria-invalid={!!errors.coverageEffectiveDate}
          />
          {errors.coverageEffectiveDate && (
            <p className="text-sm text-destructive">{errors.coverageEffectiveDate}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FileUpload
          label="Insurance Card (Front)"
          storageId={formData.insuranceCardFrontStorageId}
          onUpload={(storageId) =>
            setFormData((prev) => ({ ...prev, insuranceCardFrontStorageId: storageId }))
          }
          onRemove={() =>
            setFormData((prev) => ({ ...prev, insuranceCardFrontStorageId: undefined }))
          }
        />

        <FileUpload
          label="Insurance Card (Back)"
          storageId={formData.insuranceCardBackStorageId}
          onUpload={(storageId) =>
            setFormData((prev) => ({ ...prev, insuranceCardBackStorageId: storageId }))
          }
          onRemove={() =>
            setFormData((prev) => ({ ...prev, insuranceCardBackStorageId: undefined }))
          }
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
