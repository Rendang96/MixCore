import { getPreExistingConditions, addPreExistingCondition } from "./pre-existing-storage"
import { specifiedIllnessStorage } from "./specified-illness-storage"
import { congenitalConditionStorage } from "./congenital-condition-storage"
import { generalExclusionStorage } from "./general-exclusion-storage"

export function initializeSampleCatalogueData() {
  // Initialize Pre-existing Conditions
  if (getPreExistingConditions().length === 0) {
    const preExistingConditions = [
      {
        preExistingId: "PE001",
        name: "Diabetes Mellitus Type 1",
        description: "Insulin-dependent diabetes mellitus requiring daily insulin injections",
        waitingPeriod: "12 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE002",
        name: "Hypertension (High Blood Pressure)",
        description: "Chronic condition with blood pressure consistently above 140/90 mmHg",
        waitingPeriod: "6 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE003",
        name: "Asthma",
        description: "Chronic respiratory condition causing breathing difficulties and wheezing",
        waitingPeriod: "3 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE004",
        name: "Coronary Heart Disease",
        description: "Disease affecting the blood vessels supplying the heart muscle",
        waitingPeriod: "24 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE005",
        name: "Chronic Kidney Disease",
        description: "Long-term kidney damage with reduced kidney function",
        waitingPeriod: "18 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE006",
        name: "Rheumatoid Arthritis",
        description: "Autoimmune disorder causing joint inflammation and pain",
        waitingPeriod: "12 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE007",
        name: "Epilepsy",
        description: "Neurological disorder characterized by recurrent seizures",
        waitingPeriod: "24 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE008",
        name: "Chronic Obstructive Pulmonary Disease (COPD)",
        description: "Progressive lung disease causing breathing difficulties",
        waitingPeriod: "18 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE009",
        name: "Thyroid Disorders",
        description: "Conditions affecting thyroid gland function (hyperthyroid/hypothyroid)",
        waitingPeriod: "6 months",
        catalogue: "Standard Medical Catalogue",
      },
      {
        preExistingId: "PE010",
        name: "Depression and Anxiety Disorders",
        description: "Mental health conditions requiring ongoing treatment",
        waitingPeriod: "12 months",
        catalogue: "Standard Medical Catalogue",
      },
    ]

    preExistingConditions.forEach((condition) => {
      addPreExistingCondition(condition)
    })
  }

  // Initialize Specified Illnesses
  if (specifiedIllnessStorage.getAll().length === 0) {
    const specifiedIllnesses = [
      {
        specifiedIllnessId: "SI001",
        name: "Cancer (All Types)",
        description: "Malignant tumors and cancerous growths requiring specialized treatment",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage after waiting period with pre-authorization",
        isExcludable: false,
        ageRestriction: "Coverage available from age 18-65",
        remarks: "Includes all forms of cancer except skin cancer (non-melanoma)",
      },
      {
        specifiedIllnessId: "SI002",
        name: "Stroke (Cerebrovascular Accident)",
        description: "Acute cerebrovascular event causing neurological deficit",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage with rehabilitation benefits",
        isExcludable: false,
        ageRestriction: "No age restriction",
        remarks: "Includes ischemic and hemorrhagic stroke",
      },
      {
        specifiedIllnessId: "SI003",
        name: "Heart Attack (Myocardial Infarction)",
        description: "Death of heart muscle due to blocked blood supply",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage including cardiac procedures",
        isExcludable: false,
        ageRestriction: "Coverage from age 21 onwards",
        remarks: "Requires ECG and enzyme confirmation",
      },
      {
        specifiedIllnessId: "SI004",
        name: "Kidney Failure",
        description: "End-stage renal disease requiring dialysis or transplant",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage including dialysis and transplant",
        isExcludable: false,
        ageRestriction: "No age restriction",
        remarks: "Covers both acute and chronic kidney failure",
      },
      {
        specifiedIllnessId: "SI005",
        name: "Major Organ Transplant",
        description: "Transplantation of heart, lung, liver, kidney, or pancreas",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage including post-transplant care",
        isExcludable: false,
        ageRestriction: "Coverage up to age 65",
        remarks: "Includes immunosuppressive therapy",
      },
      {
        specifiedIllnessId: "SI006",
        name: "Multiple Sclerosis",
        description: "Autoimmune disease affecting the central nervous system",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage with ongoing treatment support",
        isExcludable: false,
        ageRestriction: "Coverage from age 18-60",
        remarks: "Requires MRI confirmation and neurologist diagnosis",
      },
      {
        specifiedIllnessId: "SI007",
        name: "Parkinson's Disease",
        description: "Progressive neurological disorder affecting movement",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage including supportive care",
        isExcludable: false,
        ageRestriction: "Coverage from age 40 onwards",
        remarks: "Requires specialist neurologist confirmation",
      },
      {
        specifiedIllnessId: "SI008",
        name: "Alzheimer's Disease",
        description: "Progressive dementia affecting memory and cognitive function",
        catalogue: "Critical Illness Catalogue",
        waitingPeriodMonths: 90,
        isCoveredAfterWaiting: true,
        coverageImpact: "Full coverage including long-term care",
        isExcludable: false,
        ageRestriction: "Coverage from age 50 onwards",
        remarks: "Requires comprehensive neuropsychological assessment",
      },
    ]

    specifiedIllnesses.forEach((illness) => {
      specifiedIllnessStorage.add(illness)
    })
  }

  // Initialize Congenital Conditions
  if (congenitalConditionStorage.getAll().length === 0) {
    const congenitalConditions = [
      {
        congenitalConditionId: "CC001",
        name: "Congenital Heart Defects",
        description: "Heart abnormalities present from birth including septal defects and valve malformations",
        type: "Cardiovascular",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "Q20-Q28",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Covered under child rider with surgical benefits",
        isConditional: true,
        appliesTo: "Children under 18",
        remarks: "Requires pediatric cardiologist evaluation and echocardiogram",
      },
      {
        congenitalConditionId: "CC002",
        name: "Cleft Lip and Palate",
        description: "Birth defect affecting the lip and roof of the mouth",
        type: "Craniofacial",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "Q35-Q37",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Full coverage for corrective surgery and speech therapy",
        isConditional: false,
        appliesTo: "Children under 18",
        remarks: "Includes multiple surgical procedures and orthodontic treatment",
      },
      {
        congenitalConditionId: "CC003",
        name: "Spina Bifida",
        description: "Birth defect affecting the spine and spinal cord development",
        type: "Neurological",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "Q05",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Full coverage including surgical and supportive care",
        isConditional: true,
        appliesTo: "Children under 18",
        remarks: "Requires multidisciplinary care team approach",
      },
      {
        congenitalConditionId: "CC004",
        name: "Down Syndrome",
        description: "Genetic disorder caused by extra chromosome 21",
        type: "Genetic",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "Q90",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Coverage for associated medical conditions and therapies",
        isConditional: true,
        appliesTo: "All ages",
        remarks: "Includes coverage for heart defects, hearing issues, and developmental support",
      },
      {
        congenitalConditionId: "CC005",
        name: "Cerebral Palsy",
        description: "Group of disorders affecting movement and posture due to brain damage",
        type: "Neurological",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "G80",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Full coverage for therapy and assistive devices",
        isConditional: true,
        appliesTo: "Children under 18",
        remarks: "Includes physiotherapy, occupational therapy, and speech therapy",
      },
      {
        congenitalConditionId: "CC006",
        name: "Cystic Fibrosis",
        description: "Genetic disorder affecting lungs and digestive system",
        type: "Genetic",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "E84",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Full coverage for ongoing treatment and medications",
        isConditional: true,
        appliesTo: "All ages",
        remarks: "Requires genetic testing confirmation and specialized care",
      },
      {
        congenitalConditionId: "CC007",
        name: "Congenital Cataracts",
        description: "Clouding of the lens present at birth affecting vision",
        type: "Ophthalmological",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "Q12.0",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Full coverage for surgical correction",
        isConditional: false,
        appliesTo: "Children under 18",
        remarks: "Early intervention critical for visual development",
      },
      {
        congenitalConditionId: "CC008",
        name: "Congenital Deafness",
        description: "Hearing loss present from birth",
        type: "Audiological",
        catalogue: "Congenital Conditions Catalogue",
        icdCode: "H90.3",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: true,
        coverageImpact: "Coverage for hearing aids and cochlear implants",
        isConditional: false,
        appliesTo: "All ages",
        remarks: "Includes audiological assessment and speech therapy",
      },
    ]

    congenitalConditions.forEach((condition) => {
      congenitalConditionStorage.add(condition)
    })
  }

  // Initialize General Exclusions
  if (generalExclusionStorage.getAll().length === 0) {
    const generalExclusions = [
      {
        itemId: "GE001",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Cosmetic and Aesthetic Procedures",
        description:
          "Elective procedures performed for aesthetic purposes including plastic surgery, cosmetic dentistry, and beauty treatments",
        coverageImpact: "Completely excluded unless medically necessary",
        isOverridable: true,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Exception: Reconstructive surgery following accident or cancer treatment",
      },
      {
        itemId: "GE002",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Experimental and Investigational Treatments",
        description:
          "Unproven medical treatments, experimental drugs, and investigational procedures not approved by relevant medical authorities",
        coverageImpact: "Completely excluded",
        isOverridable: false,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Includes clinical trials and off-label drug use",
      },
      {
        itemId: "GE003",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Self-Inflicted Injuries",
        description:
          "Injuries or illnesses intentionally caused by the insured person including suicide attempts and self-harm",
        coverageImpact: "Completely excluded",
        isOverridable: false,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Exception: Mental health treatment for underlying conditions",
      },
      {
        itemId: "GE004",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "War and Terrorism",
        description: "Injuries or illnesses resulting from war, civil war, terrorism, or military operations",
        coverageImpact: "Completely excluded",
        isOverridable: false,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Includes both declared and undeclared conflicts",
      },
      {
        itemId: "GE005",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Drug and Alcohol Abuse",
        description: "Conditions directly related to illegal drug use, alcohol abuse, or substance dependency",
        coverageImpact: "Treatment excluded, complications may be covered",
        isOverridable: true,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Rehabilitation programs may be covered under mental health benefits",
      },
      {
        itemId: "GE006",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "High-Risk Activities",
        description:
          "Injuries from extreme sports, professional sports, mountaineering, motor racing, and other high-risk activities",
        coverageImpact: "Excluded unless additional premium paid",
        isOverridable: true,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Can be covered with sports rider or additional premium",
      },
      {
        itemId: "GE007",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Nuclear Radiation",
        description:
          "Injuries or illnesses caused by nuclear radiation, radioactive contamination, or nuclear accidents",
        coverageImpact: "Completely excluded",
        isOverridable: false,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Includes occupational and accidental exposure",
      },
      {
        itemId: "GE008",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Pregnancy and Childbirth Complications",
        description: "Normal pregnancy, childbirth, and related complications unless specifically covered",
        coverageImpact: "Excluded unless maternity rider purchased",
        isOverridable: true,
        appliesTo: "Female members of childbearing age",
        isVisibleToMember: true,
        remarks: "Emergency complications may be covered under emergency benefits",
      },
      {
        itemId: "GE009",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Dental Treatment",
        description: "Routine dental care, orthodontics, and dental procedures unless accident-related",
        coverageImpact: "Excluded unless dental rider purchased",
        isOverridable: true,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Emergency dental treatment due to accident may be covered",
      },
      {
        itemId: "GE010",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Vision Correction",
        description: "Routine eye examinations, eyeglasses, contact lenses, and refractive surgery",
        coverageImpact: "Excluded unless vision rider purchased",
        isOverridable: true,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Medically necessary eye surgery may be covered",
      },
      {
        itemId: "GE011",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Alternative Medicine",
        description: "Traditional medicine, acupuncture, chiropractic treatment, and other alternative therapies",
        coverageImpact: "Excluded unless specifically covered",
        isOverridable: true,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Some alternative treatments may be covered with additional rider",
      },
      {
        itemId: "GE012",
        catalogId: "STANDARD_EXCLUSIONS",
        title: "Organ Donation",
        description: "Medical expenses related to organ donation by the insured person",
        coverageImpact: "Donor expenses excluded, recipient may be covered",
        isOverridable: false,
        appliesTo: "All members",
        isVisibleToMember: true,
        remarks: "Living donor expenses not covered, but recipient treatment covered",
      },
    ]

    generalExclusions.forEach((exclusion) => {
      generalExclusionStorage.add(exclusion)
    })
  }

  console.log("Complete dummy catalogue data initialized successfully")
  console.log("- Pre-existing Conditions: 10 items")
  console.log("- Specified Illnesses: 8 items")
  console.log("- Congenital Conditions: 8 items")
  console.log("- General Exclusions: 12 items")
}
