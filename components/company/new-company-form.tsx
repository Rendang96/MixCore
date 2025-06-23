import type React from "react"

const NewCompanyForm: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Company Form</h1>

      {/* Company Info Step */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Company Info</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">
              Company Type
            </label>
            <select
              id="companyType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="parentCompany" className="block text-sm font-medium text-gray-700">
                Parent Company
              </label>
              <input
                type="text"
                id="parentCompany"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="hierarchy-level" className="text-sm font-medium text-slate-700">
                Hierarchy Level
              </label>
              <input
                type="number"
                id="hierarchyLevel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="subsidiaries" className="text-sm font-medium text-slate-700">
                Subsidiaries
              </label>
              <input
                type="text"
                id="subsidiaries"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Step */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact Info</h2>
        {/* Contact Info fields here */}
      </section>

      {/* Financial Info Step */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Financial Info</h2>
        {/* Financial Info fields here */}
      </section>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Company
        </button>
      </div>
    </div>
  )
}

export default NewCompanyForm
