import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  return (
    <div>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: <Home className="h-4 w-4" />, href: "/" },
            { label: "Onboarding", href: "/onboarding" },
          ]}
        />
      </div>

      <h1 className="text-2xl font-bold mb-6">Onboarding</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Corporate Client</CardTitle>
            <CardDescription>Onboard a new corporate client</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/onboarding/corporate-client">
              <Button>Start Onboarding</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Individual Policy</CardTitle>
            <CardDescription>Onboard a new individual policy</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/onboarding/individual-policy">
              <Button>Start Onboarding</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
