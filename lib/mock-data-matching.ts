export interface UploadedProvider {
  id: string
  name: string
  address: string
  contact: string
  sourceFile: string
}

export interface MatchedProvider {
  id: string
  providerCode: string
  providerName: string
  address: string
  contact: string
  panelStatus: "✅ Panel" | "❌ Non-Panel"
  nearbyPanelAlternatives: string
}

export interface UnmatchedProvider {
  id: string
  providerName: string
  address: string
  contact: string
  sourceFile: string
  issue: string
}

// Mock data for initial display or after a reset
export const mockMatchedProviders: MatchedProvider[] = [
  {
    id: "m1",
    providerCode: "PRV-1001",
    providerName: "Klinik ABC",
    address: "Jalan Tun Razak",
    contact: "03-XXXX XXXX",
    panelStatus: "✅ Panel",
    nearbyPanelAlternatives: "-",
  },
  {
    id: "m2",
    providerCode: "PRV-1002",
    providerName: "Hospital XYZ (Non-Panel)",
    address: "Jalan Bukit Bintang",
    contact: "03-YYYY YYYY",
    panelStatus: "❌ Non-Panel",
    nearbyPanelAlternatives: "1. Klinik DEF (2.3km)",
  },
]

export const mockUnmatchedProviders: UnmatchedProvider[] = [
  {
    id: "u1",
    providerName: "Klinik ABC 123",
    address: "Jln Tun Razak",
    contact: "03-ZZZ ZZZZ",
    sourceFile: "claims.csv",
    issue: "Name typo",
  },
  {
    id: "u2",
    providerName: "Dental Clinic",
    address: "Missing address",
    contact: "-",
    sourceFile: "providers.xlsx",
    issue: "Incomplete",
  },
]

// Simulate a backend matching function with latency
export async function mockMatchProviders(
  uploadedData: UploadedProvider[],
): Promise<{ matched: MatchedProvider[]; unmatched: UnmatchedProvider[] }> {
  // Simulate network delay (200ms - 1s)
  const delay = Math.random() * 800 + 200
  await new Promise((resolve) => setTimeout(resolve, delay))

  const matched: MatchedProvider[] = []
  const unmatched: UnmatchedProvider[] = []

  uploadedData.forEach((row) => {
    // Tier 1: Exact matching simulation (simplified)
    const exactMatch = mockMatchedProviders.find(
      (p) => p.providerName.toLowerCase() === row.name.toLowerCase() && p.contact === row.contact,
    )

    if (exactMatch) {
      matched.push({ ...exactMatch, id: `matched-${row.id}` }) // Assign new ID to avoid conflicts
    } else {
      // Tier 2: Fuzzy matching simulation (simplified)
      const fuzzyCandidates = mockMatchedProviders.filter((p) => {
        // Simulate fuzz.ratio (e.g., simple address substring check)
        return p.address.toLowerCase().includes(row.address.toLowerCase().substring(0, 5)) && row.address.length > 5
      })

      if (fuzzyCandidates.length > 0) {
        // Simulate confidence score calculation
        const confidenceScore = Math.floor(Math.random() * 30) + 70 // 70-99%
        if (confidenceScore > 70) {
          // Example threshold
          const bestCandidate = fuzzyCandidates[0] // Just pick the first for simplicity
          matched.push({
            id: `matched-${row.id}`,
            providerCode: bestCandidate.providerCode,
            providerName: bestCandidate.providerName,
            address: bestCandidate.address,
            contact: bestCandidate.contact,
            panelStatus: bestCandidate.panelStatus,
            nearbyPanelAlternatives: bestCandidate.nearbyPanelAlternatives,
          })
        } else {
          unmatched.push({
            id: `unmatched-${row.id}`,
            providerName: row.name,
            address: row.address,
            contact: row.contact,
            sourceFile: row.sourceFile,
            issue: "Low confidence match",
          })
        }
      } else {
        // No match found
        const issue = row.address === "Missing address" ? "Incomplete" : "No direct match"
        unmatched.push({
          id: `unmatched-${row.id}`,
          providerName: row.name,
          address: row.address,
          contact: row.contact,
          sourceFile: row.sourceFile,
          issue: issue,
        })
      }
    }
  })

  return { matched, unmatched }
}
