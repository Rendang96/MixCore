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
  { name: "IP - Inpatient", code: "IP" },
  { name: "AM - Alternative Medicine", code: "AM" },
  { name: "PS - Psychiatrist", code: "PS" },
  { name: "HP - Hospitalization", code: "HP" },
  { name: "ME - Medical Examination", code: "ME" },
  { name: "RC - Root Canal", code: "RC" },
  { name: "OC - Optical", code: "OC" },
  { name: "SG - Surgery", code: "SG" },
  { name: "OH - Occupational Health", code: "OH" },
  { name: "PD - Pandemic", code: "PD" },
  { name: "DT - Dental", code: "DT" },
  { name: "MT - Maternity", code: "MT" },
  { name: "OP - Ophthalmology", code: "OP" },
  { name: "FL - Flexi", code: "FL" },
]

const SUB_SERVICES_DATA: { [key: string]: string[] } = {
  GP: [
    "Primary Care Consultation",
    "Chronic Disease Management",
    "Health Screenings",
    "Wellness Programs",
    "Preventive Care",
    "Minor Procedures",
    "Vaccination Services",
  ],
  SP: [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Neurology",
    "Psychiatry",
    "Oncology",
    "Pulmonology",
    "Urology",
    "Gastroenterology",
    "Orthopedics",
  ],
  // Add more sub-services for other types as needed
}

export function ServiceConfigurationSection() {
  const { values, setFieldValue } = useFormikContext<PlanCreationFormValues>()
  const [accordionOpenItems, setAccordionOpenItems] = useState<string[]>([])

  useEffect(() => {
    // Initialize serviceConfigurations based on ALL_SERVICE_TYPES if empty
    if (values.serviceConfigurations.length === 0) {
      const initialConfigs: ServiceTypeConfig[] = ALL_SERVICE_TYPES.map((service) => ({
        ...service,
        autoSuspension: 80, // Default value
        subServices: (SUB_SERVICES_DATA[service.code] || []).map((sub) => ({ name: sub, selected: false })),
        expanded: false,
      }))
      setFieldValue("serviceConfigurations", initialConfigs)
    }
  }, [values.serviceConfigurations, setFieldValue])

  const handleServiceTypeChange = (code: string, isChecked: boolean) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === code) {
        return {
          ...config,
          // When main service type is unchecked, unselect all sub-services
          subServices: isChecked ? config.subServices : config.subServices.map((sub) => ({ ...sub, selected: false })),
        }
      }
      return config
    })
    setFieldValue("serviceConfigurations", updatedConfigs)
  }

  const handleSubServiceChange = (serviceCode: string, subServiceName: string, isChecked: boolean) => {
    const updatedConfigs = values.serviceConfigurations.map((config) => {
      if (config.code === serviceCode) {
        return {
          ...config,
          subServices: config.subServices.map((sub) =>
            sub.name === subServiceName ? { ...sub, selected: isChecked } : sub,
          ),
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

  const selectedServiceTypes = values.serviceConfigurations.filter((config) =>
    config.subServices.some((sub) => sub.selected),
  )
  const totalSubServices = selectedServiceTypes.reduce(
    (sum, config) => sum + config.subServices.filter((sub) => sub.selected).length,
    0,
  )

  const toggleAccordionItem = (itemValue: string) => {
    setAccordionOpenItems((prev) =>
      prev.includes(itemValue) ? prev.filter((item) => item !== itemValue) : [...prev, itemValue],
    )
  }

  const expandAll = () => {
    setAccordionOpenItems(
      values.serviceConfigurations.filter((config) => config.subServices.length > 0).map((config) => config.code),
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
                  checked={serviceConfig.subServices.some((sub) => sub.selected)}
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
              .filter((config) => config.subServices.length > 0) // Only show if has sub-services
              .map((serviceConfig) => {
                const selectedSubServicesCount = serviceConfig.subServices.filter((sub) => sub.selected).length
                const totalSubServicesForType = serviceConfig.subServices.length
                const isServiceTypeSelected = selectedSubServicesCount > 0

                return (
                  <AccordionItem
                    key={serviceConfig.code}
                    value={serviceConfig.code}
                    className={cn(
                      "border rounded-md mb-2",
                      isServiceTypeSelected ? "border-blue-200 bg-blue-50" : "border-gray-200",
                    )}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-3 w-3 rounded-full",
                              isServiceTypeSelected ? "bg-blue-600" : "bg-gray-400",
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
