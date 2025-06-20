"use client"
import { useState } from "react"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PlanCreationFormValues } from "@/types/plan-creation-form"
import { BasicInfoStep } from "@/components/plan/steps/basic-info-step"
import { ProviderSelectionStep } from "@/components/plan/steps/provider-selection-step"
import { BenefitLimitsStep } from "@/components/plan/steps/benefit-limits-step"
import { SpecialRulesStep } from "@/components/plan/steps/special-rules-step"
import { ReviewStep } from "@/components/plan/steps/review-step"
import { cn } from "@/lib/utils"

interface PlanCreationFormProps {
  onBack: () => void
  onSave: (values: any) => void
  initialData?: any // For editing or copying
}

export function PlanCreationForm({ onBack, onSave, initialData }: PlanCreationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const initialValues: PlanCreationFormValues = initialData
    ? {
        ...initialData,
        effectiveDate: initialData.effectiveDate ? new Date(initialData.effectiveDate) : undefined,
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate) : undefined,
        // Ensure nested objects are initialized if they might be missing in old data
        providerSelectionEnabled: initialData.providerAccess === "Selected Providers",
        specialRulesEnabled: initialData.hasSpecialRules,
        billbackEnabled: initialData.hasBillback,
        eligibilityCriteriaEnabled: initialData.eligibility?.primaryMemberMinAge !== undefined, // Heuristic
        maternityCoverageEnabled: initialData.maternity?.membersCovered !== undefined, // Heuristic
        selectedProviders: initialData.selectedProviders || [], // Map existing selectedProviders to new structure if needed
        serviceConfigurations: initialData.serviceConfigurations || [],
        eligibility: initialData.eligibility || {
          primaryMemberMinAge: "",
          primaryMemberMaxAge: "",
          spouseMinAge: "",
          spouseMaxAge: "",
          maxChildAge: "",
          maxAgeIfStudying: "",
          maxSpouses: "",
          maxChildren: "",
          coverDisabledChildren: false,
          disabledChildrenAgeLimitType: "",
          disabledChildrenAgeLimitValue: "",
          spouseCoverageByGender: "No",
          spouseCoverageByEmploymentStatus: "No",
        },
        maternity: initialData.maternity || {
          staffCategory: [],
          membersCovered: "",
          totalNoOfDeliveryType: "",
          totalNoOfDeliveryValue: "",
          waitingPeriod: "",
        },
      }
    : {
        planName: "",
        planType: "",
        effectiveDate: undefined,
        expiryDate: undefined,
        description: "",
        providerSelectionEnabled: false,
        specialRulesEnabled: false,
        billbackEnabled: false,
        eligibilityCriteriaEnabled: false,
        maternityCoverageEnabled: false,
        selectedProviders: [],
        serviceConfigurations: [],
        eligibility: {
          primaryMemberMinAge: "",
          primaryMemberMaxAge: "",
          spouseMinAge: "",
          spouseMaxAge: "",
          maxChildAge: "",
          maxAgeIfStudying: "",
          maxSpouses: "",
          maxChildren: "",
          coverDisabledChildren: false,
          disabledChildrenAgeLimitType: "",
          disabledChildrenAgeLimitValue: "",
          spouseCoverageByGender: "No",
          spouseCoverageByEmploymentStatus: "No",
        },
        maternity: {
          staffCategory: [],
          membersCovered: "",
          totalNoOfDeliveryType: "",
          totalNoOfDeliveryValue: "",
          waitingPeriod: "",
        },
        benefitLimits: [],
        specialRules: [],
      }

  const validationSchema = [
    // Step 1: Basic Info Validation
    Yup.object().shape({
      planName: Yup.string().required("Plan Name is required"),
      planType: Yup.string().required("Plan Type is required"),
      effectiveDate: Yup.date()
        .required("Effective Date is required")
        .nullable()
        .min(new Date(new Date().setHours(0, 0, 0, 0)), "Plan start date cannot be in the past"),
      expiryDate: Yup.date()
        .required("Expiry Date is required")
        .nullable()
        .min(Yup.ref("effectiveDate"), "Expiry Date cannot be before Effective Date"),
      description: Yup.string().max(500, "Description must be less than 500 characters"),
      // Add validation for nested sections if enabled
      eligibilityCriteriaEnabled: Yup.boolean(),
      eligibility: Yup.object().when("eligibilityCriteriaEnabled", {
        is: true,
        then: (schema) =>
          schema.shape({
            primaryMemberMinAge: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(0, "Min age cannot be negative"),
            primaryMemberMaxAge: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(Yup.ref("primaryMemberMinAge"), "Max age cannot be less than min age"),
            spouseMinAge: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(0, "Min age cannot be negative"),
            spouseMaxAge: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(Yup.ref("spouseMinAge"), "Max age cannot be less than min age"),
            maxChildAge: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(0, "Max child age cannot be negative"),
            maxAgeIfStudying: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(Yup.ref("maxChildAge"), "Must be greater than Max Child Age"),
            maxSpouses: Yup.number().typeError("Must be a number").required("Required").min(0, "Cannot be negative"),
            maxChildren: Yup.number().typeError("Must be a number").required("Required").min(0, "Cannot be negative"),
            coverDisabledChildren: Yup.boolean(),
            disabledChildrenAgeLimitType: Yup.string().when("coverDisabledChildren", {
              is: true,
              then: (schema) => schema.required("Required"),
            }),
            disabledChildrenAgeLimitValue: Yup.number().when("disabledChildrenAgeLimitType", {
              is: "Age limit",
              then: (schema) =>
                schema.typeError("Must be a number").required("Required").min(0, "Age limit cannot be negative"),
              otherwise: (schema) => schema.notRequired(),
            }),
            spouseCoverageByGender: Yup.string().required("Required"),
            spouseCoverageByEmploymentStatus: Yup.string().required("Required"),
          }),
        otherwise: (schema) => schema, // No validation if disabled
      }),
      maternityCoverageEnabled: Yup.boolean(),
      maternity: Yup.object().when("maternityCoverageEnabled", {
        is: true,
        then: (schema) =>
          schema.shape({
            staffCategory: Yup.array().min(1, "Select at least one staff category").required("Required"),
            membersCovered: Yup.string().required("Required"),
            totalNoOfDeliveryType: Yup.string().required("Required"),
            totalNoOfDeliveryValue: Yup.number()
              .typeError("Must be a number")
              .required("Required")
              .min(1, "Must be at least 1"),
            waitingPeriod: Yup.string().required("Required"),
          }),
        otherwise: (schema) => schema, // No validation if disabled
      }),
    }),
    // Step 2: Provider Selection Validation (only if enabled)
    Yup.object().shape({
      providerSelectionEnabled: Yup.boolean(),
      selectedProviders: Yup.array().when("providerSelectionEnabled", {
        is: true,
        then: (schema) => schema.min(1, "At least one provider must be selected if enabled"),
        otherwise: (schema) => schema, // No validation if disabled
      }),
    }),
    // Step 3: Benefit Limits Validation (placeholder)
    Yup.object().shape({}),
    // Step 4: Special Rules Validation (placeholder)
    Yup.object().shape({}),
    // Step 5: Review Validation (placeholder)
    Yup.object().shape({}),
  ]

  const formik = useFormik<PlanCreationFormValues>({
    initialValues,
    validationSchema: validationSchema[currentStep - 1],
    onSubmit: (values) => {
      if (currentStep < validationSchema.length) {
        setCurrentStep(currentStep + 1)
      } else {
        // Final submission
        const finalValues = {
          ...values,
          status: initialData?.status || "Draft", // Maintain status if editing, else Draft
          // Map providerSelectionEnabled to providerAccess
          providerAccess: values.providerSelectionEnabled ? "Selected Providers" : "All Providers",
          // Map specialRulesEnabled to hasSpecialRules
          hasSpecialRules: values.specialRulesEnabled,
          // Map billbackEnabled to hasBillback
          hasBillback: values.billbackEnabled,
          // Map serviceConfigurations to serviceTypes (simplified for now)
          serviceTypes: values.serviceConfigurations
            .filter((s) => s.subServices.some((ss) => ss.selected))
            .map((s) => s.name),
          // Update progress and configStatus based on completion
          progress: {
            currentStep: validationSchema.length, // Mark as complete for now
            totalSteps: validationSchema.length,
          },
          configStatus: {
            basicInfo: true,
            providerSelection: values.providerSelectionEnabled ? values.selectedProviders.length > 0 : true, // If enabled, check if records exist
            benefitLimits: values.benefitLimits.length > 0, // Assuming limits are added
            specialRules: values.specialRulesEnabled ? values.specialRules.length > 0 : true, // If enabled, check if rules exist
            review: true,
          },
        }
        onSave(finalValues)
      }
    },
    enableReinitialize: true, // Reinitialize form when initialData changes
  })

  const steps = [
    {
      id: 1,
      name: "Basic Info",
      component: BasicInfoStep,
      props: {
        initialData: initialData,
        onProviderSelectionToggle: (enabled: boolean) => {
          formik.setFieldValue("providerSelectionEnabled", enabled)
        },
        onSpecialRulesToggle: (enabled: boolean) => {
          formik.setFieldValue("specialRulesEnabled", enabled)
        },
      },
    },
    {
      id: 2,
      name: "Provider Selection",
      component: ProviderSelectionStep,
      hidden: !formik.values.providerSelectionEnabled,
    },
    { id: 3, name: "Benefit Limits", component: BenefitLimitsStep },
    {
      id: 4,
      name: "Special Rules",
      component: SpecialRulesStep,
      hidden: !formik.values.specialRulesEnabled,
    },
    { id: 5, name: "Review", component: ReviewStep },
  ].filter((step) => !step.hidden) // Filter out hidden steps from navigation

  const CurrentStepComponent = steps[currentStep - 1]?.component

  const handleNext = async () => {
    try {
      await formik.validateForm() // Validate all fields
      const errors = await formik.validateForm()
      const currentStepFields = Object.keys(validationSchema[currentStep - 1].fields)
      const currentStepErrors = Object.keys(errors).filter((key) => currentStepFields.includes(key))

      if (currentStepErrors.length === 0) {
        if (currentStep < steps.length) {
          setCurrentStep(currentStep + 1)
        } else {
          formik.submitForm() // Final submission
        }
      } else {
        formik.setTouched(
          currentStepFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
          false,
        )
        console.log("Validation errors:", errors)
      }
    } catch (error) {
      console.error("Validation error:", error)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack() // Go back to plan listing if on first step
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Plan</h1>
        </div>
        <Button variant="outline" onClick={onBack} className="bg-black text-white">
          Back to Plan Setup
        </Button>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center gap-4 py-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-bold",
                currentStep === step.id
                  ? "bg-blue-600 text-white"
                  : currentStep > step.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {step.id}
            </div>
            <span
              className={cn(
                "text-sm font-medium cursor-pointer",
                currentStep === step.id ? "text-blue-600" : "text-gray-500",
              )}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className={cn("h-4 w-4", currentStep > step.id ? "text-green-500" : "text-gray-400")} />
            )}
          </div>
        ))}
      </div>

      <FormikProvider value={formik}>
        <Form>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {CurrentStepComponent && <CurrentStepComponent {...CurrentStepComponent.props} />}
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handleBack} className="bg-black text-white">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
              {currentStep === steps.length ? "Save Plan" : "Next"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  )
}
