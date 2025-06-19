"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, CreditCard, Shield, Users, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SimplifiedSpecialRulesSetupProps {
  onNext: () => void
  onBack: () => void
  onSpecialRulesChange?: (specialRules: any) => void
  limitHierarchy?: any[]
  initialSpecialRules?: any
}

// Enhanced Co-Payment Interface
interface EnhancedCoPayment {
  id: string
  name: string
  type: string
  serviceType: string
  paymentMethod: string
  amount: number
  unit: string
  isSequential: boolean
  sequentialOrder?: number
  description: string

  // Enhanced features
  deductibleIntegration: boolean
  annualCap?: number
  networkVariations: {
    inNetwork: { amount: number; unit: string }
    outOfNetwork: { amount: number; unit: string }
  }
  memberTypeRules: { [memberType: string]: { amount: number; unit: string } }
  exemptions: string[]
  accumulationRules: "toward_deductible" | "separate" | "after_deductible"
  isEssentialBenefit: boolean
  mentalHealthParity: boolean
}

// Benefit Coordination Interface
interface BenefitCoordination {
  id: string
  name: string
  coordinationType: "primary_secondary" | "medicare_supplement" | "dual_coverage"
  primaryPlan: string
  secondaryPlan: string
  cobRules: {
    rule: string
    priority: number
    description: string
  }[]
  medicareIntegration: {
    enabled: boolean
    medicareType: "part_a" | "part_b" | "part_c" | "part_d"
    supplementRules: string
  }
}

// Regulatory Compliance Interface
interface RegulatoryCompliance {
  essentialHealthBenefits: {
    enabled: boolean
    categories: string[]
    exemptions: string[]
  }
  preventiveCareExemptions: {
    enabled: boolean
    services: string[]
    copaymentWaived: boolean
  }
  mentalHealthParity: {
    enabled: boolean
    treatmentLimits: boolean
    financialRequirements: boolean
    quantitativeLimits: boolean
  }
}

export function SimplifiedSpecialRulesSetup({
  onNext,
  onBack,
  onSpecialRulesChange,
  limitHierarchy = [],
  initialSpecialRules,
}: SimplifiedSpecialRulesSetupProps) {
  const [activeTab, setActiveTab] = useState("co-payment")

  // State Management
  const [coPayments, setCoPayments] = useState<EnhancedCoPayment[]>([])
  const [benefitCoordination, setBenefitCoordination] = useState<BenefitCoordination[]>([])
  const [regulatoryCompliance, setRegulatoryCompliance] = useState<RegulatoryCompliance>({
    essentialHealthBenefits: {
      enabled: false,
      categories: [],
      exemptions: [],
    },
    preventiveCareExemptions: {
      enabled: false,
      services: [],
      copaymentWaived: false,
    },
    mentalHealthParity: {
      enabled: false,
      treatmentLimits: false,
      financialRequirements: false,
      quantitativeLimits: false,
    },
  })

  // Constants for dropdowns
  const memberTypes = ["employee", "spouse", "child", "parents", "policyholder"]
  const serviceTypes = ["GP", "SP", "OC", "DT", "IP", "HP", "SG", "MT", "AM"]
  const exemptionTypes = ["preventive_care", "emergency_services", "mental_health", "maternity", "pediatric_care"]
  const essentialHealthBenefitCategories = [
    "ambulatory_patient_services",
    "emergency_services",
    "hospitalization",
    "maternity_newborn_care",
    "mental_health_substance_abuse",
    "prescription_drugs",
    "rehabilitative_services",
    "laboratory_services",
    "preventive_wellness_services",
    "pediatric_services",
  ]
  const preventiveCareServices = [
    "annual_physical",
    "immunizations",
    "cancer_screenings",
    "preventive_dental",
    "vision_screening",
    "mental_health_screening",
  ]

  useEffect(() => {
    if (initialSpecialRules) {
      if (initialSpecialRules.coPayments) setCoPayments(initialSpecialRules.coPayments)
      if (initialSpecialRules.benefitCoordination) setBenefitCoordination(initialSpecialRules.benefitCoordination)
      if (initialSpecialRules.regulatoryCompliance) setRegulatoryCompliance(initialSpecialRules.regulatoryCompliance)
    }
  }, [initialSpecialRules])

  // Enhanced Co-Payment Functions
  const addCoPayment = () => {
    const newCoPayment: EnhancedCoPayment = {
      id: Date.now().toString(),
      name: "",
      type: "",
      serviceType: "",
      paymentMethod: "",
      amount: 0,
      unit: "MYR",
      isSequential: false,
      description: "",
      deductibleIntegration: false,
      annualCap: undefined,
      networkVariations: {
        inNetwork: { amount: 0, unit: "MYR" },
        outOfNetwork: { amount: 0, unit: "MYR" },
      },
      memberTypeRules: {},
      exemptions: [],
      accumulationRules: "separate",
      isEssentialBenefit: false,
      mentalHealthParity: false,
    }
    setCoPayments([...coPayments, newCoPayment])
  }

  const updateCoPayment = (id: string, field: keyof EnhancedCoPayment, value: any) => {
    setCoPayments(coPayments.map((cp) => (cp.id === id ? { ...cp, [field]: value } : cp)))
  }

  const removeCoPayment = (id: string) => {
    setCoPayments(coPayments.filter((cp) => cp.id !== id))
  }

  // Benefit Coordination Functions
  const addBenefitCoordination = () => {
    const newBenefitCoordination: BenefitCoordination = {
      id: Date.now().toString(),
      name: "",
      coordinationType: "primary_secondary",
      primaryPlan: "",
      secondaryPlan: "",
      cobRules: [],
      medicareIntegration: {
        enabled: false,
        medicareType: "part_a",
        supplementRules: "",
      },
    }
    setBenefitCoordination([...benefitCoordination, newBenefitCoordination])
  }

  const updateBenefitCoordination = (id: string, field: keyof BenefitCoordination, value: any) => {
    setBenefitCoordination(benefitCoordination.map((bc) => (bc.id === id ? { ...bc, [field]: value } : bc)))
  }

  const removeBenefitCoordination = (id: string) => {
    setBenefitCoordination(benefitCoordination.filter((bc) => bc.id !== id))
  }

  const handleNext = () => {
    if (onSpecialRulesChange) {
      onSpecialRulesChange({
        coPayments,
        benefitCoordination,
        regulatoryCompliance,
      })
    }
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Special Rules & Compliance Setup
        </CardTitle>
        <CardDescription>
          Configure co-payment rules, benefit coordination, and regulatory compliance features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="co-payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Co-Payment
            </TabsTrigger>
            <TabsTrigger value="benefit-coordination" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Benefit Coordination
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Co-Payment Tab */}
          <TabsContent value="co-payment" className="space-y-6">
            {coPayments.map((coPayment, index) => (
              <Card key={coPayment.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Enhanced Co-Payment #{index + 1}
                      {coPayment.isEssentialBenefit && <Badge variant="secondary">EHB</Badge>}
                      {coPayment.mentalHealthParity && <Badge variant="outline">MHP</Badge>}
                    </CardTitle>
                    {coPayments.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCoPayment(coPayment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Co-Payment Name</Label>
                      <Input
                        value={coPayment.name}
                        onChange={(e) => updateCoPayment(coPayment.id, "name", e.target.value)}
                        placeholder="Enter co-payment name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Co-Payment Type</Label>
                      <Select
                        value={coPayment.type}
                        onValueChange={(value) => updateCoPayment(coPayment.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select co-payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fixed Co-Payment">Fixed Co-Payment</SelectItem>
                          <SelectItem value="Percentage Co-Payment">Percentage Co-Payment</SelectItem>
                          <SelectItem value="Tiered Co-Payment">Tiered Co-Payment</SelectItem>
                          <SelectItem value="Sequential Co-Payment">Sequential Co-Payment</SelectItem>
                          <SelectItem value="Network-Based Co-Payment">Network-Based Co-Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <Select
                        value={coPayment.serviceType}
                        onValueChange={(value) => updateCoPayment(coPayment.id, "serviceType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select
                        value={coPayment.paymentMethod}
                        onValueChange={(value) => updateCoPayment(coPayment.id, "paymentMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                          <SelectItem value="Per Visit">Per Visit</SelectItem>
                          <SelectItem value="Per Service">Per Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={coPayment.amount}
                        onChange={(e) => updateCoPayment(coPayment.id, "amount", Number(e.target.value) || 0)}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  {/* Network Variations */}
                  <Card className="bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Network-Based Co-Payment Variations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>In-Network Amount</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={coPayment.networkVariations.inNetwork.amount}
                              onChange={(e) =>
                                updateCoPayment(coPayment.id, "networkVariations", {
                                  ...coPayment.networkVariations,
                                  inNetwork: {
                                    ...coPayment.networkVariations.inNetwork,
                                    amount: Number(e.target.value),
                                  },
                                })
                              }
                              placeholder="Amount"
                            />
                            <Select
                              value={coPayment.networkVariations.inNetwork.unit}
                              onValueChange={(value) =>
                                updateCoPayment(coPayment.id, "networkVariations", {
                                  ...coPayment.networkVariations,
                                  inNetwork: { ...coPayment.networkVariations.inNetwork, unit: value },
                                })
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MYR">MYR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="%">%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Out-of-Network Amount</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={coPayment.networkVariations.outOfNetwork.amount}
                              onChange={(e) =>
                                updateCoPayment(coPayment.id, "networkVariations", {
                                  ...coPayment.networkVariations,
                                  outOfNetwork: {
                                    ...coPayment.networkVariations.outOfNetwork,
                                    amount: Number(e.target.value),
                                  },
                                })
                              }
                              placeholder="Amount"
                            />
                            <Select
                              value={coPayment.networkVariations.outOfNetwork.unit}
                              onValueChange={(value) =>
                                updateCoPayment(coPayment.id, "networkVariations", {
                                  ...coPayment.networkVariations,
                                  outOfNetwork: { ...coPayment.networkVariations.outOfNetwork, unit: value },
                                })
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MYR">MYR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="%">%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advanced Features */}
                  <Card className="bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Advanced Co-Payment Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={coPayment.deductibleIntegration}
                            onCheckedChange={(checked) =>
                              updateCoPayment(coPayment.id, "deductibleIntegration", checked)
                            }
                          />
                          <Label>Deductible Integration</Label>
                        </div>
                        <div className="space-y-2">
                          <Label>Annual Cap (Optional)</Label>
                          <Input
                            type="number"
                            value={coPayment.annualCap || ""}
                            onChange={(e) =>
                              updateCoPayment(
                                coPayment.id,
                                "annualCap",
                                e.target.value ? Number(e.target.value) : undefined,
                              )
                            }
                            placeholder="Enter annual cap"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Accumulation Rules</Label>
                        <RadioGroup
                          value={coPayment.accumulationRules}
                          onValueChange={(value) => updateCoPayment(coPayment.id, "accumulationRules", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="toward_deductible" id="toward_deductible" />
                            <Label htmlFor="toward_deductible">Counts Toward Deductible</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="separate" id="separate" />
                            <Label htmlFor="separate">Separate from Deductible</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="after_deductible" id="after_deductible" />
                            <Label htmlFor="after_deductible">Applied After Deductible</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Exemptions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {exemptionTypes.map((exemption) => (
                            <div key={exemption} className="flex items-center space-x-2">
                              <Checkbox
                                checked={coPayment.exemptions.includes(exemption)}
                                onCheckedChange={(checked) => {
                                  const newExemptions = checked
                                    ? [...coPayment.exemptions, exemption]
                                    : coPayment.exemptions.filter((e) => e !== exemption)
                                  updateCoPayment(coPayment.id, "exemptions", newExemptions)
                                }}
                              />
                              <Label className="text-sm">
                                {exemption.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={coPayment.isEssentialBenefit}
                            onCheckedChange={(checked) => updateCoPayment(coPayment.id, "isEssentialBenefit", checked)}
                          />
                          <Label>Essential Health Benefit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={coPayment.mentalHealthParity}
                            onCheckedChange={(checked) => updateCoPayment(coPayment.id, "mentalHealthParity", checked)}
                          />
                          <Label>Mental Health Parity</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={coPayment.description}
                      onChange={(e) => updateCoPayment(coPayment.id, "description", e.target.value)}
                      placeholder="Enter co-payment description"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addCoPayment}
              className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Enhanced Co-Payment
            </Button>
          </TabsContent>

          {/* Benefit Coordination Tab */}
          <TabsContent value="benefit-coordination" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Benefit Coordination manages how this plan works with other insurance coverage, including
                primary/secondary coordination and Medicare integration.
              </AlertDescription>
            </Alert>

            {benefitCoordination.map((bc, index) => (
              <Card key={bc.id} className="border-l-4 border-l-cyan-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Benefit Coordination #{index + 1}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBenefitCoordination(bc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coordination Name</Label>
                      <Input
                        value={bc.name}
                        onChange={(e) => updateBenefitCoordination(bc.id, "name", e.target.value)}
                        placeholder="Enter coordination name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Coordination Type</Label>
                      <Select
                        value={bc.coordinationType}
                        onValueChange={(value) => updateBenefitCoordination(bc.id, "coordinationType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary_secondary">Primary/Secondary</SelectItem>
                          <SelectItem value="medicare_supplement">Medicare Supplement</SelectItem>
                          <SelectItem value="dual_coverage">Dual Coverage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {bc.coordinationType === "medicare_supplement" && (
                    <Card className="bg-blue-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Medicare Integration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={bc.medicareIntegration.enabled}
                            onCheckedChange={(checked) =>
                              updateBenefitCoordination(bc.id, "medicareIntegration", {
                                ...bc.medicareIntegration,
                                enabled: checked,
                              })
                            }
                          />
                          <Label>Enable Medicare Integration</Label>
                        </div>

                        {bc.medicareIntegration.enabled && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Medicare Type</Label>
                              <Select
                                value={bc.medicareIntegration.medicareType}
                                onValueChange={(value) =>
                                  updateBenefitCoordination(bc.id, "medicareIntegration", {
                                    ...bc.medicareIntegration,
                                    medicareType: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="part_a">Part A (Hospital)</SelectItem>
                                  <SelectItem value="part_b">Part B (Medical)</SelectItem>
                                  <SelectItem value="part_c">Part C (Advantage)</SelectItem>
                                  <SelectItem value="part_d">Part D (Prescription)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Supplement Rules</Label>
                              <Input
                                value={bc.medicareIntegration.supplementRules}
                                onChange={(e) =>
                                  updateBenefitCoordination(bc.id, "medicareIntegration", {
                                    ...bc.medicareIntegration,
                                    supplementRules: e.target.value,
                                  })
                                }
                                placeholder="Enter supplement rules"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addBenefitCoordination}
              className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit Coordination
            </Button>
          </TabsContent>

          {/* Regulatory Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Configure regulatory compliance features including Essential Health Benefits, preventive care
                exemptions, and mental health parity requirements.
              </AlertDescription>
            </Alert>

            {/* Essential Health Benefits */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Essential Health Benefits (EHB)</CardTitle>
                <CardDescription>Configure ACA Essential Health Benefits compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={regulatoryCompliance.essentialHealthBenefits.enabled}
                    onCheckedChange={(checked) =>
                      setRegulatoryCompliance({
                        ...regulatoryCompliance,
                        essentialHealthBenefits: {
                          ...regulatoryCompliance.essentialHealthBenefits,
                          enabled: checked,
                        },
                      })
                    }
                  />
                  <Label>Enable Essential Health Benefits Compliance</Label>
                </div>

                {regulatoryCompliance.essentialHealthBenefits.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>EHB Categories</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {essentialHealthBenefitCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              checked={regulatoryCompliance.essentialHealthBenefits.categories.includes(category)}
                              onCheckedChange={(checked) => {
                                const newCategories = checked
                                  ? [...regulatoryCompliance.essentialHealthBenefits.categories, category]
                                  : regulatoryCompliance.essentialHealthBenefits.categories.filter(
                                      (c) => c !== category,
                                    )
                                setRegulatoryCompliance({
                                  ...regulatoryCompliance,
                                  essentialHealthBenefits: {
                                    ...regulatoryCompliance.essentialHealthBenefits,
                                    categories: newCategories,
                                  },
                                })
                              }}
                            />
                            <Label className="text-sm">
                              {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preventive Care Exemptions */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">Preventive Care Exemptions</CardTitle>
                <CardDescription>Configure preventive care co-payment exemptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={regulatoryCompliance.preventiveCareExemptions.enabled}
                    onCheckedChange={(checked) =>
                      setRegulatoryCompliance({
                        ...regulatoryCompliance,
                        preventiveCareExemptions: {
                          ...regulatoryCompliance.preventiveCareExemptions,
                          enabled: checked,
                        },
                      })
                    }
                  />
                  <Label>Enable Preventive Care Exemptions</Label>
                </div>

                {regulatoryCompliance.preventiveCareExemptions.enabled && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={regulatoryCompliance.preventiveCareExemptions.copaymentWaived}
                        onCheckedChange={(checked) =>
                          setRegulatoryCompliance({
                            ...regulatoryCompliance,
                            preventiveCareExemptions: {
                              ...regulatoryCompliance.preventiveCareExemptions,
                              copaymentWaived: checked,
                            },
                          })
                        }
                      />
                      <Label>Waive Co-payments for Preventive Care</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Preventive Care Services</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {preventiveCareServices.map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              checked={regulatoryCompliance.preventiveCareExemptions.services.includes(service)}
                              onCheckedChange={(checked) => {
                                const newServices = checked
                                  ? [...regulatoryCompliance.preventiveCareExemptions.services, service]
                                  : regulatoryCompliance.preventiveCareExemptions.services.filter((s) => s !== service)
                                setRegulatoryCompliance({
                                  ...regulatoryCompliance,
                                  preventiveCareExemptions: {
                                    ...regulatoryCompliance.preventiveCareExemptions,
                                    services: newServices,
                                  },
                                })
                              }}
                            />
                            <Label className="text-sm">
                              {service.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mental Health Parity */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg">Mental Health Parity</CardTitle>
                <CardDescription>Configure mental health parity compliance requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={regulatoryCompliance.mentalHealthParity.enabled}
                    onCheckedChange={(checked) =>
                      setRegulatoryCompliance({
                        ...regulatoryCompliance,
                        mentalHealthParity: {
                          ...regulatoryCompliance.mentalHealthParity,
                          enabled: checked,
                        },
                      })
                    }
                  />
                  <Label>Enable Mental Health Parity Compliance</Label>
                </div>

                {regulatoryCompliance.mentalHealthParity.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={regulatoryCompliance.mentalHealthParity.treatmentLimits}
                          onCheckedChange={(checked) =>
                            setRegulatoryCompliance({
                              ...regulatoryCompliance,
                              mentalHealthParity: {
                                ...regulatoryCompliance.mentalHealthParity,
                                treatmentLimits: checked,
                              },
                            })
                          }
                        />
                        <Label>Treatment Limits Parity</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={regulatoryCompliance.mentalHealthParity.financialRequirements}
                          onCheckedChange={(checked) =>
                            setRegulatoryCompliance({
                              ...regulatoryCompliance,
                              mentalHealthParity: {
                                ...regulatoryCompliance.mentalHealthParity,
                                financialRequirements: checked,
                              },
                            })
                          }
                        />
                        <Label>Financial Requirements Parity</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={regulatoryCompliance.mentalHealthParity.quantitativeLimits}
                        onCheckedChange={(checked) =>
                          setRegulatoryCompliance({
                            ...regulatoryCompliance,
                            mentalHealthParity: {
                              ...regulatoryCompliance.mentalHealthParity,
                              quantitativeLimits: checked,
                            },
                          })
                        }
                      />
                      <Label>Quantitative Limits Parity</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
