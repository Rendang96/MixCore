// Constants
const COMPANY_FORM_STORAGE_KEY = "company_form_draft"

// Helper function to load operational segmentation data from localStorage
export const loadOperationalSegmentationFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return operational segmentation data if available
      if (parsedData.operationalSegmentation) {
        return parsedData.operationalSegmentation
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.operationalSegmentation) {
        return currentCompany.operationalSegmentation
      }
    }

    return null
  } catch (error) {
    console.error("Error loading operational segmentation data from local storage:", error)
    return null
  }
}

// Helper function to load job grade data from localStorage
export const loadJobGradeFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return job grade data if available
      if (parsedData.jobGrade) {
        return parsedData.jobGrade
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.jobGrade) {
        return currentCompany.jobGrade
      }
    }

    return null
  } catch (error) {
    console.error("Error loading job grade data from local storage:", error)
    return null
  }
}

// Helper function to load report frequency data from localStorage
export const loadReportFrequencyFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return report frequency data if available
      if (parsedData.reportFrequency) {
        return parsedData.reportFrequency
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.reportFrequency) {
        return currentCompany.reportFrequency
      }
    }

    return null
  } catch (error) {
    console.error("Error loading report frequency data from local storage:", error)
    return null
  }
}

// Helper function to load medical provider data from localStorage
export const loadMedicalProviderFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return medical provider data if available
      if (parsedData.medicalProvider) {
        return parsedData.medicalProvider
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.medicalProvider) {
        return currentCompany.medicalProvider
      }
    }

    return null
  } catch (error) {
    console.error("Error loading medical provider data from local storage:", error)
    return null
  }
}

// Helper function to load SOB data from localStorage
export const loadSOBFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return SOB data if available
      if (parsedData.sob) {
        return parsedData.sob
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.sob) {
        return currentCompany.sob
      }
    }

    return null
  } catch (error) {
    console.error("Error loading SOB data from local storage:", error)
    return null
  }
}

// Helper function to load contract history data from localStorage
export const loadContractHistoryFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return contract history data if available
      if (parsedData.contractHistory) {
        return parsedData.contractHistory
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.contractHistory) {
        return currentCompany.contractHistory
      }
    }

    return null
  } catch (error) {
    console.error("Error loading contract history data from local storage:", error)
    return null
  }
}

// Add this function after the other loading functions
export const loadPayorFromLocalStorage = (company: any) => {
  try {
    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return payor data if available
      if (parsedData.payor) {
        return parsedData.payor
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.payor) {
        return currentCompany.payor
      }
    }

    return null
  } catch (error) {
    console.error("Error loading payor data from local storage:", error)
    return null
  }
}
