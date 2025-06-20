import { PageHeader } from "@/components/page-header"

export default function ProviderDoctorPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Provider Doctors" description="Manage provider doctors" />
      <div className="bg-white p-6 rounded-md border">
        <p>Provider doctors content will be displayed here.</p>
      </div>
    </div>
  )
}
