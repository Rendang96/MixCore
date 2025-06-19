import { addCompany, getCompanies } from "./company-storage"

// Function to initialize dummy company data
export const initializeDummyCompanies = (force = false) => {
  // Only initialize if there are no companies or force is true
  if (getCompanies().length === 0 || force) {
    // Clear existing companies if force is true
    if (force) {
      localStorage.removeItem("companies")
    }

    // Add one complete dummy company
    addCompany({
      id: 1,
      name: "Global Tech Solutions Sdn Bhd",
      code: "GTS-2024",
      status: "Active",
      registrationNo: "RC202400123",
      gstSstRegNo: "GST000123456789",
      tinNo: "TIN987654321",
      companyType: "Independent",
      parentCompany: "",
      hierarchyLevel: "1",
      subsidiaries: 0,
      joiningDate: "2024-01-15",
      contractStart: "2024-01-15",
      contractEnd: "2026-01-14",
      programType: "Fully-insured",
      industry: "Technology",
      subIndustry: "Software Development",
      website: "https://globaltechsolutions.com.my",
      phoneNo: "+603-2123-4567",
      contacts: [
        {
          id: 1,
          name: "Ahmad Rahman",
          position: "Chief Executive Officer",
          email: "ahmad.rahman@globaltechsolutions.com.my",
          phone: "+6012-345-6789",
        },
        {
          id: 2,
          name: "Siti Nurhaliza",
          position: "Human Resources Director",
          email: "siti.nurhaliza@globaltechsolutions.com.my",
          phone: "+6012-345-6790",
        },
        {
          id: 3,
          name: "Lim Wei Ming",
          position: "Chief Financial Officer",
          email: "lim.weiming@globaltechsolutions.com.my",
          phone: "+6012-345-6791",
        },
      ],
      operationalSegmentation: {
        0: {
          id: 1,
          name: "Headquarters",
          code: "HQ-001",
          type: "Main Office",
          status: "Active",
          parentStructure: "",
          address: "Level 15, Menara Axiata, No. 9, Jalan Stesen Sentral 5",
          postcode: "50470",
          city: "Kuala Lumpur",
          state: "Kuala Lumpur",
          country: "Malaysia",
          remarks: "Main headquarters and primary operations center",
        },
        1: {
          id: 2,
          name: "Penang Branch",
          code: "PNG-002",
          type: "Branch Office",
          status: "Active",
          parentStructure: "HQ-001",
          address: "Unit 10-3A, Menara KOMTAR, Jalan Penang",
          postcode: "10000",
          city: "George Town",
          state: "Penang",
          country: "Malaysia",
          remarks: "Northern region operations and development center",
        },
      },
      jobGrade: {
        0: {
          category: "Executive Level",
          grades: ["Executive", "Senior Executive", "Principal Executive"],
        },
        1: {
          category: "Management Level",
          grades: ["Assistant Manager", "Manager", "Senior Manager"],
        },
        2: {
          category: "Leadership Level",
          grades: ["Director", "Senior Director", "Vice President"],
        },
      },
      reportFrequency: {
        0: {
          id: "RPT-001",
          reportType: "Claims Summary",
          reportFrequency: "Monthly",
          deliveryMethod: "Email",
          recipients: "ahmad.rahman@globaltechsolutions.com.my, siti.nurhaliza@globaltechsolutions.com.my",
        },
        1: {
          id: "RPT-002",
          reportType: "Utilization Report",
          reportFrequency: "Quarterly",
          deliveryMethod: "Portal Download",
          recipients: "lim.weiming@globaltechsolutions.com.my",
        },
        2: {
          id: "RPT-003",
          reportType: "Annual Summary",
          reportFrequency: "Annually",
          deliveryMethod: "Email & Portal",
          recipients: "ahmad.rahman@globaltechsolutions.com.my",
        },
      },
      medicalProvider: {
        providers: [
          "KPJ Healthcare Berhad",
          "Pantai Holdings Berhad",
          "Gleneagles Hospital",
          "Prince Court Medical Centre",
          "Sunway Medical Centre",
        ],
      },
      sob: {
        benefits: [
          "Outpatient: RM 5,000 per year",
          "Inpatient: RM 200,000 per year",
          "Dental: RM 2,500 per year",
          "Optical: RM 1,000 per year",
          "Maternity: RM 15,000 per pregnancy",
          "Health Screening: RM 800 per year",
          "Specialist Consultation: RM 150 per visit",
        ],
      },
      contractHistory: [
        {
          id: 1,
          startDate: "2024-01-15",
          endDate: "2026-01-14",
          status: "Active",
          modifiedBy: "System Administrator",
          modifiedDate: "2024-01-10",
        },
      ],
    })

    // Add additional dummy companies without completionStatus
    addCompany({
      id: 2,
      name: "Malaysia Healthcare Services Sdn Bhd",
      code: "MHS-2024",
      status: "Active",
      registrationNo: "RC202400456",
      companyType: "Subsidiary",
      parentCompany: "Global Tech Solutions Sdn Bhd",
      hierarchyLevel: "2",
      subsidiaries: 1,
      joiningDate: "2024-02-01",
      contractStart: "2024-02-01",
      contractEnd: "2026-01-31",
      programType: "Self-funded",
      industry: "Healthcare",
      subIndustry: "Medical Services",
    })

    addCompany({
      id: 3,
      name: "Innovative Manufacturing Sdn Bhd",
      code: "IMS-2024",
      status: "Inactive",
      registrationNo: "RC202400789",
      companyType: "Independent",
      parentCompany: "",
      hierarchyLevel: "1",
      subsidiaries: 0,
      joiningDate: "2024-03-15",
      contractStart: "2024-03-15",
      contractEnd: "2025-03-14",
      programType: "Fully-insured",
      industry: "Manufacturing",
      subIndustry: "Electronics",
    })

    addCompany({
      id: 4,
      name: "Financial Solutions Group Sdn Bhd",
      code: "FSG-2024",
      status: "Active",
      registrationNo: "RC202400321",
      companyType: "Subsidiary",
      parentCompany: "Global Tech Solutions Sdn Bhd",
      hierarchyLevel: "3",
      subsidiaries: 0,
      joiningDate: "2024-04-01",
      contractStart: "2024-04-01",
      contractEnd: "2026-03-31",
      programType: "Self-funded",
      industry: "Finance",
      subIndustry: "Financial Services",
    })

    console.log("Complete dummy company data initialized successfully")
    return true
  }

  console.log("Dummy company already exists, skipping initialization")
  return false
}
