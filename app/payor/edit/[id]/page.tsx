export default function EditPayorPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Payor</h1>
      <p>Editing payor with ID: {params.id}</p>
    </div>
  )
}
