import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Contact {
  id: number
  name: string
  position: string
  email: string
  phone: string
  isPrimary: boolean
}

interface ViewCompanyContactDetailsProps {
  contacts: Contact[]
}

export function ViewCompanyContactDetails({ contacts }: ViewCompanyContactDetailsProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Contact Details</h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone No.</TableHead>
              <TableHead>Primary Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="text-blue-600">{contact.name}</TableCell>
                <TableCell>{contact.position}</TableCell>
                <TableCell className="text-amber-600">{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <span className={contact.isPrimary ? "text-green-600" : "text-gray-600"}>
                    {contact.isPrimary ? "Yes" : "No"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
