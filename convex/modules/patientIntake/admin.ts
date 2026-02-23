import { v } from "convex/values";
import { query, mutation } from "../../_generated/server";
import {
  medicalConditionEntryValidator,
  medicationEntryValidator,
  allergyEntryValidator,
} from "./_schema";

const intakeRecordValidator = v.object({
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
});

// List all patient intake records
export const listAllIntakes = query({
  args: {},
  returns: v.array(intakeRecordValidator),
  handler: async (ctx) => {
    return await ctx.db.query("patientIntake").order("desc").collect();
  },
});

// List intakes by completion status
export const listIntakesByStatus = query({
  args: {
    completed: v.boolean(),
  },
  returns: v.array(intakeRecordValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patientIntake")
      .withIndex("by_intakeCompleted", (q) => q.eq("intakeCompleted", args.completed))
      .order("desc")
      .collect();
  },
});

// Get single intake by ID
export const getIntakeById = query({
  args: { intakeId: v.id("patientIntake") },
  returns: v.union(intakeRecordValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.intakeId);
  },
});

// Get intake by user ID
export const getIntakeByUserId = query({
  args: { userId: v.id("users") },
  returns: v.union(intakeRecordValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patientIntake")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

// Get intake stats for dashboard
export const getIntakeStats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    completed: v.number(),
    inProgress: v.number(),
    incomplete: v.number(),
  }),
  handler: async (ctx) => {
    const allIntakes = await ctx.db.query("patientIntake").collect();

    const completed = allIntakes.filter((i) => i.intakeCompleted).length;
    const inProgress = allIntakes.filter(
      (i) => !i.intakeCompleted && i.intakeStep > 1
    ).length;
    const incomplete = allIntakes.filter(
      (i) => !i.intakeCompleted && i.intakeStep === 1
    ).length;

    return {
      total: allIntakes.length,
      completed,
      inProgress,
      incomplete,
    };
  },
});

// Admin update any intake field
export const updateIntake = mutation({
  args: {
    intakeId: v.id("patientIntake"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    sexAtBirth: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    weightLbs: v.optional(v.number()),
    heightFt: v.optional(v.number()),
    heightIn: v.optional(v.number()),
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    insuranceProvider: v.optional(v.string()),
    policyNumber: v.optional(v.string()),
    groupNumber: v.optional(v.string()),
    policyholderName: v.optional(v.string()),
    relationshipToPatient: v.optional(v.string()),
    coverageEffectiveDate: v.optional(v.string()),
    medicalConditions: v.optional(v.array(medicalConditionEntryValidator)),
    medications: v.optional(v.array(medicationEntryValidator)),
    allergies: v.optional(v.array(allergyEntryValidator)),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { intakeId, ...updates } = args;

    const intake = await ctx.db.get(intakeId);
    if (!intake) {
      throw new Error("Intake record not found");
    }

    // Filter out undefined values
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    if (Object.keys(cleanUpdates).length > 0) {
      await ctx.db.patch(intakeId, {
        ...cleanUpdates,
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});

// Delete intake record
export const deleteIntake = mutation({
  args: { intakeId: v.id("patientIntake") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const intake = await ctx.db.get(args.intakeId);
    if (!intake) {
      throw new Error("Intake record not found");
    }

    // Delete associated storage files if they exist
    if (intake.insuranceCardFrontStorageId) {
      await ctx.storage.delete(intake.insuranceCardFrontStorageId);
    }
    if (intake.insuranceCardBackStorageId) {
      await ctx.storage.delete(intake.insuranceCardBackStorageId);
    }

    await ctx.db.delete(args.intakeId);
    return null;
  },
});
