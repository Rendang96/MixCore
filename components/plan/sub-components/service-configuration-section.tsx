"use client"

import { useFormikContext } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import type { PlanCreationFormValues, ServiceTypeConfig } from "@/types/plan-creation-form"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const ALL_SERVICE_TYPES = [
  { name: "GP - General Practitioner", code: "GP" },
  { name: "SP - Specialist", code: "SP" },
  { name: "OC - Optical", code: "OC" },
  { name: "DT - Dental", code: "DT" },
  { name: "IP - Inpatient", code: "IP" },
  { name: "HP - Hospitalization", code: "HP" },
  { name: "SG - Surgery", code: "SG" },
  { name: "MT - Maternity", code: "MT" },
  { name: "AM - Alternative Medicine", code: "AM" },
  { name: "ME - Medical Examination", code: "ME" },
  { name: "OH - Occupational Health", code: "OH" },
  { name: "OP - Ophthalmology", code: "OP" },
  { name: "PS - Psychiatrist", code: "PS" },
  { name: "RC - Root Canal", code: "RC" },
  { name: "PD - Pandemic", code: "PD" },
  { name: "FL - Flexi", code: "FL" },
]

const SUB_SERVICES_DATA: { [key: string]: string[] } = {
  GP: [
    "Primary Care Consultation",
    "Preventive Care",
    "Chronic Disease Management",
    "Minor Procedures",
    "Health Screenings",
    "Vaccination Services",
    "Wellness Programs",
  ],
  SP: [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Psychiatry",
    "Pulmonology",
    "Oncology",
    "Urology",
  ],
  OC: ["Eye Examination", "Vision Correction", "Eye Surgery", "Contact Lens Services", "Low Vision Services"],
  DT: ["Preventive Dentistry", "Restorative Dentistry", "Oral Surgery", "Orthodontics", "Periodontics", "Endodontics"],
  MT: [
    "Prenatal Care",
    "Delivery Services",
    "Postnatal Care",
    "Newborn Care",
    "Complication Management",
    "Fertility Services",
  ],
  IP: [
    "Medical Inpatient",
    "Surgical Inpatient",
    "ICU Care",
    "Emergency Admission",
    "Rehabilitation",
    "Psychiatric Inpatient",
  ],
  HP: [
    "Room & Board",
    "Nursing Care",
    "Hospital Services",
    "Emergency Services",
    "Day Care Services",
    "Ambulance Services",
  ],
  SG: [
    "Minor Surgery",
    "Major Surgery",
    "Day Surgery",
    "Specialized Surgery",
    "Reconstructive Surgery",
    "Cosmetic Surgery",
  ],
  OP: [
    "Comprehensive Eye Examination",
    "Retinal Screening",
    "Glaucoma Screening",
    "Cataract Surgery",
    "Retinal Surgery",
    "Corneal Treatment",
    "Diabetic Eye Care",
    "Pediatric Ophthalmology",
    "Oculoplastic Surgery",
    "Emergency Eye Care",
  ],
  ME: [
    "Routine Health Checkup",
    "Executive Health Screening",
    "Pre-Employment Medical",
    "Annual Physical Examination",
    "Comprehensive Health Assessment",
    "Wellness Screening",
    "Occupational Health Examination",
    "Fitness Assessment",
    "Travel Medical Clearance",
    "Insurance Medical Examination",
  ],
  AM: [
    "Acupuncture",
    "Chiropractic",
    "Physiotherapy",
    "Traditional Medicine",
    "Wellness Programs",
    "Therapeutic Massage",
    "Homeopathy",
  ],
  PS: [
    "Psychiatric Consultation",
    "Psychotherapy Sessions",
    "Medication Management",
    "Crisis Intervention",
    "Group Therapy",
    "Family Therapy",
    "Cognitive Behavioral Therapy",
    "Addiction Treatment",
    "Psychological Testing",
    "Emergency Psychiatric Care",
  ],
  RC: [
    "Root Canal Diagnosis",
    "Root Canal Treatment",
    "Root Canal Retreatment",
    "Apicoectomy",
    "Pulp Therapy",
    "Emergency Root Canal Treatment",
    "Post Root Canal Crown Placement",
    "Root Canal Follow-up Care",
    "Root Canal Pain Management",
    "Root Canal Complications Treatment",
  ],
  PD: [
    "Pandemic Screening",
    "Pandemic Testing",
    "Pandemic Vaccination",
    "Quarantine Monitoring",
    "Contact Tracing Support",
    "Pandemic Telemedicine",
    "Pandemic Emergency Care",
    "Isolation Care",
    "Post-Pandemic Recovery Support",
    "Pandemic Mental Health Support",
  ],
  FL: [
    "Wellness Programs",
    "Health Coaching",
    "Fitness Programs",
    "Nutrition Counseling",
    "Stress Management",
    "Lifestyle Medicine",
    "Preventive Care Services",
    "Health Education",
    "Chronic Disease Management",
    "Personalized Medicine",
  ],
}

export function ServiceConfigurationSection() {
  const { values, setFieldValue } = useFormikContext<PlanCreationFormValues>()
  const [accordionOpenItems, setAccordionOpenItems] = useState<string[]>([])

  useEffect(() => {
    // Initialize serviceConfigurations based on ALL_SERVICE_TYPES if empty or not fully initialized
    if (
      values.serviceConfigurations.length === 0 ||
      values.serviceConfigurations.some((config) => config.selected === undefined)
    ) {
      const initialConfigs: ServiceTypeConfig[] = ALL_SERVICE_TYPES.map((service) => ({
        ...service,
        autoSuspension: 80, // Default value
        subServices: (SUB_SERVICES_DATA[service.code] || []).map((sub) => ({ name: sub, selected: false })),
        selected: false, // Initialize new 'selected' property
      }))
      setFieldValue("serviceConfigurations", initialConfigs)
    }
  }, [values.serviceConfigurations, setFieldValue])

  const handleServiceTypeChange = (code: string, isChecked: boolean) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === code) {
        const newConfig = {
          ...config,
          selected: isChecked, // Update the main service type's selected state
          // When main service type is unchecked, unselect all sub-services
          subServices: isChecked ? config.subServices : config.subServices.map((sub) => ({ ...sub, selected: false })),
        }
        return newConfig
      }
      return config
    })
    setFieldValue("serviceConfigurations", updatedConfigs)

    // Update accordion open items based on the main service type's selected state
    setAccordionOpenItems((prev) => {
      if (isChecked) {
        return [...prev, code]
      } else {
        return prev.filter((item) => item !== code)
      }
    })
  }

  const handleSubServiceChange = (serviceCode: string, subServiceName: string, isChecked: boolean) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === serviceCode) {
        const updatedSubServices = config.subServices.map((sub) =>
          sub.name === subServiceName ? { ...sub, selected: isChecked } : sub,
        )
        // If any sub-service is selected, ensure the main service type is also selected
        const isAnySubServiceSelected = updatedSubServices.some((sub) => sub.selected)
        return {
          ...config,
          subServices: updatedSubServices,
          selected: isAnySubServiceSelected || config.selected, // Keep selected if already true, or set if sub-service is selected
        }
      }
      return config
    })
    setFieldValue("serviceConfigurations", updatedConfigs)
  }

  const handleSelectAllSubServices = (serviceCode: string) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === serviceCode) {
        return {
          ...config,
          subServices: config.subServices.map((sub) => ({ ...sub, selected: true })),
          selected: true, // Ensure main service type is selected
        }
      }
      return config
    })
    setFieldValue("serviceConfigurations", updatedConfigs)
  }

  const handleClearAllSubServices = (serviceCode: string) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === serviceCode) {
        return {
          ...config,
          subServices: config.subServices.map((sub) => ({ ...sub, selected: false })),
          // Do not unselect main service type here, it's handled by the main checkbox
        }
      }
      return config
    })
    setFieldValue("serviceConfigurations", updatedConfigs)
  }

  const handleAutoSuspensionChange = (serviceCode: string, value: number[]) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === serviceCode) {
        return { ...config, autoSuspension: value[0] }
      }
      return config
    })
    setFieldValue("serviceConfigurations", updatedConfigs)
  }

  const selectedServiceTypes = values.serviceConfigurations.filter((config) => config.selected)
  const totalSubServices = selectedServiceTypes.reduce(
    (sum, config) => sum + config.subServices.filter((sub) => sub.selected).length,
    0,
  )

  const expandAll = () => {
    setAccordionOpenItems(
      values.serviceConfigurations
        .filter((config) => config.selected && config.subServices.length > 0) // Only expand selected ones with sub-services
        .map((config) => config.code),
    )
  }

  const collapseAll = () => {
    setAccordionOpenItems([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Configuration</CardTitle>
        <CardDescription>
          Select service types and their sub-services. Billing groups will be configured in the Benefit Limits step.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end items-center text-sm text-gray-600">
          <span>{selectedServiceTypes.length} service types</span>
          <span className="ml-4">{totalSubServices} sub-services</span>
        </div>

        {/* Available Service Types */}
        <div className="space-y-2">
          <Label>Available Service Types</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.serviceConfigurations.map((serviceConfig) => (
              <div key={serviceConfig.code} className="flex items-center space-x-2">
                <Checkbox
                  id={`service-type-${serviceConfig.code}`}
                  checked={serviceConfig.selected} // Use the new 'selected' property
                  onCheckedChange={(checked) => handleServiceTypeChange(serviceConfig.code, !!checked)}
                />
                <Label htmlFor={`service-type-${serviceConfig.code}`}>{serviceConfig.name}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Service Type Selection */}
        <div className="space-y-2">
          <Label>Sub-Service Type Selection</Label>
          <div className="flex gap-2 mb-4">
            <Button type="button" variant="outline" onClick={expandAll} className="bg-black text-white">
              Expand All
            </Button>
            <Button type="button" variant="outline" onClick={collapseAll} className="bg-black text-white">
              Collapse All
            </Button>
          </div>
          <Accordion
            type="multiple"
            value={accordionOpenItems}
            onValueChange={setAccordionOpenItems}
            className="w-full"
          >
            {values.serviceConfigurations
              .filter((config) => config.selected && config.subServices.length > 0) // Only show if main service type is selected AND has sub-services
              .map((serviceConfig) => {
                const selectedSubServicesCount = serviceConfig.subServices.filter((sub) => sub.selected).length
                const totalSubServicesForType = serviceConfig.subServices.length

                return (
                  <AccordionItem
                    key={serviceConfig.code}
                    value={serviceConfig.code}
                    className={cn(
                      "border rounded-md mb-2",
                      serviceConfig.selected ? "border-blue-200 bg-blue-50" : "border-gray-200", // Apply blue if main service type is selected
                    )}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-3 w-3 rounded-full",
                              serviceConfig.selected ? "bg-blue-600" : "bg-gray-400", // Apply blue if main service type is selected
                            )}
                          />
                          <span className="font-medium">{serviceConfig.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {selectedSubServicesCount} of {totalSubServicesForType} sub-services selected
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            Auto Suspension % {serviceConfig.autoSuspension}
                          </span>
                          <Slider
                            value={[serviceConfig.autoSuspension]}
                            max={100}
                            step={1}
                            onValueChange={(val) => handleAutoSuspensionChange(serviceConfig.code, val)}
                            className="w-[100px]"
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 border-t bg-white">
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectAllSubServices(serviceConfig.code)}
                          className="bg-black text-white"
                        >
                          Select All Sub-Services
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleClearAllSubServices(serviceConfig.code)}
                          className="bg-black text-white"
                        >
                          Clear All Sub-Services
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {serviceConfig.subServices.map((subService) => (
                          <div key={subService.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sub-service-${serviceConfig.code}-${subService.name}`}
                              checked={subService.selected}
                              onCheckedChange={(checked) =>
                                handleSubServiceChange(serviceConfig.code, subService.name, !!checked)
                              }
                            />
                            <Label htmlFor={`sub-service-${serviceConfig.code}-${subService.name}`}>
                              {subService.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
          </Accordion>
        </div>

        {/* Service Configuration Summary */}
        <div className="mt-6 p-4 border rounded-md bg-gray-50 flex justify-between items-center text-sm text-gray-600">
          <div>
            Service Types: {selectedServiceTypes.length} Sub-Services: {totalSubServices}
          </div>
          <div className={cn("font-semibold", totalSubServices > 0 ? "text-green-600" : "text-red-600")}>
            Configuration Status: {totalSubServices > 0 ? "Complete" : "Incomplete"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
