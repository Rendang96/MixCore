import { createCatalogue, getCatalogues } from "./catalogue-storage"
import { initializeSampleCatalogueData } from "./sample-data-initializer"

export function initializeCompleteCatalogueData() {
  console.log("Initializing complete catalogue dummy data...")

  // Initialize individual category data first
  initializeSampleCatalogueData()

  const existingCatalogues = getCatalogues()

  // Check if our dummy catalogues already exist
  const hasCompleteMedical = existingCatalogues.some((c) => c.id === "CMC001")
  const hasCriticalIllness = existingCatalogues.some((c) => c.id === "CIC001")

  if (!hasCompleteMedical || !hasCriticalIllness) {
    // Create complete catalogue with all items
    const completeItems = [
      // Pre-existing conditions (10 items)
      {
        id: "pe1",
        name: "Diabetes Mellitus",
        description: "Type 1 and Type 2 diabetes",
        type: "pre-existing" as const,
        code: "E10-E14",
      },
      {
        id: "pe2",
        name: "Hypertension",
        description: "High blood pressure",
        type: "pre-existing" as const,
        code: "I10-I15",
      },
      {
        id: "pe3",
        name: "Asthma",
        description: "Chronic respiratory condition",
        type: "pre-existing" as const,
        code: "J45",
      },
      {
        id: "pe4",
        name: "Heart Disease",
        description: "Coronary artery disease",
        type: "pre-existing" as const,
        code: "I25",
      },
      {
        id: "pe5",
        name: "Chronic Kidney Disease",
        description: "Progressive kidney function loss",
        type: "pre-existing" as const,
        code: "N18",
      },
      {
        id: "pe6",
        name: "Arthritis",
        description: "Joint inflammation and pain",
        type: "pre-existing" as const,
        code: "M13",
      },
      { id: "pe7", name: "Epilepsy", description: "Seizure disorder", type: "pre-existing" as const, code: "G40" },
      {
        id: "pe8",
        name: "COPD",
        description: "Chronic obstructive pulmonary disease",
        type: "pre-existing" as const,
        code: "J44",
      },
      {
        id: "pe9",
        name: "Thyroid Disorders",
        description: "Hyperthyroidism and hypothyroidism",
        type: "pre-existing" as const,
        code: "E05-E07",
      },
      {
        id: "pe10",
        name: "Mental Health Conditions",
        description: "Depression, anxiety, bipolar disorder",
        type: "pre-existing" as const,
        code: "F32-F39",
      },

      // Specified illnesses (8 items)
      { id: "si1", name: "Cancer", description: "Malignant neoplasms", type: "specified" as const, code: "C00-C97" },
      { id: "si2", name: "Stroke", description: "Cerebrovascular accident", type: "specified" as const, code: "I63" },
      {
        id: "si3",
        name: "Heart Attack",
        description: "Myocardial infarction",
        type: "specified" as const,
        code: "I21",
      },
      {
        id: "si4",
        name: "Kidney Failure",
        description: "End-stage renal disease",
        type: "specified" as const,
        code: "N18.6",
      },
      {
        id: "si5",
        name: "Major Organ Transplant",
        description: "Heart, liver, kidney, lung transplant",
        type: "specified" as const,
        code: "Z94",
      },
      {
        id: "si6",
        name: "Multiple Sclerosis",
        description: "Chronic autoimmune disease",
        type: "specified" as const,
        code: "G35",
      },
      {
        id: "si7",
        name: "Parkinson's Disease",
        description: "Progressive nervous system disorder",
        type: "specified" as const,
        code: "G20",
      },
      {
        id: "si8",
        name: "Alzheimer's Disease",
        description: "Progressive dementia",
        type: "specified" as const,
        code: "G30",
      },

      // Congenital conditions (8 items)
      {
        id: "cc1",
        name: "Congenital Heart Defects",
        description: "Structural heart abnormalities",
        type: "congenital" as const,
        code: "Q20-Q28",
      },
      {
        id: "cc2",
        name: "Cleft Lip and Palate",
        description: "Facial birth defects",
        type: "congenital" as const,
        code: "Q35-Q37",
      },
      { id: "cc3", name: "Spina Bifida", description: "Neural tube defect", type: "congenital" as const, code: "Q05" },
      {
        id: "cc4",
        name: "Down Syndrome",
        description: "Chromosomal disorder",
        type: "congenital" as const,
        code: "Q90",
      },
      {
        id: "cc5",
        name: "Cerebral Palsy",
        description: "Movement and posture disorder",
        type: "congenital" as const,
        code: "G80",
      },
      {
        id: "cc6",
        name: "Cystic Fibrosis",
        description: "Genetic disorder affecting lungs",
        type: "congenital" as const,
        code: "E84",
      },
      {
        id: "cc7",
        name: "Congenital Cataracts",
        description: "Eye lens opacity at birth",
        type: "congenital" as const,
        code: "Q12",
      },
      {
        id: "cc8",
        name: "Congenital Deafness",
        description: "Hearing loss from birth",
        type: "congenital" as const,
        code: "H90",
      },

      // General exclusions (12 items)
      {
        id: "ge1",
        name: "Cosmetic Procedures",
        description: "Plastic surgery for aesthetic purposes",
        type: "exclusion" as const,
        code: "EX001",
      },
      {
        id: "ge2",
        name: "Experimental Treatments",
        description: "Unproven medical procedures",
        type: "exclusion" as const,
        code: "EX002",
      },
      {
        id: "ge3",
        name: "Self-Inflicted Injuries",
        description: "Intentional harm to oneself",
        type: "exclusion" as const,
        code: "EX003",
      },
      {
        id: "ge4",
        name: "War and Terrorism",
        description: "Injuries from armed conflicts",
        type: "exclusion" as const,
        code: "EX004",
      },
      {
        id: "ge5",
        name: "Drug and Alcohol Abuse",
        description: "Substance abuse related conditions",
        type: "exclusion" as const,
        code: "EX005",
      },
      {
        id: "ge6",
        name: "High-Risk Activities",
        description: "Extreme sports and dangerous activities",
        type: "exclusion" as const,
        code: "EX006",
      },
      {
        id: "ge7",
        name: "Nuclear Radiation",
        description: "Exposure to radioactive materials",
        type: "exclusion" as const,
        code: "EX007",
      },
      {
        id: "ge8",
        name: "Pregnancy and Childbirth",
        description: "Maternity related expenses",
        type: "exclusion" as const,
        code: "EX008",
      },
      {
        id: "ge9",
        name: "Dental Treatment",
        description: "Oral and dental care",
        type: "exclusion" as const,
        code: "EX009",
      },
      {
        id: "ge10",
        name: "Vision Correction",
        description: "Eye glasses and contact lenses",
        type: "exclusion" as const,
        code: "EX010",
      },
      {
        id: "ge11",
        name: "Alternative Medicine",
        description: "Non-conventional treatments",
        type: "exclusion" as const,
        code: "EX011",
      },
      {
        id: "ge12",
        name: "Organ Donation",
        description: "Living donor procedures",
        type: "exclusion" as const,
        code: "EX012",
      },
    ]

    if (!hasCompleteMedical) {
      createCatalogue({
        id: "CMC001",
        code: "CMC001",
        name: "Complete Medical Catalogue",
        description:
          "Comprehensive catalogue containing all pre-existing conditions, specified illnesses, congenital conditions, and general exclusions for standard insurance policies",
        category: "medical",
        type: "benefit",
        status: "active",
        items: completeItems,
        itemCounts: {
          preExisting: 10,
          specified: 8,
          congenital: 8,
          exclusions: 12,
        },
      })
    }

    // Create critical illness focused catalogue
    const criticalItems = [
      // Selected pre-existing (5 items)
      {
        id: "pe1",
        name: "Diabetes Mellitus",
        description: "Type 1 and Type 2 diabetes",
        type: "pre-existing" as const,
        code: "E10-E14",
      },
      {
        id: "pe2",
        name: "Hypertension",
        description: "High blood pressure",
        type: "pre-existing" as const,
        code: "I10-I15",
      },
      {
        id: "pe4",
        name: "Heart Disease",
        description: "Coronary artery disease",
        type: "pre-existing" as const,
        code: "I25",
      },
      {
        id: "pe5",
        name: "Chronic Kidney Disease",
        description: "Progressive kidney function loss",
        type: "pre-existing" as const,
        code: "N18",
      },
      {
        id: "pe10",
        name: "Mental Health Conditions",
        description: "Depression, anxiety, bipolar disorder",
        type: "pre-existing" as const,
        code: "F32-F39",
      },

      // All specified illnesses (8 items)
      { id: "si1", name: "Cancer", description: "Malignant neoplasms", type: "specified" as const, code: "C00-C97" },
      { id: "si2", name: "Stroke", description: "Cerebrovascular accident", type: "specified" as const, code: "I63" },
      {
        id: "si3",
        name: "Heart Attack",
        description: "Myocardial infarction",
        type: "specified" as const,
        code: "I21",
      },
      {
        id: "si4",
        name: "Kidney Failure",
        description: "End-stage renal disease",
        type: "specified" as const,
        code: "N18.6",
      },
      {
        id: "si5",
        name: "Major Organ Transplant",
        description: "Heart, liver, kidney, lung transplant",
        type: "specified" as const,
        code: "Z94",
      },
      {
        id: "si6",
        name: "Multiple Sclerosis",
        description: "Chronic autoimmune disease",
        type: "specified" as const,
        code: "G35",
      },
      {
        id: "si7",
        name: "Parkinson's Disease",
        description: "Progressive nervous system disorder",
        type: "specified" as const,
        code: "G20",
      },
      {
        id: "si8",
        name: "Alzheimer's Disease",
        description: "Progressive dementia",
        type: "specified" as const,
        code: "G30",
      },

      // Selected congenital (3 items)
      {
        id: "cc1",
        name: "Congenital Heart Defects",
        description: "Structural heart abnormalities",
        type: "congenital" as const,
        code: "Q20-Q28",
      },
      {
        id: "cc4",
        name: "Down Syndrome",
        description: "Chromosomal disorder",
        type: "congenital" as const,
        code: "Q90",
      },
      {
        id: "cc6",
        name: "Cystic Fibrosis",
        description: "Genetic disorder affecting lungs",
        type: "congenital" as const,
        code: "E84",
      },

      // Selected exclusions (5 items)
      {
        id: "ge2",
        name: "Experimental Treatments",
        description: "Unproven medical procedures",
        type: "exclusion" as const,
        code: "EX002",
      },
      {
        id: "ge3",
        name: "Self-Inflicted Injuries",
        description: "Intentional harm to oneself",
        type: "exclusion" as const,
        code: "EX003",
      },
      {
        id: "ge4",
        name: "War and Terrorism",
        description: "Injuries from armed conflicts",
        type: "exclusion" as const,
        code: "EX004",
      },
      {
        id: "ge5",
        name: "Drug and Alcohol Abuse",
        description: "Substance abuse related conditions",
        type: "exclusion" as const,
        code: "EX005",
      },
      {
        id: "ge6",
        name: "High-Risk Activities",
        description: "Extreme sports and dangerous activities",
        type: "exclusion" as const,
        code: "EX006",
      },
    ]

    if (!hasCriticalIllness) {
      createCatalogue({
        id: "CIC001",
        code: "CIC001",
        name: "Critical Illness Catalogue",
        description: "Specialized catalogue for critical illness coverage including major diseases and conditions",
        category: "medical",
        type: "benefit",
        status: "active",
        items: criticalItems,
        itemCounts: {
          preExisting: 5,
          specified: 8,
          congenital: 3,
          exclusions: 5,
        },
      })
    }
  }

  console.log("Complete catalogue dummy data initialized successfully")
}
