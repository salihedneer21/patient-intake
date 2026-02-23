import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ConsentModal } from "./ConsentModal";

interface ConsentFormProps {
  userId: Id<"users">;
  intake: Doc<"patientIntake"> | null;
  onNext: () => void;
  onBack: () => void;
}

export function ConsentForm({ userId, intake, onNext, onBack }: ConsentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [telehealthConsent, setTelehealthConsent] = useState(false);
  const [hipaaConsent, setHipaaConsent] = useState(false);
  const [telehealthModalOpen, setTelehealthModalOpen] = useState(false);
  const [hipaaModalOpen, setHipaaModalOpen] = useState(false);

  const updateConsent = useMutation(api.modules.patientIntake.patientIntake.updateConsent);

  useEffect(() => {
    if (intake) {
      setTelehealthConsent(intake.telehealthConsentAccepted || false);
      setHipaaConsent(intake.hipaaConsentAccepted || false);
    }
  }, [intake]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!telehealthConsent) {
      newErrors.telehealth = "You must accept the telehealth consent to continue";
    }
    if (!hipaaConsent) {
      newErrors.hipaa = "You must accept the HIPAA authorization to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateConsent({
        userId,
        telehealthConsentAccepted: telehealthConsent,
        hipaaConsentAccepted: hipaaConsent,
      });
      onNext();
    } catch (err) {
      console.error("Failed to save consent:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Please review and accept the following consent forms to continue with your telehealth visit.
          </p>

          {/* Telehealth Consent */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="telehealthConsent"
                checked={telehealthConsent}
                onCheckedChange={(checked) => {
                  setTelehealthConsent(checked === true);
                  if (errors.telehealth) {
                    setErrors((prev) => ({ ...prev, telehealth: "" }));
                  }
                }}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="telehealthConsent"
                  className="text-sm font-medium cursor-pointer"
                >
                  I have read and agree to the Telehealth Consent *
                </Label>
                <p className="text-sm text-muted-foreground">
                  This consent covers the terms and conditions for receiving healthcare services via telehealth technology.
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => setTelehealthModalOpen(true)}
                >
                  Read full document
                </Button>
              </div>
            </div>
            {errors.telehealth && (
              <p className="text-sm text-destructive">{errors.telehealth}</p>
            )}
          </div>

          {/* HIPAA Consent */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="hipaaConsent"
                checked={hipaaConsent}
                onCheckedChange={(checked) => {
                  setHipaaConsent(checked === true);
                  if (errors.hipaa) {
                    setErrors((prev) => ({ ...prev, hipaa: "" }));
                  }
                }}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="hipaaConsent"
                  className="text-sm font-medium cursor-pointer"
                >
                  I have read and agree to the HIPAA Authorization *
                </Label>
                <p className="text-sm text-muted-foreground">
                  This authorization allows us to use and disclose your protected health information as described.
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => setHipaaModalOpen(true)}
                >
                  Read full document
                </Button>
              </div>
            </div>
            {errors.hipaa && (
              <p className="text-sm text-destructive">{errors.hipaa}</p>
            )}
          </div>
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

      <ConsentModal
        open={telehealthModalOpen}
        onClose={() => setTelehealthModalOpen(false)}
        title="Telehealth Consent"
        type="telehealth"
      />

      <ConsentModal
        open={hipaaModalOpen}
        onClose={() => setHipaaModalOpen(false)}
        title="HIPAA Authorization"
        type="hipaa"
      />
    </>
  );
}
