import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface DemographicsFormProps {
  userId: Id<"users">;
  intake: Doc<"patientIntake"> | null;
  onNext: () => void;
}

export function DemographicsForm({ userId, intake, onNext }: DemographicsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sexAtBirth: "",
    phone: "",
    email: "",
    preferredLanguage: "English",
    weightLbs: "",
    heightFt: "",
    heightIn: "",
  });

  const updateDemographics = useMutation(api.modules.patientIntake.patientIntake.updateDemographics);

  useEffect(() => {
    if (intake) {
      setFormData({
        firstName: intake.firstName || "",
        lastName: intake.lastName || "",
        dateOfBirth: intake.dateOfBirth || "",
        sexAtBirth: intake.sexAtBirth || "",
        phone: intake.phone || "",
        email: intake.email || "",
        preferredLanguage: intake.preferredLanguage || "English",
        weightLbs: intake.weightLbs ? String(intake.weightLbs) : "",
        heightFt: intake.heightFt ? String(intake.heightFt) : "",
        heightIn: intake.heightIn ? String(intake.heightIn) : "",
      });
    }
  }, [intake]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.sexAtBirth) newErrors.sexAtBirth = "Sex at birth is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.weightLbs) newErrors.weightLbs = "Weight is required";
    if (!formData.heightFt) newErrors.heightFt = "Height (feet) is required";
    if (!formData.heightIn && formData.heightIn !== "0") newErrors.heightIn = "Height (inches) is required";

    // Validate date of birth (must be 18+)
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    // Validate phone format
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid US phone number";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateDemographics({
        userId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        sexAtBirth: formData.sexAtBirth,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        preferredLanguage: formData.preferredLanguage,
        weightLbs: Number(formData.weightLbs),
        heightFt: Number(formData.heightFt),
        heightIn: Number(formData.heightIn),
      });
      onNext();
    } catch (err) {
      console.error("Failed to save demographics:", err);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            aria-invalid={!!errors.dateOfBirth}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexAtBirth">Sex at Birth *</Label>
          <Select
            id="sexAtBirth"
            value={formData.sexAtBirth}
            onChange={(e) => handleChange("sexAtBirth", e.target.value)}
            aria-invalid={!!errors.sexAtBirth}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          {errors.sexAtBirth && (
            <p className="text-sm text-destructive">{errors.sexAtBirth}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 555-5555"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">Preferred Language *</Label>
        <Select
          id="preferredLanguage"
          value={formData.preferredLanguage}
          onChange={(e) => handleChange("preferredLanguage", e.target.value)}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="weightLbs">Weight (lbs) *</Label>
        <Input
          id="weightLbs"
          type="number"
          min="0"
          max="999"
          value={formData.weightLbs}
          onChange={(e) => handleChange("weightLbs", e.target.value)}
          aria-invalid={!!errors.weightLbs}
        />
        {errors.weightLbs && (
          <p className="text-sm text-destructive">{errors.weightLbs}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="heightFt">Height (feet) *</Label>
          <Input
            id="heightFt"
            type="number"
            min="0"
            max="8"
            value={formData.heightFt}
            onChange={(e) => handleChange("heightFt", e.target.value)}
            aria-invalid={!!errors.heightFt}
          />
          {errors.heightFt && (
            <p className="text-sm text-destructive">{errors.heightFt}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="heightIn">Height (inches) *</Label>
          <Input
            id="heightIn"
            type="number"
            min="0"
            max="11"
            value={formData.heightIn}
            onChange={(e) => handleChange("heightIn", e.target.value)}
            aria-invalid={!!errors.heightIn}
          />
          {errors.heightIn && (
            <p className="text-sm text-destructive">{errors.heightIn}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
