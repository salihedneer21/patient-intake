import { mutation } from "../../_generated/server";
import { v } from "convex/values";

// Seed insurance providers
export const seedInsuranceProviders = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("insuranceProviders").first();
    if (existing) {
      console.log("Insurance providers already seeded");
      return null;
    }

    const providers = [
      "Aetna",
      "Blue Cross Blue Shield",
      "Cigna",
      "Humana",
      "Kaiser Permanente",
      "Medicare",
      "Medicaid",
      "UnitedHealthcare",
      "Other",
    ];

    for (const name of providers) {
      await ctx.db.insert("insuranceProviders", {
        name,
        isActive: true,
      });
    }

    console.log(`Seeded ${providers.length} insurance providers`);
    return null;
  },
});

// Seed medical conditions
export const seedMedicalConditions = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("medicalConditions").first();
    if (existing) {
      console.log("Medical conditions already seeded");
      return null;
    }

    const conditions = [
      { name: "Diabetes Type 1", category: "Endocrine" },
      { name: "Diabetes Type 2", category: "Endocrine" },
      { name: "Hypertension", category: "Cardiovascular" },
      { name: "Asthma", category: "Respiratory" },
      { name: "COPD", category: "Respiratory" },
      { name: "Heart Disease", category: "Cardiovascular" },
      { name: "Anxiety", category: "Mental Health" },
      { name: "Depression", category: "Mental Health" },
      { name: "Arthritis", category: "Musculoskeletal" },
      { name: "Thyroid Disorder", category: "Endocrine" },
      { name: "High Cholesterol", category: "Cardiovascular" },
      { name: "Other", category: undefined },
    ];

    for (const condition of conditions) {
      await ctx.db.insert("medicalConditions", {
        name: condition.name,
        category: condition.category,
        isActive: true,
      });
    }

    console.log(`Seeded ${conditions.length} medical conditions`);
    return null;
  },
});

// Seed all reference data
export const seedAll = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Seed insurance providers
    const existingProviders = await ctx.db.query("insuranceProviders").first();
    if (!existingProviders) {
      const providers = [
        "Aetna",
        "Blue Cross Blue Shield",
        "Cigna",
        "Humana",
        "Kaiser Permanente",
        "Medicare",
        "Medicaid",
        "UnitedHealthcare",
        "Other",
      ];
      for (const name of providers) {
        await ctx.db.insert("insuranceProviders", {
          name,
          isActive: true,
        });
      }
      console.log(`Seeded ${providers.length} insurance providers`);
    }

    // Seed medical conditions
    const existingConditions = await ctx.db.query("medicalConditions").first();
    if (!existingConditions) {
      const conditions = [
        { name: "Diabetes Type 1", category: "Endocrine" },
        { name: "Diabetes Type 2", category: "Endocrine" },
        { name: "Hypertension", category: "Cardiovascular" },
        { name: "Asthma", category: "Respiratory" },
        { name: "COPD", category: "Respiratory" },
        { name: "Heart Disease", category: "Cardiovascular" },
        { name: "Anxiety", category: "Mental Health" },
        { name: "Depression", category: "Mental Health" },
        { name: "Arthritis", category: "Musculoskeletal" },
        { name: "Thyroid Disorder", category: "Endocrine" },
        { name: "High Cholesterol", category: "Cardiovascular" },
        { name: "Other", category: undefined },
      ];
      for (const condition of conditions) {
        await ctx.db.insert("medicalConditions", {
          name: condition.name,
          category: condition.category,
          isActive: true,
        });
      }
      console.log(`Seeded ${conditions.length} medical conditions`);
    }

    return null;
  },
});
