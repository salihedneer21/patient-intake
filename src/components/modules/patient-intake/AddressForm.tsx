import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface AddressFormProps {
  userId: Id<"users">;
  intake: Doc<"patientIntake"> | null;
  onNext: () => void;
  onBack: () => void;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export function AddressForm({ userId, intake, onNext, onBack }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const updateAddress = useMutation(api.modules.patientIntake.patientIntake.updateAddress);

  useEffect(() => {
    if (intake) {
      setFormData({
        street: intake.street || "",
        city: intake.city || "",
        state: intake.state || "",
        zipCode: intake.zipCode || "",
      });
    }
  }, [intake]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    // Validate zip code format (5 digits)
    const zipRegex = /^\d{5}$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode.trim())) {
      newErrors.zipCode = "Please enter a valid 5-digit zip code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateAddress({
        userId,
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zipCode: formData.zipCode.trim(),
      });
      onNext();
    } catch (err) {
      console.error("Failed to save address:", err);
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
        <Label htmlFor="street">Street Address *</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          placeholder="123 Main St, Apt 4B"
          aria-invalid={!!errors.street}
        />
        {errors.street && (
          <p className="text-sm text-destructive">{errors.street}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
          aria-invalid={!!errors.city}
        />
        {errors.city && (
          <p className="text-sm text-destructive">{errors.city}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Select
            id="state"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            aria-invalid={!!errors.state}
          >
            <option value="">Select state...</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            placeholder="12345"
            maxLength={5}
            aria-invalid={!!errors.zipCode}
          />
          {errors.zipCode && (
            <p className="text-sm text-destructive">{errors.zipCode}</p>
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
  );
}
