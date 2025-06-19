"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const STORAGE_KEY = "company_form_draft"

interface FinancialArrangementFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: any[]
  onSaveData: (data: any[]) => void
}

export function FinancialArrangementForm({
  onNext,
  onBack,
  initialData = [],
  onSaveData,
}: FinancialArrangementFormProps) {
  const [tpaPaymentTerm, setTpaPaymentTerm] = useState<string>(initialData[0]?.tpaPaymentTerm || "")
  const [tpaPaymentTerms, setTpaPaymentTerms] = useState<string>(initialData[0]?.tpaPaymentTerms || "")
  const [tpaBillingFrequency, setTpaBillingFrequency] = useState<string>(initialData[0]?.tpaBillingFrequency || "")
  const [tpaSpecialTerms, setTpaSpecialTerms] = useState<string>(initialData[0]?.tpaSpecialTerms || "")

  const [medicalPaymentTerms, setMedicalPaymentTerms] = useState<string>(initialData[1]?.medicalPaymentTerms || "")
  const [medicalBillingFrequency, setMedicalBillingFrequency] = useState<string>(
    initialData[1]?.medicalBillingFrequency || "",
  )
  const [medicalFloat, setMedicalFloat] = useState<string>(
    initialData[1]?.medicalFloat || initialData[1]?.medicalCreditLimit || "",
  )
  const [medicalBlockToAccounting, setMedicalBlockToAccounting] = useState<boolean>(
    initialData[1]?.medicalBlockToAccounting || false,
  )
  const [medicalSpecialTerms, setMedicalSpecialTerms] = useState<string>(initialData[1]?.medicalSpecialTerms || "")

  // Load saved data from localStorage when component mounts - but only if initialData is provided
  useEffect(() => {
    // Only load from localStorage if we have initialData (meaning we're editing, not creating new)
    if (initialData && initialData.length > 0) {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          if (parsedData.financialArrangement && parsedData.financialArrangement.length > 0) {
            const tpaData = parsedData.financialArrangement[0] || {}
            const medicalData = parsedData.financialArrangement[1] || {}

            // Load TPA data
            setTpaPaymentTerm(tpaData.paymentTerm || "")
            setTpaPaymentTerms(tpaData.paymentTerms || "")
            setTpaBillingFrequency(tpaData.billingFrequency || "")
            setTpaSpecialTerms(tpaData.specialTerms || "")

            // Load Medical data
            setMedicalPaymentTerms(medicalData.paymentTerms || "")
            setMedicalBillingFrequency(medicalData.billingFrequency || "")
            setMedicalFloat(medicalData.float || "")
            setMedicalBlockToAccounting(medicalData.blockToAccounting || false)
            setMedicalSpecialTerms(medicalData.specialTerms || "")
          }
        }
      } catch (error) {
        console.error("Error loading financial arrangement data from localStorage:", error)
      }
    }
  }, [initialData])

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      const parsedData = savedData ? JSON.parse(savedData) : {}

      const financialArrangementData = [
        {
          paymentTerm: tpaPaymentTerm,
          paymentTerms: tpaPaymentTerms,
          billingFrequency: tpaBillingFrequency,
          specialTerms: tpaSpecialTerms,
        },
        {
          paymentTerms: medicalPaymentTerms,
          billingFrequency: medicalBillingFrequency,
          float: medicalFloat,
          blockToAccounting: medicalBlockToAccounting,
          specialTerms: medicalSpecialTerms,
        },
      ]

      parsedData.financialArrangement = financialArrangementData
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData))
    } catch (error) {
      console.error("Error saving financial arrangement data to localStorage:", error)
    }
  }, [
    tpaPaymentTerm,
    tpaPaymentTerms,
    tpaBillingFrequency,
    tpaSpecialTerms,
    medicalPaymentTerms,
    medicalBillingFrequency,
    medicalFloat,
    medicalBlockToAccounting,
    medicalSpecialTerms,
  ])

  const handleSave = () => {
    const financialArrangementData = [
      {
        paymentTerm: tpaPaymentTerm,
        paymentTerms: tpaPaymentTerms,
        billingFrequency: tpaBillingFrequency,
        specialTerms: tpaSpecialTerms,
      },
      {
        paymentTerms: medicalPaymentTerms,
        billingFrequency: medicalBillingFrequency,
        float: medicalFloat,
        blockToAccounting: medicalBlockToAccounting,
        specialTerms: medicalSpecialTerms,
      },
    ]
    onSaveData(financialArrangementData)
    onNext()
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-6">Financial Arrangement</h3>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
        {/* TPA Fees Section */}
        <section className="mb-8">
          <h4 className="text-xl font-semibold text-slate-700 mb-4">TPA Fees</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="tpa-payment-term" className="text-sm font-medium text-slate-700">
                Payment Term
              </label>
              <Select value={tpaPaymentTerm} onValueChange={setTpaPaymentTerm}>
                <SelectTrigger id="tpa-payment-term" className="w-full">
                  <SelectValue placeholder="Select payment term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lump-sum-annually">Lump Sum/ Annually</SelectItem>
                  <SelectItem value="as-billed">As Billed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tpa-payment-terms" className="text-sm font-medium text-slate-700">
                Credit Term (Days)
              </label>
              <Select value={tpaPaymentTerms} onValueChange={setTpaPaymentTerms}>
                <SelectTrigger id="tpa-payment-terms" className="w-full">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-15">Net 15</SelectItem>
                  <SelectItem value="net-30">Net 30</SelectItem>
                  <SelectItem value="net-45">Net 45</SelectItem>
                  <SelectItem value="net-60">Net 60</SelectItem>
                  <SelectItem value="net-90">Net 90</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tpa-billing-frequency" className="text-sm font-medium text-slate-700">
                Billing Frequency
              </label>
              <Select value={tpaBillingFrequency} onValueChange={setTpaBillingFrequency}>
                <SelectTrigger id="tpa-billing-frequency" className="w-full">
                  <SelectValue placeholder="Select billing frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-1">
              <label htmlFor="tpa-special-terms" className="text-sm font-medium text-slate-700">
                Special Terms & Conditions
              </label>
              <Textarea
                id="tpa-special-terms"
                className="w-full min-h-[120px]"
                placeholder="Enter any special financial terms or conditions"
                value={tpaSpecialTerms}
                onChange={(e) => setTpaSpecialTerms(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Medical Claim Fees Section */}
        <section className="mb-8">
          <h4 className="text-xl font-semibold text-slate-700 mb-4">Medical Claims</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="medical-payment-terms" className="text-sm font-medium text-slate-700">
                Credit Term (Days)
              </label>
              <Select value={medicalPaymentTerms} onValueChange={setMedicalPaymentTerms}>
                <SelectTrigger id="medical-payment-terms" className="w-full">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-15">Net 15</SelectItem>
                  <SelectItem value="net-30">Net 30</SelectItem>
                  <SelectItem value="net-45">Net 45</SelectItem>
                  <SelectItem value="net-60">Net 60</SelectItem>
                  <SelectItem value="net-90">Net 90</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="medical-billing-frequency" className="text-sm font-medium text-slate-700">
                Billing Frequency
              </label>
              <Select value={medicalBillingFrequency} onValueChange={setMedicalBillingFrequency}>
                <SelectTrigger id="medical-billing-frequency" className="w-full">
                  <SelectValue placeholder="Select billing frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="medical-float" className="text-sm font-medium text-slate-700">
                Float
              </label>
              <Input
                id="medical-float"
                className="w-full"
                placeholder="Enter float value"
                value={medicalFloat}
                onChange={(e) => setMedicalFloat(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Block to Accounting</label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="medical-block-yes"
                    name="medical-block-accounting"
                    value="yes"
                    checked={medicalBlockToAccounting === true}
                    onChange={() => setMedicalBlockToAccounting(true)}
                    className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                  />
                  <label htmlFor="medical-block-yes" className="text-sm text-slate-700">
                    Yes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="medical-block-no"
                    name="medical-block-accounting"
                    value="no"
                    checked={medicalBlockToAccounting === false}
                    onChange={() => setMedicalBlockToAccounting(false)}
                    className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                  />
                  <label htmlFor="medical-block-no" className="text-sm text-slate-700">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="medical-special-terms" className="text-sm font-medium text-slate-700">
                Special Terms & Conditions
              </label>
              <Textarea
                id="medical-special-terms"
                className="w-full min-h-[120px]"
                placeholder="Enter any special financial terms or conditions"
                value={medicalSpecialTerms}
                onChange={(e) => setMedicalSpecialTerms(e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>{" "}
      {/* Close the new div */}
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
