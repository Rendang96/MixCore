import { Home } from "lucide-react"

const breadcrumbItems = [
  { label: <Home className="h-4 w-4" />, href: "/" },
  { label: "Company", href: "/company" },
  { label: "New Company", href: "/company/add" },
  { label: "Job Grade" },
]

const Page = () => {
  return (
    <div>
      <h1>Add Job Grade</h1>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <a href={item.href} className="text-blue-500 hover:underline">
                {item.label}
              </a>
              {index < breadcrumbItems.length - 1 && <span className="mx-2 text-gray-500">/</span>}
            </li>
          ))}
        </ol>
      </nav>
      {/* Form to add job grade */}
      <form>
        {/* Form fields go here */}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Page
