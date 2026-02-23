import { defineTable } from "convex/server";
import { v } from "convex/values";

// Validators for nested objects
export const medicalConditionEntryValidator = v.object({
  conditionName: v.string(),
  onsetDate: v.optional(v.string()),
  currentStatus: v.optional(v.string()), // active, resolved, managed
  severity: v.optional(v.string()), // mild, moderate, severe
});

export const medicationEntryValidator = v.object({
  medicationName: v.string(),
  dosage: v.optional(v.string()),
  frequency: v.optional(v.string()),
  startDate: v.optional(v.string()),
});

export const allergyEntryValidator = v.object({
  allergen: v.string(),
  reactionDescription: v.optional(v.string()),
  severityLevel: v.optional(v.string()), // mild, moderate, severe, life-threatening
});

export const patientIntakeTables = {
  // Main patient intake table
  patientIntake: defineTable({
    userId: v.id("users"),
    // Step 1: Demographics
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    sexAtBirth: v.string(), // male, female
    phone: v.string(),
    email: v.string(),
    preferredLanguage: v.string(), // English, Spanish
    weightLbs: v.number(),
    heightFt: v.number(),
    heightIn: v.number(),
    // Step 2: Address
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    // Step 3: Insurance
    insuranceProvider: v.string(),
    policyNumber: v.string(),
    groupNumber: v.string(),
    policyholderName: v.string(),
    relationshipToPatient: v.string(), // self, spouse, parent, other
    coverageEffectiveDate: v.string(),
    insuranceCardFrontStorageId: v.optional(v.id("_storage")),
    insuranceCardBackStorageId: v.optional(v.id("_storage")),
    // Step 4: Medical History (optional)
    medicalConditions: v.optional(v.array(medicalConditionEntryValidator)),
    medications: v.optional(v.array(medicationEntryValidator)),
    allergies: v.optional(v.array(allergyEntryValidator)),
    // Step 5: Consent
    telehealthConsentAccepted: v.boolean(),
    telehealthConsentDate: v.optional(v.number()),
    hipaaConsentAccepted: v.boolean(),
    hipaaConsentDate: v.optional(v.number()),
    // Progress tracking
    intakeCompleted: v.boolean(),
    intakeStep: v.number(), // 1-6
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_intakeCompleted", ["intakeCompleted"])
    .index("by_intakeStep", ["intakeStep"]),

  // Reference table: Insurance Providers
  insuranceProviders: defineTable({
    name: v.string(),
    isActive: v.boolean(),
  }).index("by_isActive", ["isActive"]),

  // Reference table: Medical Conditions
  medicalConditions: defineTable({
    name: v.string(),
    category: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_isActive", ["isActive"]),
};
