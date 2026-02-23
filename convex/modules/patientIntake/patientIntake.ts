import { v } from "convex/values";
import { query, mutation } from "../../_generated/server";
import {
  medicalConditionEntryValidator,
  medicationEntryValidator,
  allergyEntryValidator,
} from "./_schema";

// Get current patient's intake record
export const getMyIntake = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      _id: v.id("patientIntake"),
      _creationTime: v.number(),
      userId: v.id("users"),
      firstName: v.string(),
      lastName: v.string(),
      dateOfBirth: v.string(),
      sexAtBirth: v.string(),
      phone: v.string(),
      email: v.string(),
      preferredLanguage: v.string(),
      weightLbs: v.number(),
      heightFt: v.number(),
      heightIn: v.number(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      insuranceProvider: v.string(),
      policyNumber: v.string(),
      groupNumber: v.string(),
      policyholderName: v.string(),
      relationshipToPatient: v.string(),
      coverageEffectiveDate: v.string(),
      insuranceCardFrontStorageId: v.optional(v.id("_storage")),
      insuranceCardBackStorageId: v.optional(v.id("_storage")),
      medicalConditions: v.optional(v.array(medicalConditionEntryValidator)),
      medications: v.optional(v.array(medicationEntryValidator)),
      allergies: v.optional(v.array(allergyEntryValidator)),
      telehealthConsentAccepted: v.boolean(),
      telehealthConsentDate: v.optional(v.number()),
      hipaaConsentAccepted: v.boolean(),
      hipaaConsentDate: v.optional(v.number()),
      intakeCompleted: v.boolean(),
      intakeStep: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    return intake;
  },
});

// Initialize intake record (Step 1 start)
export const initializeIntake = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
  },
  returns: v.id("patientIntake"),
  handler: async (ctx, args) => {
    // Check if intake already exists
    const existing = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();
    const intakeId = await ctx.db.insert("patientIntake", {
      userId: args.userId,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      sexAtBirth: "",
      phone: "",
      email: args.email,
      preferredLanguage: "English",
      weightLbs: 0,
      heightFt: 0,
      heightIn: 0,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      insuranceProvider: "",
      policyNumber: "",
      groupNumber: "",
      policyholderName: "",
      relationshipToPatient: "self",
      coverageEffectiveDate: "",
      telehealthConsentAccepted: false,
      hipaaConsentAccepted: false,
      intakeCompleted: false,
      intakeStep: 1,
      createdAt: now,
      updatedAt: now,
    });

    return intakeId;
  },
});

// Update Step 1: Demographics
export const updateDemographics = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    sexAtBirth: v.string(),
    phone: v.string(),
    email: v.string(),
    preferredLanguage: v.string(),
    weightLbs: v.number(),
    heightFt: v.number(),
    heightIn: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    await ctx.db.patch(intake._id, {
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      sexAtBirth: args.sexAtBirth,
      phone: args.phone,
      email: args.email,
      preferredLanguage: args.preferredLanguage,
      weightLbs: args.weightLbs,
      heightFt: args.heightFt,
      heightIn: args.heightIn,
      intakeStep: Math.max(intake.intakeStep, 2),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Update Step 2: Address
export const updateAddress = mutation({
  args: {
    userId: v.id("users"),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    await ctx.db.patch(intake._id, {
      street: args.street,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      intakeStep: Math.max(intake.intakeStep, 3),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Update Step 3: Insurance
export const updateInsurance = mutation({
  args: {
    userId: v.id("users"),
    insuranceProvider: v.string(),
    policyNumber: v.string(),
    groupNumber: v.string(),
    policyholderName: v.string(),
    relationshipToPatient: v.string(),
    coverageEffectiveDate: v.string(),
    insuranceCardFrontStorageId: v.optional(v.id("_storage")),
    insuranceCardBackStorageId: v.optional(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    await ctx.db.patch(intake._id, {
      insuranceProvider: args.insuranceProvider,
      policyNumber: args.policyNumber,
      groupNumber: args.groupNumber,
      policyholderName: args.policyholderName,
      relationshipToPatient: args.relationshipToPatient,
      coverageEffectiveDate: args.coverageEffectiveDate,
      insuranceCardFrontStorageId: args.insuranceCardFrontStorageId,
      insuranceCardBackStorageId: args.insuranceCardBackStorageId,
      intakeStep: Math.max(intake.intakeStep, 4),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Update Step 4: Medical History (optional)
export const updateMedicalHistory = mutation({
  args: {
    userId: v.id("users"),
    medicalConditions: v.optional(v.array(medicalConditionEntryValidator)),
    medications: v.optional(v.array(medicationEntryValidator)),
    allergies: v.optional(v.array(allergyEntryValidator)),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    await ctx.db.patch(intake._id, {
      medicalConditions: args.medicalConditions,
      medications: args.medications,
      allergies: args.allergies,
      intakeStep: Math.max(intake.intakeStep, 5),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Skip Step 4: Medical History
export const skipMedicalHistory = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    await ctx.db.patch(intake._id, {
      intakeStep: Math.max(intake.intakeStep, 5),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Update Step 5: Consent
export const updateConsent = mutation({
  args: {
    userId: v.id("users"),
    telehealthConsentAccepted: v.boolean(),
    hipaaConsentAccepted: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    const now = Date.now();
    await ctx.db.patch(intake._id, {
      telehealthConsentAccepted: args.telehealthConsentAccepted,
      telehealthConsentDate: args.telehealthConsentAccepted ? now : undefined,
      hipaaConsentAccepted: args.hipaaConsentAccepted,
      hipaaConsentDate: args.hipaaConsentAccepted ? now : undefined,
      intakeStep: Math.max(intake.intakeStep, 6),
      updatedAt: now,
    });

    return null;
  },
});

// Complete intake (Step 6)
export const completeIntake = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    // Validate all required fields are present
    if (!intake.telehealthConsentAccepted || !intake.hipaaConsentAccepted) {
      throw new Error("Consent forms must be accepted");
    }

    await ctx.db.patch(intake._id, {
      intakeCompleted: true,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Go back to a specific step
export const goToStep = mutation({
  args: {
    userId: v.id("users"),
    step: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!intake) {
      throw new Error("Intake record not found");
    }

    // Only allow going to steps that have been reached
    if (args.step > intake.intakeStep) {
      throw new Error("Cannot skip ahead to unreached step");
    }

    // Reset completion if going back
    await ctx.db.patch(intake._id, {
      intakeCompleted: false,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Get reference data: Insurance Providers
export const getInsuranceProviders = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("insuranceProviders"),
      _creationTime: v.number(),
      name: v.string(),
      isActive: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("insuranceProviders")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get reference data: Medical Conditions
export const getMedicalConditions = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("medicalConditions"),
      _creationTime: v.number(),
      name: v.string(),
      category: v.optional(v.string()),
      isActive: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("medicalConditions")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Generate upload URL for insurance cards
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL for insurance card
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
