export default function ViewPayorPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">View Payor</h1>
      <p>Viewing payor with ID: {params.id}</p>
    </div>
  )
}
