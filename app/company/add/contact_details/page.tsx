import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function ContactDetailsPage() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Companies", href: "/company" },
          { label: "Add Company", href: "/company/add" },
          { label: "Contact Details", href: "/company/add/contact_details", active: true },
        ]}
      />
      <h1>Contact Details</h1>
      {/* Add your contact details form or content here */}
    </div>
  )
}
