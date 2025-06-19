"use client"

import { useState, useEffect } from "react"

interface ViewFinancialArrangementProps {
  company: {
    id: number
    financialArrangement?: any
  }
}

const COMPANY_FORM_STORAGE_KEY = "company_form_draft"

// Function to load financial arrangement data from localStorage
const loadFinancialArrangementData = (companyId: number) => {
  try {
    console.log("=== LOADING FINANCIAL ARRANGEMENT DATA ===")
    console.log("Company ID:", companyId)

    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      console.log("Found company_form_draft:", parsedData)

      if (parsedData.financialArrangement) {
        console.log("Found financial arrangement in draft:", parsedData.financialArrangement)
        return parsedData.financialArrangement
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      console.log("Found companies storage:", parsedCompanies)

      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === companyId)
      if (currentCompany) {
        console.log("Found current company:", currentCompany)

        if (currentCompany.financialArrangement) {
          console.log("Found financial arrangement in company data:", currentCompany.financialArrangement)
          return currentCompany.financialArrangement
        }
      }
    }

    // Try alternative storage keys
    const alternativeKeys = [
      `company_${companyId}_financial_arrangement`,
      `financial_arrangement_${companyId}`,
      "financial_arrangement_data",
    ]

    for (const key of alternativeKeys) {
      const data = localStorage.getItem(key)
      if (data) {
        console.log(`Found data in alternative key ${key}:`, data)
        try {
          return JSON.parse(data)
        } catch (e) {
          console.log(`Failed to parse data from ${key}`)
        }
      }
    }

    console.log("No financial arrangement data found anywhere")
    return null
  } catch (error) {
    console.error("Error loading financial arrangement data:", error)
    return null
  }
}

export function ViewFinancialArrangement({ company }: ViewFinancialArrangementProps) {
  const [financialData, setFinancialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      const data = loadFinancialArrangementData(company.id)

      if (data) {
        setFinancialData(data)
      } else if (company.financialArrangement) {
        setFinancialData(company.financialArrangement)
      } else {
        setFinancialData(null)
      }

      setLoading(false)
    }

    loadData()
  }, [company.id, company.financialArrangement])

  // Helper function to format payment terms
  const formatPaymentTerms = (value: string) => {
    switch (value) {
      case "net-15":
        return "Net 15"
      case "net-30":
        return "Net 30"
      case "net-45":
        return "Net 45"
      case "net-60":
        return "Net 60"
      case "net-90":
        return "Net 90"
      default:
        return value || ""
    }
  }

  // Helper function to format billing frequency
  const formatBillingFrequency = (value: string) => {
    switch (value) {
      case "weekly":
        return "Weekly"
      case "monthly":
        return "Monthly"
      case "quarterly":
        return "Quarterly"
      case "semi-annually":
        return "Semi-annually"
      case "annually":
        return "Annually"
      default:
        return value || ""
    }
  }

  // Helper function to format currency
  const formatCurrency = (value: string) => {
    switch (value) {
      case "myr":
        return "MYR - Malaysian Ringgit"
      case "usd":
        return "USD - US Dollar"
      case "sgd":
        return "SGD - Singapore Dollar"
      case "eur":
        return "EUR - Euro"
      case "gbp":
        return "GBP - British Pound"
      default:
        return value || ""
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-500 border rounded-md">Loading financial arrangement data...</div>
    )
  }

  if (!financialData) {
    return (
      <div className="text-center py-8 text-slate-500 border rounded-md">No financial arrangement data available</div>
    )
  }

  // Handle both array and single object formats
  const dataArray = Array.isArray(financialData) ? financialData : [financialData]

  return (
    <div className="space-y-6">
      {dataArray.map((arrangement: any, index: number) => (
        <div key={index} className="rounded-lg border bg-white p-6 shadow-sm">
          <h4 className="text-lg font-medium text-slate-700 mb-6">
            Financial Arrangement {dataArray.length > 1 ? index + 1 : ""}
          </h4>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Payment Terms</label>
              <div className="border rounded-md p-2 bg-gray-50">{formatPaymentTerms(arrangement.paymentTerms)}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Billing Frequency</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {formatBillingFrequency(arrangement.billingFrequency)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Currency</label>
              <div className="border rounded-md p-2 bg-gray-50">{formatCurrency(arrangement.currency)}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Credit Limit</label>
              <div className="border rounded-md p-2 bg-gray-50">{arrangement.creditLimit || ""}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Block to Accounting</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {arrangement.blockToAccounting === true ? "Yes" : arrangement.blockToAccounting === false ? "No" : ""}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Special Terms & Conditions</label>
              <div className="border rounded-md p-2 bg-gray-50 min-h-[100px]">{arrangement.specialTerms || ""}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
