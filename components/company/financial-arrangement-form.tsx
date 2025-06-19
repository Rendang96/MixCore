"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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
  const [paymentTerms, setPaymentTerms] = useState<string>(initialData[0]?.paymentTerms || "")
  const [billingFrequency, setBillingFrequency] = useState<string>(initialData[0]?.billingFrequency || "")
  const [currency, setCurrency] = useState<string>(initialData[0]?.currency || "")
  const [creditLimit, setCreditLimit] = useState<string>(initialData[0]?.creditLimit || "")
  const [blockToAccounting, setBlockToAccounting] = useState<boolean>(initialData[0]?.blockToAccounting || false)
  const [specialTerms, setSpecialTerms] = useState<string>(initialData[0]?.specialTerms || "")

  const handleSave = () => {
    const financialArrangementData = [
      {
        paymentTerms,
        billingFrequency,
        currency,
        creditLimit,
        blockToAccounting,
        specialTerms,
      },
    ]
    onSaveData(financialArrangementData)
    onNext()
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-6">Financial Arrangement</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="payment-terms" className="text-sm font-medium text-slate-700">
            Payment Terms
          </label>
          <Select value={paymentTerms} onValueChange={setPaymentTerms}>
            <SelectTrigger id="payment-terms" className="w-full">
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
          <label htmlFor="billing-frequency" className="text-sm font-medium text-slate-700">
            Billing Frequency
          </label>
          <Select value={billingFrequency} onValueChange={setBillingFrequency}>
            <SelectTrigger id="billing-frequency" className="w-full">
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
          <label htmlFor="currency" className="text-sm font-medium text-slate-700">
            Currency
          </label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="myr">MYR - Malaysian Ringgit</SelectItem>
              <SelectItem value="usd">USD - US Dollar</SelectItem>
              <SelectItem value="sgd">SGD - Singapore Dollar</SelectItem>
              <SelectItem value="eur">EUR - Euro</SelectItem>
              <SelectItem value="gbp">GBP - British Pound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="credit-limit" className="text-sm font-medium text-slate-700">
            Credit Limit
          </label>
          <Input
            id="credit-limit"
            className="w-full"
            placeholder="Enter credit limit"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Block to Accounting</label>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="block-yes"
                name="block-accounting"
                value="yes"
                checked={blockToAccounting === true}
                onChange={() => setBlockToAccounting(true)}
                className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
              />
              <label htmlFor="block-yes" className="text-sm text-slate-700">
                Yes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="block-no"
                name="block-accounting"
                value="no"
                checked={blockToAccounting === false}
                onChange={() => setBlockToAccounting(false)}
                className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
              />
              <label htmlFor="block-no" className="text-sm text-slate-700">
                No
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <label htmlFor="special-terms" className="text-sm font-medium text-slate-700">
            Special Terms & Conditions
          </label>
          <Textarea
            id="special-terms"
            className="w-full min-h-[120px]"
            placeholder="Enter any special financial terms or conditions"
            value={specialTerms}
            onChange={(e) => setSpecialTerms(e.target.value)}
          />
        </div>
      </div>

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
